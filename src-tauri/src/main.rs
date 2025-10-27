// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use walkdir::WalkDir;
use notify::RecursiveMode;
use std::sync::mpsc::{channel};
use std::time::Duration;
use notify_debouncer_mini::new_debouncer;
use tauri::Manager;
use encoding_rs::{WINDOWS_1252};

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct Trade {
    id: String,
    asset: String,
    open_time: String,
    close_time: String,
    duration: String,
    quantity: f64,
    side: String,
    open_price: f64,
    close_price: f64,
    result: f64,
    contracts: f64,
    brokerage: f64,
    b3_fees: f64,
}

#[derive(Debug, Deserialize)]
struct RawTrade {
    #[serde(rename = "Ativo")]
    asset: String,
    #[serde(rename = "Abertura")]
    open_time: String,
    #[serde(rename = "Fechamento")]
    close_time: String,
    #[serde(rename = "Tempo Operação")]
    duration: String,
    #[serde(rename = "Qtd Compra")]
    buy_qty: String,
    #[serde(rename = "Lado")]
    side: String,
    #[serde(rename = "Preço Compra")]
    buy_price: String,
    #[serde(rename = "Preço Venda")]
    sell_price: String,
    #[serde(rename = "Res. Operação")]
    result: String,
}

fn parse_float(value: &str) -> f64 {
    value.replace(".", "").replace(",", ".").parse::<f64>().unwrap_or(0.0)
}

fn parse_brazilian_datetime(datetime: &str) -> String {
    let parts: Vec<&str> = datetime.split(' ').collect();
    if parts.len() != 2 {
        return datetime.to_string(); // Return original if format is unexpected
    }
    let date_parts: Vec<&str> = parts[0].split('/').collect();
    if date_parts.len() != 3 {
        return datetime.to_string();
    }
    // Rearrange from DD/MM/YYYY to YYYY-MM-DD and join with time
    format!("{}-{}-{}T{}", date_parts[2], date_parts[1], date_parts[0], parts[1])
}

// Internal function to get trades, not a Tauri command
fn _get_trades_internal() -> Result<Vec<Trade>, String> {
    let trades_dir = PathBuf::from(r"C:\Users\nicol\OneDrive\Documentos\trades");
    let mut all_trades = Vec::new();

    for entry in WalkDir::new(&trades_dir)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        let path = entry.path();
        if path.is_file() && path.extension().map_or(false, |ext| ext == "csv") {
            let bytes = fs::read(path).map_err(|e| {
                eprintln!("Error reading file {:?}: {}", path, e);
                e.to_string()
            })?;

            let (cow, _, had_errors) = WINDOWS_1252.decode(&bytes);
            if had_errors {
                eprintln!("Decoding errors encountered for file {:?}", path);
            }
            let content = cow.into_owned();

            let content_skipped = content.lines().skip(4).collect::<Vec<_>>().join("\n");

            let mut rdr = csv::ReaderBuilder::new()
                .delimiter(b';')
                .has_headers(true)
                .from_reader(content_skipped.as_bytes());

            for (i, result) in rdr.deserialize::<RawTrade>().enumerate() {
                match result {
                    Ok(raw_trade) => {
                        let open_price = parse_float(&raw_trade.buy_price);
                        let close_price = parse_float(&raw_trade.sell_price);
                        let quantity = parse_float(&raw_trade.buy_qty);
                        let contracts = parse_float(&raw_trade.buy_qty);

                        let trade = Trade {
                            id: format!("trade-{}-{}", path.file_name().unwrap().to_str().unwrap_or("unknown"), i),
                            asset: raw_trade.asset,
                            open_time: parse_brazilian_datetime(&raw_trade.open_time),
                            close_time: parse_brazilian_datetime(&raw_trade.close_time),
                            duration: raw_trade.duration,
                            quantity,
                            side: raw_trade.side,
                            open_price,
                            close_price,
                            result: parse_float(&raw_trade.result),
                            contracts,
                            brokerage: 0.0,
                            b3_fees: 0.0,
                        };
                        all_trades.push(trade);
                    },
                    Err(e) => {
                        eprintln!("Error deserializing trade from {:?}: {}", path, e);
                    }
                }
            }
        }
    }
    Ok(all_trades)
}

#[tauri::command]
fn get_trades() -> Result<Vec<Trade>, String> {
    _get_trades_internal()
}

#[tauri::command]
fn save_trades(trades: Vec<Trade>) -> Result<(), String> {
    // For now, this is a placeholder.
    // In the future, this will save the trades to a file.
    println!("Saving {} trades", trades.len());
    Ok(())
}

fn watch_trades_folder(app_handle: tauri::AppHandle) {
    std::thread::spawn(move || {
        let (tx, rx) = channel();
        let mut debouncer = new_debouncer(Duration::from_secs(1), None, tx).unwrap();

        let trades_dir = PathBuf::from(r"C:\Users\nicol\OneDrive\Documentos\trades");
        debouncer.watcher().watch(&trades_dir, RecursiveMode::Recursive).unwrap();

        for res in rx {
            match res {
                Ok(_) => {
                    println!("Trades folder changed, reloading trades...");
                    let trades = _get_trades_internal().unwrap_or_default();
                    app_handle.emit_all("trades_updated", trades).unwrap();
                },
                Err(e) => println!("watch error: {:?}", e),
            }
        }
    });
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle();
            watch_trades_folder(app_handle.clone());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_trades, save_trades])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
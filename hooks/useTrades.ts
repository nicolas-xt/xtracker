import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { Trade } from '../types';
import { mockTrades } from '../data/mockTrades';
import Papa from 'papaparse';

const IS_DEV = false;

interface UseTradesResponse {
  trades: Trade[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Novo: aceita caminho do CSV (apenas em dev)
export const useTrades = (csvPath?: string): UseTradesResponse => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (IS_DEV && csvPath) {
        // Em desenvolvimento, lê CSV customizado
        const res = await fetch(csvPath);
        if (!res.ok) throw new Error('Erro ao carregar CSV');
        const csvText = await res.text();
        const parsed = Papa.parse<any>(csvText, { header: true });
        // Accept rows that contain at least one expected identifier
        const rows = parsed.data.filter((row: any) => row && (row.asset || row.symbol || row.openTime || row.date));
        setTrades(rows as Trade[]);
      } else if (IS_DEV) {
        // Fallback: dados mocados
        await new Promise(resolve => setTimeout(resolve, 500));
        setTrades(mockTrades);
      } else {
        // Em produção, chama backend Tauri
        const fetchedTrades = await invoke<Trade[]>('get_trades');
        setTrades(fetchedTrades);
      }
    } catch (err) {
      console.error("Error fetching trades:", err);
      setError("Falha ao carregar os trades.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTrades();

    // Se não estiver em desenvolvimento, ouve por atualizações do backend
    if (!IS_DEV) {
      const unlisten = listen('trades_updated', (event) => {
        console.log("Trades updated event received:", event.payload);
        setTrades(event.payload as Trade[]);
      });

      return () => {
        unlisten.then(f => f());
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csvPath]);

  return { trades, isLoading, error, refetch: fetchTrades };
};

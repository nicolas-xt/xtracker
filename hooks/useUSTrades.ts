import { useEffect, useState } from 'react';
import Papa from 'papaparse';

export interface USTrade {
  symbol: string;
  openTime: string;
  closeTime: string;
  qty: number;
  price: number;
  side: string;
  pnl: number;
  [key: string]: any;
}

export function useUSTrades(csvPath: string) {
  const [trades, setTrades] = useState<USTrade[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!csvPath) return;
    setIsLoading(true);
    setError(null);
    fetch(csvPath)
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar CSV');
        return res.text();
      })
      .then((csvText) => {
        const parsed = Papa.parse<USTrade>(csvText, { header: true });
        setTrades(parsed.data.filter((row) => row.symbol));
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [csvPath]);

  return { trades, isLoading, error };
}

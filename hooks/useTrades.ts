import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { Trade } from '../types';
import { mockTrades } from '../data/mockTrades';

const IS_DEV = false;

interface UseTradesResponse {
  trades: Trade[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTrades = (): UseTradesResponse => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (IS_DEV) {
        // Em desenvolvimento, usamos dados mocados após um delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setTrades(mockTrades);
      } else {
        // Em produção, chamamos o backend do Tauri
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
  }, []);

  return { trades, isLoading, error, refetch: fetchTrades };
};

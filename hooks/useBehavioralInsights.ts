import { useState } from 'react';
import { getBehavioralInsight } from '../utils/geminiService';
import { DetailedStats } from '../types';

interface UseBehavioralInsights {
  insight: string | null;
  isLoading: boolean;
  error: string | null;
  generateInsight: (stats: DetailedStats) => void;
}

export const useBehavioralInsights = (): UseBehavioralInsights => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsight = async (stats: DetailedStats) => {
    setIsLoading(true);
    setError(null);
    setInsight(null);
    try {
      const result = await getBehavioralInsight(stats);
      setInsight(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error("Failed to generate insight:", err);
    }
    setIsLoading(false);
  };

  return { insight, isLoading, error, generateInsight };
};
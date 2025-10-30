import React from 'react';
import { useUSTrades } from '../../hooks/useUSTrades';
import { useDollarRate } from '../../hooks/useDollarRate';
import { useSettings } from '../../src/context/SettingsContext';

const USMarketDashboard: React.FC = () => {
  const { settings } = useSettings();
  const csvPathUS = settings?.csvPathUS ?? '/data/us_trades.csv';
  const { trades, isLoading, error } = useUSTrades(csvPathUS);
  const { rate: dollarRate, isLoading: isRateLoading, error: rateError } = useDollarRate();

  return (
    <div className="p-6 text-center text-white">
      <h2 className="text-2xl font-bold mb-4">Dashboard Mercado Americano</h2>
      {isRateLoading && <p>Buscando cotação do dólar...</p>}
      {rateError && <p className="text-red-400">Erro cotação: {rateError}</p>}
      {dollarRate && (
        <p className="mb-2 text-sm text-gray-300">Cotação atual: <b>US$ 1 = R$ {dollarRate.toFixed(2)}</b></p>
      )}
      {isLoading && <p>Carregando operações...</p>}
      {error && <p className="text-red-400">Erro: {error}</p>}
      {trades && trades.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left border border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-2 py-1">Ativo</th>
                <th className="px-2 py-1">Data</th>
                <th className="px-2 py-1">Qtd</th>
                <th className="px-2 py-1">Preço (US$)</th>
                <th className="px-2 py-1">Preço (R$)</th>
                <th className="px-2 py-1">Lado</th>
                <th className="px-2 py-1">PnL (US$)</th>
                <th className="px-2 py-1">PnL (R$)</th>
              </tr>
            </thead>
            <tbody>
              {trades.slice(0, 20).map((trade, i) => (
                <tr key={i} className="border-b border-gray-700">
                  <td className="px-2 py-1">{(trade as any).symbol || (trade as any).asset || ''}</td>
                  <td className="px-2 py-1">{(trade as any).openTime || (trade as any).date || ''}</td>
                  <td className="px-2 py-1">{(trade as any).qty || (trade as any).quantity || ''}</td>
                  <td className="px-2 py-1">{(trade as any).price || (trade as any).entry || ''}</td>
                  <td className="px-2 py-1">{dollarRate ? (Number((trade as any).price || (trade as any).entry || 0) * dollarRate).toFixed(2) : '-'}</td>
                  <td className="px-2 py-1">{(trade as any).side || ''}</td>
                  <td className="px-2 py-1">{(trade as any).pnl || (trade as any).profit || ''}</td>
                  <td className="px-2 py-1">{dollarRate ? (Number((trade as any).pnl || (trade as any).profit || 0) * dollarRate).toFixed(2) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-gray-400">Exibindo as 20 primeiras operações do CSV.</p>
        </div>
      ) : !isLoading && <p>Nenhuma operação encontrada.</p>}
    </div>
  );
};

export default USMarketDashboard;

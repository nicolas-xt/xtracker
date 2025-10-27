import React from 'react';
import { DetailedStats } from '../../types';

interface StrategyAssertivenessTableProps {
  stats: DetailedStats;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value: number) => {
  return `${(value * 100).toFixed(1)}%`;
};

export const StrategyAssertivenessTable: React.FC<StrategyAssertivenessTableProps> = ({ stats }) => {
  const data = stats.strategyAssertiveness;

  return (
    <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
      <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
      <div className="relative">
        <h3 className="text-lg font-semibold text-white mb-4">Assertividade por Estratégia</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-500/20">
                <th className="text-left text-sm text-gray-400 pb-3">Estratégia</th>
                <th className="text-left text-sm text-gray-400 pb-3">Resultado Total</th>
                <th className="text-left text-sm text-gray-400 pb-3">Operações</th>
                <th className="text-left text-sm text-gray-400 pb-3">Assertividade</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.strategy} className="border-b border-gray-500/10 hover:bg-gray-500/10 transition-colors duration-200">
                  <td className="py-4">
                    <span className="font-medium text-white">{item.strategy}</span>
                  </td>
                  <td className="py-4">
                    <span className={item.totalResult >= 0 ? 'text-[#28C780] font-semibold' : 'text-[#EA3943] font-semibold'}>
                      {formatCurrency(item.totalResult)}
                    </span>
                  </td>
                  <td className="py-4 text-white">{item.totalTrades}</td>
                  <td className="py-4 text-white">{formatPercent(item.winRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

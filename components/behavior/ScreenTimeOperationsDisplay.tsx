import React from 'react';
import { DetailedStats } from '../../types';

interface ScreenTimeOperationsDisplayProps {
  stats: DetailedStats;
}

export const ScreenTimeOperationsDisplay: React.FC<ScreenTimeOperationsDisplayProps> = ({ stats }) => {
  // For now, we'll use totalTrades as a proxy for operations. Screen time tracking would require more complex integration.
  const totalTrades = stats.totalTrades;
  const positiveDays = stats.positiveDays;
  const negativeDays = stats.negativeDays;

  return (
    <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
      <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
      <div className="relative">
        <h3 className="text-lg font-semibold text-white mb-4">Tempo de Tela e Operações</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-[#2A2A2A]/50 to-[#242424]/60 backdrop-blur-[12px] rounded-[12px] border border-gray-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[12px]"></div>
            <p className="relative text-sm text-gray-300">Total de Operações:</p>
            <p className="relative text-sm font-semibold text-white">{totalTrades}</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-[#2A2A2A]/50 to-[#242424]/60 backdrop-blur-[12px] rounded-[12px] border border-gray-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[12px]"></div>
            <p className="relative text-sm text-gray-300">Dias Positivos:</p>
            <p className="relative text-sm font-semibold text-white">{positiveDays}</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-[#2A2A2A]/50 to-[#242424]/60 backdrop-blur-[12px] rounded-[12px] border border-gray-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[12px]"></div>
            <p className="relative text-sm text-gray-300">Dias Negativos:</p>
            <p className="relative text-sm font-semibold text-white">{negativeDays}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

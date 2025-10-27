import React from 'react';
import { DetailedStats } from '../../types';

interface WinLossStreaksDisplayProps {
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

export const WinLossStreaksDisplay: React.FC<WinLossStreaksDisplayProps> = ({ stats }) => {
  const { maxConsecutiveWins, maxConsecutiveLosses, performanceAfterLossStreak, performanceAfterWinStreak } = stats.winLossStreaks;

  return (
    <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
      <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
      <div className="relative">
        <h3 className="text-lg font-semibold text-white mb-4">Sequência de Ganhos/Perdas</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-[#2A2A2A]/50 to-[#242424]/60 backdrop-blur-[12px] rounded-[12px] border border-gray-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[12px]"></div>
            <p className="relative text-sm text-gray-300">Máx. Ganhos Consecutivos:</p>
            <p className="relative text-sm font-semibold text-white">{maxConsecutiveWins}</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-[#2A2A2A]/50 to-[#242424]/60 backdrop-blur-[12px] rounded-[12px] border border-gray-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[12px]"></div>
            <p className="relative text-sm text-gray-300">Máx. Perdas Consecutivas:</p>
            <p className="relative text-sm font-semibold text-white">{maxConsecutiveLosses}</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-[#2A2A2A]/50 to-[#242424]/60 backdrop-blur-[12px] rounded-[12px] border border-gray-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[12px]"></div>
            <p className="relative text-sm text-gray-300">Performance após Sequência de Perdas:</p>
            <p className="relative text-sm font-semibold text-white">{formatCurrency(performanceAfterLossStreak)}</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-[#2A2A2A]/50 to-[#242424]/60 backdrop-blur-[12px] rounded-[12px] border border-gray-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[12px]"></div>
            <p className="relative text-sm text-gray-300">Performance após Sequência de Ganhos:</p>
            <p className="relative text-sm font-semibold text-white">{formatCurrency(performanceAfterWinStreak)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Button } from './button';

interface PeriodSelectorProps {
  timePeriod: string;
  setTimePeriod: (period: string) => void;
  customStartDate?: string;
  customEndDate?: string;
  onCustomClick: () => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  timePeriod,
  setTimePeriod,
  customStartDate,
  customEndDate,
  onCustomClick,
}) => {
  const periods = [
    { key: 'today', label: 'Hoje' },
    { key: 'week', label: 'Esta Semana' },
    { key: 'month', label: 'Este Mês' },
    { key: 'last_month', label: 'Mês Passado' },
    { key: 'year', label: 'Este Ano' },
    { key: 'custom', label: 'Personalizado' },
  ];

  const handlePeriodClick = (period: string) => {
    if (period === 'custom') {
      onCustomClick();
    }
    setTimePeriod(period);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[12px] border border-gray-500/25 rounded-[12px] p-1">
        {periods.map((period) => (
          <Button
            key={period.key}
            onClick={() => handlePeriodClick(period.key)}
            className={`relative px-3 py-1 rounded-[8px] transition-all duration-300 text-sm ${
              timePeriod === period.key
                ? 'bg-gradient-to-r from-[#00D0FF] to-[#0099CC] text-white shadow-md shadow-[#00D0FF]/20'
                : 'text-gray-300 hover:bg-gradient-to-br hover:from-[#2A2A2A]/50 hover:to-[#242424]/60 hover:text-white'
            }`}
          >
            {timePeriod === period.key && (
              <div className="absolute inset-0 bg-gradient-to-t from-white/[0.1] to-transparent rounded-[8px]"></div>
            )}
            <span className="relative">{period.label}</span>
          </Button>
        ))}
      </div>
      {timePeriod === 'custom' && customStartDate && customEndDate && (
        <div 
          className="flex items-center space-x-2 cursor-pointer bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[12px] border border-gray-500/25 text-white px-3 py-2 rounded-[12px] focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
          onClick={onCustomClick}
        >
          <span>{`${formatDate(customStartDate)} - ${formatDate(customEndDate)}`}</span>
        </div>
      )}
    </div>
  );
};

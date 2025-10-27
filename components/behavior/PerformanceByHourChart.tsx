import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trade } from '../../types';
// Import the modal and the new interface
import { HourDetailsModal, HourlyPerformance } from './HourDetailsModal';

interface PerformanceByHourChartProps {
  stats: {
    performanceByHour: HourlyPerformance[];
  };
  trades: Trade[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const HourCard = ({ hourData, onClick }: { hourData: HourlyPerformance; onClick: () => void }) => {
  const { hour, totalResult, winRate, totalTrades } = hourData;
  
  // Calculate Average Result
  const avgResult = totalTrades > 0 ? totalResult / totalTrades : 0;

  const isPositive = avgResult >= 0;
  const bgColor = isPositive ? 'bg-green-500/10' : 'bg-red-500/10';
  const borderColor = isPositive ? 'border-green-500/30' : 'border-red-500/30';
  const textColor = isPositive ? 'text-green-400' : 'text-red-400';

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border ${borderColor} ${bgColor} backdrop-blur-sm shadow-lg w-32 h-36 space-y-1 cursor-pointer`}
    >
      <div className="text-base font-semibold text-white">{`${hour}h às ${hour + 1}h`}</div>
      {/* Display Average Result */}
      <div className={`text-xl font-bold ${textColor}`}>{formatCurrency(avgResult)}</div>
      <div className="text-xs text-gray-400">Resultado Médio</div>
      <div className="text-xs text-gray-500 mt-1">{`${totalTrades} operações`}</div>
    </motion.div>
  );
};

const TimeLine = ({ data, onCardClick }: { data: HourlyPerformance[], onCardClick: (hourData: HourlyPerformance) => void }) => (
    <div className="relative w-full flex justify-center items-center py-4 gap-4 flex-wrap">
        {data.map((item) => (
            <HourCard 
                key={item.hour}
                hourData={item}
                onClick={() => onCardClick(item)}
            />
        ))}
    </div>
);

export const PerformanceByHourChart: React.FC<PerformanceByHourChartProps> = ({ stats, trades }) => {
  // State now holds the entire hourly performance object
  const [selectedHourData, setSelectedHourData] = useState<HourlyPerformance | null>(null);

  const performanceByHour = stats?.performanceByHour ?? [];
  
  const morningHours = performanceByHour.filter(item => item.hour >= 8 && item.hour <= 12);
  const afternoonHours = performanceByHour.filter(item => item.hour > 12 && item.hour <= 18);

  const handleCardClick = (hourData: HourlyPerformance) => {
    setSelectedHourData(hourData);
  };

  const handleCloseModal = () => {
    setSelectedHourData(null);
  };

  const getTradesForHour = (hour: number | null) => {
    if (hour === null) return [];
    return trades.filter(trade => new Date(trade.openTime).getHours() === hour);
  };

  return (
    <>
      <HourDetailsModal 
        isOpen={selectedHourData !== null}
        onClose={handleCloseModal}
        hourData={selectedHourData}
        trades={getTradesForHour(selectedHourData?.hour ?? null)}
      />
      <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
        <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
        <div className="relative">
          <h3 className="text-lg font-semibold text-white mb-6 text-center">Performance por Período do Dia</h3>
          <div className="space-y-8">
            {morningHours.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-cyan-400 mb-2 text-center">Manhã</h4>
                <TimeLine data={morningHours} onCardClick={handleCardClick} />
              </div>
            )}
            {afternoonHours.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-cyan-400 mb-2 text-center">Tarde</h4>
                <TimeLine data={afternoonHours} onCardClick={handleCardClick} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

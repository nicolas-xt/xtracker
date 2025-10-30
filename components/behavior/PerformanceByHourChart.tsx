import React, { useState, useMemo } from 'react';
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

const HourCard = ({ hourData, onClick, metric, isBest }: { hourData: HourlyPerformance; onClick: () => void; metric: 'avg' | 'total' | 'winRate'; isBest?: boolean }) => {
  const { hour, totalResult, winRate, totalTrades } = hourData;

  const avgResult = totalTrades > 0 ? totalResult / totalTrades : 0;

  const metricValue = metric === 'avg' ? avgResult : metric === 'total' ? totalResult : winRate;

  const isPositive = metric === 'winRate' ? winRate >= 50 : metricValue >= 0;
  const bgColor = isPositive ? 'bg-green-500/8' : 'bg-red-500/8';
  const borderColor = isPositive ? 'border-green-500/30' : 'border-red-500/30';
  const textColor = isPositive ? 'text-green-400' : 'text-red-400';

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ scale: 1.04, y: -4, transition: { duration: 0.15 } }}
      className={`relative flex flex-col items-center justify-center p-3 rounded-xl border ${borderColor} ${bgColor} backdrop-blur-sm shadow-lg w-36 h-40 space-y-1 cursor-pointer`}
      title={`${hour}h - ${totalTrades} operações`}
    >
      <div className="flex items-center gap-2">
        <div className={`text-sm font-semibold text-white`}>{`${hour}h - ${hour + 1}h`}</div>
        {isBest && <div className="ml-2 px-2 py-0.5 rounded-full bg-yellow-500 text-xs font-semibold text-black">Top</div>}
      </div>

      <div className={`text-lg font-bold ${textColor}`}>{metric === 'winRate' ? `${(metricValue).toFixed(0)}%` : formatCurrency(metricValue)}</div>
      <div className="text-xs text-gray-400">{metric === 'avg' ? 'Resultado Médio' : metric === 'total' ? 'Resultado Total' : 'Taxa de Acerto'}</div>

      <div className="w-full mt-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{`${totalTrades} ops`}</span>
          <span>{`Win ${winRate.toFixed(0)}%`}</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-2 bg-cyan-400" style={{ width: `${Math.min(100, Math.max(0, winRate))}%` }} />
        </div>
      </div>
    </motion.div>
  );
};

const TimeLine = ({ data, onCardClick, metric, bestHour }: { data: HourlyPerformance[]; onCardClick: (hourData: HourlyPerformance) => void; metric: 'avg'|'total'|'winRate'; bestHour?: number }) => (
  <div className="relative w-full flex justify-center items-center py-4 gap-4 flex-wrap">
    {data.map((item) => (
      <div key={item.hour}>
        <HourCard 
          hourData={item}
          onClick={() => onCardClick(item)}
          metric={metric}
          isBest={bestHour === item.hour}
        />
      </div>
    ))}
  </div>
);

export const PerformanceByHourChart: React.FC<PerformanceByHourChartProps> = ({ stats, trades }) => {
  // State now holds the entire hourly performance object
  const [selectedHourData, setSelectedHourData] = useState<HourlyPerformance | null>(null);
  const [metric, setMetric] = useState<'avg'|'total'|'winRate'>('avg');

  const performanceByHour = stats?.performanceByHour ?? [];

  // Build a full 0-23 hours array ensuring missing hours are present
  const fullDay = useMemo(() => {
    const map = new Map<number, HourlyPerformance>();
    performanceByHour.forEach(h => map.set(h.hour, h));
    const arr: HourlyPerformance[] = [];
    for (let h = 0; h < 24; h++) {
      if (map.has(h)) arr.push(map.get(h)!);
      else arr.push({ hour: h, totalResult: 0, totalTrades: 0, winRate: 0 });
    }
    return arr;
  }, [performanceByHour]);

  // Define groups
  const groups = useMemo(() => {
    return {
      madrugada: fullDay.slice(0, 6), // 0-5
      morning: fullDay.slice(6, 12),   // 6-11
      midday: fullDay.slice(12, 15),   // 12-14
      afternoon: fullDay.slice(15, 19),// 15-18
      night: fullDay.slice(19, 24),    // 19-23
    };
  }, [fullDay]);

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

  // determine best hour according to metric
  const bestHour = useMemo(() => {
    let best = -1; let bestVal = -Infinity;
    fullDay.forEach(h => {
      const avg = h.totalTrades > 0 ? h.totalResult / h.totalTrades : 0;
      const val = metric === 'avg' ? avg : metric === 'total' ? h.totalResult : h.winRate;
      if (val > bestVal) { bestVal = val; best = h.hour; }
    });
    return best;
  }, [fullDay, metric]);

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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Performance por Período do Dia</h3>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Métrica:</label>
              <select value={metric} onChange={(e) => setMetric(e.target.value as any)} className="bg-[#1f1f1f] text-white px-2 py-1 rounded-md">
                <option value="avg">Resultado Médio</option>
                <option value="total">Resultado Total</option>
                <option value="winRate">Taxa de Acerto</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {groups.madrugada.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-cyan-400 mb-2 text-center">Madrugada</h4>
                <TimeLine data={groups.madrugada} onCardClick={handleCardClick} metric={metric} bestHour={bestHour} />
              </div>
            )}

            {groups.morning.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-cyan-400 mb-2 text-center">Manhã</h4>
                <TimeLine data={groups.morning} onCardClick={handleCardClick} metric={metric} bestHour={bestHour} />
              </div>
            )}

            {groups.midday.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-cyan-400 mb-2 text-center">Meio-dia</h4>
                <TimeLine data={groups.midday} onCardClick={handleCardClick} metric={metric} bestHour={bestHour} />
              </div>
            )}

            {groups.afternoon.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-cyan-400 mb-2 text-center">Tarde</h4>
                <TimeLine data={groups.afternoon} onCardClick={handleCardClick} metric={metric} bestHour={bestHour} />
              </div>
            )}

            {groups.night.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-cyan-400 mb-2 text-center">Noite</h4>
                <TimeLine data={groups.night} onCardClick={handleCardClick} metric={metric} bestHour={bestHour} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

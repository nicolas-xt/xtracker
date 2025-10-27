import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trade, DetailedStats } from '../../types';

interface PerformanceChartProps {
  trades: Trade[];
  stats: DetailedStats;
  timePeriod: string;
}

const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

const XAxisTickFormatter = (value: string, index: number, chartData: any[], timePeriod: string) => {
    if (value === 'Início') return value;

    const dataPoint = chartData[index];
    if (!dataPoint || !dataPoint.openTime) return '';

    const date = new Date(dataPoint.openTime);

    switch (timePeriod) {
        case 'today':
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        case 'week':
        case 'month':
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        case 'year':
            return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        default:
            return value;
    }
};

const CustomTooltip = ({ active, payload, label, trades }: any) => {
    if (active && payload && payload.length && label !== 'Início') {
      const tradeIndex = parseInt(label, 10) - 1;
      const trade = trades[tradeIndex];
      if (!trade) return null;

      return (
        <div className="bg-[#2A2A2A]/80 backdrop-blur-md p-3 border border-gray-500/30 rounded-lg shadow-lg text-white text-sm">
          <p className="font-semibold mb-1">{`Operação #${label}`}</p>
          <p className="text-gray-300 mb-2">{new Date(trade.openTime).toLocaleString('pt-BR')}</p>
          <p className={`font-medium ${trade.result >= 0 ? 'text-[#28C780]' : 'text-[#FF453A]'}`}>
            Resultado: {formatCurrency(trade.result)}
          </p>
          <p className="text-gray-400 mt-1">Patrimônio: {formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ trades, stats, timePeriod }) => {
  const chartData = useMemo(() => {
    let cumulative = 0;
    const data = [{ name: 'Início', performance: cumulative, openTime: trades.length > 0 ? new Date(new Date(trades[0].openTime).getTime() - 1).toISOString() : new Date().toISOString() }];

    trades.forEach((trade, index) => {
      cumulative += trade.result;
      data.push({ name: `${index + 1}`, performance: cumulative, openTime: trade.openTime });
    });
    return data;
  }, [trades]);

  const gradientOffset = () => {
    const data = chartData.map(i => i.performance);
    const dataMax = Math.max(...data);
    const dataMin = Math.min(...data);
  
    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;
  
    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={off} stopColor="#28C780" stopOpacity={0.4}/>
              <stop offset={off} stopColor="#FF453A" stopOpacity={0.4}/>
            </linearGradient>
            <linearGradient id="splitColorStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset={off} stopColor="#28C780" stopOpacity={1}/>
              <stop offset={off} stopColor="#FF453A" stopOpacity={1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="#8b949e" 
            tickFormatter={(value, index) => XAxisTickFormatter(value, index, chartData, timePeriod)} 
            style={{ fontSize: '12px' }} 
            interval="preserveStartEnd"
            tickCount={7}
          />
          <YAxis 
            stroke="#8b949e" 
            tickFormatter={formatCurrency} 
            domain={['dataMin - 100', 'dataMax + 100']} 
            style={{ fontSize: '12px' }}
            orientation="right"
          />
          <Tooltip content={<CustomTooltip trades={trades} />} />
          <Area 
            type="monotone" 
            dataKey="performance" 
            stroke="url(#splitColorStroke)" 
            strokeWidth={2}
            fill="url(#splitColor)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
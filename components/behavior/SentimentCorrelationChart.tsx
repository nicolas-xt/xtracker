import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DetailedStats } from '../../types';

interface SentimentCorrelationChartProps {
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

export const SentimentCorrelationChart: React.FC<SentimentCorrelationChartProps> = ({ stats }) => {
  const data = stats.sentimentCorrelation.map(item => ({
    sentiment: item.sentiment,
    avgResult: item.avgResult,
    trades: item.totalTrades,
  }));

  return (
    <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
      <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
      <div className="relative">
        <h3 className="text-lg font-semibold text-white mb-4">Correlação Sentimento vs. Resultado</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="sentiment" stroke="rgba(255,255,255,0.7)" />
            <YAxis stroke="rgba(255,255,255,0.7)" tickFormatter={formatCurrency} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.1)' }}
              contentStyle={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#00D0FF' }}
              formatter={(value: number, name: string, props: any) => {
                if (name === 'avgResult') return [formatCurrency(value), 'Resultado Médio'];
                if (name === 'trades') return [value, 'Operações'];
                return value;
              }}
            />
            <Bar dataKey="avgResult" name="Resultado Médio" fill="#00D0FF" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

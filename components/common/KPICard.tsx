import React from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  sparklineData?: number[];
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, change, changeType, subtitle, sparklineData }) => {
  const changeColor = changeType === 'positive' ? 'text-[#28C780]' :
                       changeType === 'negative' ? 'text-[#EA3943]' : 'text-gray-400';

  return (
    <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md hover:shadow-lg hover:shadow-[#00D0FF]/8 transition-all duration-300 relative overflow-hidden group">
      {/* Liquid Glass Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
      <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>

      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-gray-400">{title}</h3>
          {change && (
            <span className={`text-sm font-medium ${changeColor} px-2 py-1 rounded-[10px] bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-[8px] border border-gray-600/30`}>
              {change}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-semibold text-white">{value}</span>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>

          {/* Sparkline */}
          {sparklineData && (
            <div className="w-16 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData.map((val, i) => ({ value: val, index: i }))}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={changeColor.includes('28C780') ? '#28C780' : changeColor.includes('EA3943') ? '#EA3943' : '#00D0FF'}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
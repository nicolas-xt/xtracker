import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DetailedStats, Trade } from '../../types';
import { useBehavioralInsights } from '../../hooks/useBehavioralInsights';

// Import the enhanced detector cards
import { OvertradingDetectorCard } from './OvertradingDetectorCard'; // Assuming this is the enhanced version
import { EuphoriaDetectorCard } from './EuphoriaDetectorCard'; // Assuming this is the enhanced version
import { PerformanceByHourChart } from './PerformanceByHourChart';
import { EntryExitPatternsDisplay } from './EntryExitPatternsDisplay';
import { SentimentCorrelationChart } from './SentimentCorrelationChart';
import { StrategyAssertivenessTable } from './StrategyAssertivenessTable';
import { PayoffByStrategyChart } from './PayoffByStrategyChart';
import { PayoffBySentimentChart } from './PayoffBySentimentChart';
import { WinLossStreaksDisplay } from './WinLossStreaksDisplay';
import { ScreenTimeOperationsDisplay } from './ScreenTimeOperationsDisplay';
import { PerformanceByDayOfWeekChart } from './PerformanceByDayOfWeekChart';

interface BehaviorProps {
  stats: DetailedStats;
}

const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

// Helper for Figma-style icons
const IconWrapper = ({ children, bgColorClass, iconColorClass }: { children: React.ReactNode, bgColorClass: string, iconColorClass: string }) => (
  <div className={`w-8 h-8 ${bgColorClass} rounded-[12px] flex items-center justify-center`}>
    {React.cloneElement(children as React.ReactElement, { className: `w-4 h-4 ${iconColorClass}` })}
  </div>
);

export const Behavior: React.FC<BehaviorProps> = ({ stats }) => {
  const { insight, isLoading, error, generateInsight } = useBehavioralInsights();

  if (!stats) {
    return <div className="p-6 text-center text-white">Carregando estatísticas...</div>;
  }

  // Figma-style Insight Card (Psicológico)
  const PsychologistInsight = () => {
    const renderContent = () => {
      if (isLoading) {
        return <div className="text-center text-gray-400">Analisando seu perfil...</div>;
      }
      if (error) {
        return <div className="text-center text-red-500">Erro: {error}</div>;
      }
      if (!insight) {
        return (
          <div className="text-center">
            <p className="text-gray-400 mb-4">Clique no botão abaixo para receber um insight sobre seu comportamento como trader, gerado por IA.</p>
            <button
              onClick={() => generateInsight(stats)}
              className="px-4 py-2 bg-gradient-to-r from-[#00D0FF] to-[#0099CC] text-white font-semibold rounded-[16px] hover:from-[#0099CC] hover:to-[#007799] transition-all duration-300 shadow-md shadow-[#00D0FF]/20"
            >
              Analisar Meu Perfil
            </button>
          </div>
        );
      }

      // Log the raw insight for debugging
      console.log("Raw AI Insight:", insight);

      // Robust parsing logic
      const getSection = (label: string) => {
        const regex = new RegExp(`\\**${label}:\\**([\\}s\\.]*?)(?=\\**|\\
\\**|$)`, 'i');
        const match = insight.match(regex);
        return match ? match[1].trim() : null;
      };

      const diagnosis = getSection('Diagnóstico');
      const analysis = getSection('Análise');
      const tip = getSection('Dica');

      console.log("Parsed Diagnosis:", diagnosis);
      console.log("Parsed Analysis:", analysis);
      console.log("Parsed Tip:", tip);

      return (
        <div>
          <h4 className="text-lg font-bold text-[#00D0FF] uppercase">{diagnosis || 'Diagnóstico não encontrado'}</h4>
          <p className="text-gray-300 mt-2">{analysis || 'Análise não encontrada'}</p>
          {tip && (
            <div className="mt-4 p-3 bg-gradient-to-br from-[#2A2A2A]/50 to-[#242424]/60 backdrop-blur-[12px] rounded-[12px] border border-gray-500/20">
              <p className="font-semibold text-[#00D0FF]">Dica:</p>
              <p className="text-gray-300">{tip}</p>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
        <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
        <div className="relative">
          <div className="flex items-center space-x-2 mb-4">
            <IconWrapper bgColorClass="bg-gradient-to-br from-[#00D0FF]/20 to-[#00D0FF]/10" iconColorClass="text-[#00D0FF]">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.275a1.125 1.125 0 011.292 0l.006.006c.427.38.65.93.65 1.506v.334c0 .476-.19.93-.52 1.26l-1.555 1.555a.75.75 0 01-1.06 0l-1.555-1.555a.75.75 0 010-1.06l1.555-1.555a.75.75 0 011.06 0l1.555 1.555z" />
              </svg>
            </IconWrapper>
            <span className="text-lg font-semibold text-white">Psicológico do Trader</span>
          </div>
          {renderContent()}
        </div>
      </div>
    );
  };

  // Figma-style Maiores Ganhos/Perdas (using TopTradesCard)
  const TopTradesSection = ({ title, trades, isGain }: { title: string, trades: Trade[], isGain: boolean }) => (
    <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
      <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>

      <div className="relative">
        <div className="flex items-center space-x-2 mb-4">
          <IconWrapper bgColorClass={isGain ? "bg-gradient-to-br from-[#28C780]/20 to-[#28C780]/10" : "bg-gradient-to-br from-[#EA3943]/20 to-[#EA3943]/10"} iconColorClass={isGain ? "text-[#28C780]" : "text-[#EA3943]"}>
            {isGain ? (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
          </IconWrapper>
          <span className="text-lg font-semibold text-white">{title}</span>
        </div>

        <div className="space-y-3">
          {trades.map((trade, index) => (
            <div key={trade.id} className={`flex items-center justify-between p-3 bg-gradient-to-br ${isGain ? 'from-[#28C780]/10 to-[#28C780]/5 border border-[#28C780]/20' : 'from-[#EA3943]/10 to-[#EA3943]/5 border border-[#EA3943]/20'} rounded-[12px] relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[12px]"></div>
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 ${isGain ? 'bg-[#28C780]/20 text-[#28C780] border border-[#28C780]/30' : 'bg-[#EA3943]/20 text-[#EA3943] border border-[#EA3943]/30'} rounded-[6px]`}>#{index + 1}</span>
                  <span className="font-medium text-white">{trade.asset}</span>
                  <span className="text-xs text-gray-400">{trade.setup}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{new Date(trade.openTime).toLocaleDateString('pt-BR')} • {trade.duration}</p>
              </div>
              <span className={`${isGain ? 'text-[#28C780]' : 'text-[#EA3943]'} font-semibold`}>{formatCurrency(trade.result)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OvertradingDetectorCard stats={stats} />
        <EuphoriaDetectorCard stats={stats} />
      </div>

      <PerformanceByHourChart stats={stats} />
      <EntryExitPatternsDisplay stats={stats} />
      <SentimentCorrelationChart stats={stats} />
      <StrategyAssertivenessTable stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PayoffByStrategyChart stats={stats} />
        <PayoffBySentimentChart stats={stats} />
      </div>

      <WinLossStreaksDisplay stats={stats} />
      <ScreenTimeOperationsDisplay stats={stats} />
      <PerformanceByDayOfWeekChart stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PsychologistInsight />
        <div className="grid grid-cols-1 gap-6">
          <TopTradesSection title="Maiores Ganhos" trades={stats?.bestTrades ?? []} isGain={true} />
          <TopTradesSection title="Maiores Perdas" trades={stats?.worstTrades ?? []} isGain={false} />
        </div>
      </div>
    </div>
  );
};

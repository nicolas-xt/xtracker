import React from 'react';
import { Trade, DetailedStats } from '../../types';
import { PerformanceChart } from './PerformanceChart';
import { PerformanceCalendar } from './PerformanceCalendar';
import { OvertradingDetectorCard } from '../behavior/OvertradingDetectorCard';
import { EuphoriaDetectorCard } from '../behavior/EuphoriaDetectorCard';
import { KPICard } from '../common/KPICard';
import { useTradeAnalysis } from '../../hooks/useTradeAnalysis';
import { BestScenarioCard } from '../behavior/BestScenarioCard';
import { PerformanceByHourChart } from '../behavior/PerformanceByHourChart';
import { useSettings } from '../../src/context/SettingsContext';
import { Button } from '../ui/button';

interface DashboardProps {
  stats: DetailedStats;
  trades: Trade[];
  timePeriod: string;
  selectedPeriod: string;
  onReload?: () => void;
}

const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
const formatPercentage = (value: number) => `${(value * 100).toFixed(1).replace('.', ',')}%`;

export const Dashboard: React.FC<DashboardProps> = ({ stats, trades, timePeriod, selectedPeriod, onReload }) => {
  if (trades.length === 0 || !stats) {
    return (
      <div className="p-6 text-center text-white">Nenhum dado de trade importado.</div>
    );
  }

  const { previousPeriodStats } = stats;
  const { analyzeHourlyPerformance, analyzeBestScenarioByDayOfWeek } = useTradeAnalysis(trades);

  const hourlyPerformance = analyzeHourlyPerformance(trades, selectedPeriod);
  const bestScenarios = analyzeBestScenarioByDayOfWeek(trades, selectedPeriod);

  const getChange = (current: number, previous: number | undefined) => {
    if (previous === undefined || previous === 0) return { change: 'N/A', changeType: 'neutral' as const };
    const change = ((current - previous) / Math.abs(previous)) * 100;
    return {
      change: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
      changeType: change >= 0 ? 'positive' as const : 'negative' as const,
    };
  };

  const { settings } = useSettings();

  const kpis = [
    {
      title: 'Resultado Final',
      value: formatCurrency(stats.finalResult ?? 0),
      ...getChange(stats.finalResult, previousPeriodStats?.finalResult),
      subtitle: `Meta: ${formatCurrency(settings?.monthlyGoal ?? 10000)}`,
    },
    {
      title: 'Taxa de Acerto',
      value: formatPercentage(stats.winRate ?? 0),
      ...getChange(stats.winRate, previousPeriodStats?.winRate),
      subtitle: `${stats.winningTrades ?? 0} V / ${stats.losingTrades ?? 0} D`,
    },
    {
      title: 'Payoff',
      value: (stats.payoff ?? 0).toFixed(2),
      ...getChange(stats.payoff, previousPeriodStats?.payoff),
      subtitle: `Gain Médio: ${formatCurrency(stats.avgWin ?? 0)}`,
    },
    {
      title: 'Fator de Lucro',
      value: (stats.profitFactor ?? 0).toFixed(2),
      ...getChange(stats.profitFactor, previousPeriodStats?.profitFactor),
      subtitle: 'Lucro Bruto / Prejuízo Bruto',
    },
    {
      title: 'Média Pontos / Dia Vencedor',
      value: `${(stats.avgScoreOnWinDays ?? 0).toFixed(0)}pts`,
      ...getChange(stats.avgScoreOnWinDays, previousPeriodStats?.avgScoreOnWinDays),
      subtitle: `${stats.positiveDays} dias vencedores`,
    },
    {
      title: 'Drawdown Máx.',
      value: formatCurrency(stats.maxDrawdown ?? 0),
      ...getChange(stats.maxDrawdown, previousPeriodStats?.maxDrawdown),
      subtitle: `Percentual: ${formatPercentage(stats.maxDrawdownPercent ?? 0)}`,
    },
    {
      title: 'Total de Operações',
      value: stats.totalTrades?.toString() ?? '0',
      ...getChange(stats.totalTrades, previousPeriodStats?.totalTrades),
      subtitle: 'vs. período anterior',
    },
    {
      title: 'Taxas Totais',
      value: formatCurrency(stats.taxaBMf + stats.irrf),
      ...getChange(stats.taxaBMf + stats.irrf, (previousPeriodStats?.taxaBMf ?? 0) + (previousPeriodStats?.irrf ?? 0)),
      subtitle: `Contratos: ${stats.totalContracts}`,
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-end">
        {typeof onReload === 'function' && (
          <Button onClick={onReload} className="px-3 py-2 rounded-[10px] text-sm">
            Recarregar CSV
          </Button>
        )}
      </div>
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equity Curve */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
          <div className="relative">
            <h3 className="text-lg font-semibold text-white mb-4">Curva de Patrimônio</h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-[#2A2A2A]/50 to-[#242424]/60 backdrop-blur-[12px] rounded-[16px] border border-gray-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] to-transparent rounded-[16px]"></div>
                <div className="relative">
                  <p className="text-sm text-gray-400 mb-1">Resultado Bruto</p>
                  <p className="text-lg font-semibold text-[#28C780]">{formatCurrency(stats.grossResult ?? 0)}</p>
                </div>
              </div>
            </div>
            <div className="h-64">
              <PerformanceChart trades={trades} stats={stats} timePeriod={timePeriod} />
            </div>
          </div>
        </div>

        {/* Performance Calendar Heatmap */}
        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
          <div className="relative">
            <h3 className="text-lg font-semibold text-white mb-4">Calendário de Performance</h3>
            <PerformanceCalendar data={stats?.dailyPerformance ?? []} />
          </div>
        </div>
      </div>

      {/* New Insights Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Análise de Período: {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}</h2>
        <BestScenarioCard bestScenarios={bestScenarios} selectedPeriod={selectedPeriod} />
      </div>
        
      <PerformanceByHourChart stats={{ performanceByHour: hourlyPerformance }} trades={trades} />

      {/* Behavioral Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OvertradingDetectorCard stats={stats} />
        <EuphoriaDetectorCard stats={stats} />
      </div>
    </div>
  );
};

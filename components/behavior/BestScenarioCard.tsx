import React from 'react';
import { BestScenarioByDay } from '../../hooks/useTradeAnalysis';
import { Clock, TrendingUp, DollarSign, AlertTriangle, CalendarDays } from 'lucide-react';

interface BestScenarioCardProps {
  bestScenarios: BestScenarioByDay[];
  selectedPeriod: string;
}

const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
const formatPercentage = (value: number) => `${(value).toFixed(1).replace('.', ',')}%`;

export const BestScenarioCard: React.FC<BestScenarioCardProps> = ({ bestScenarios, selectedPeriod }) => {
  if (!bestScenarios || bestScenarios.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
        <h3 className="text-lg font-semibold text-white mb-4">Melhores Cenários ({selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)})</h3>
        <p className="text-gray-400">Nenhum cenário ideal encontrado para o período selecionado.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center"><CalendarDays className="w-5 h-5 mr-2 text-[#00D0FF]" /> Melhores Cenários ({selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)})</h3>
      <div className="space-y-4">
        {bestScenarios.map((dayScenario, index) => (
          <div key={index} className="bg-[#2A2A2A]/50 rounded-lg p-4 border border-gray-500/20 transition-all duration-300 hover:border-[#00D0FF]/50 hover:shadow-lg hover:shadow-[#00D0FF]/10">
            <h4 className="text-md font-semibold text-white mb-3 flex items-center"><span className="text-[#00D0FF] mr-2">•</span> {dayScenario.dayOfWeek}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
              {dayScenario.scenario.bestHours.length > 0 && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Melhores Horários: <span className="font-medium text-white">{dayScenario.scenario.bestHours.map(h => `${h.hour}:00-${h.hour + 1}:00 (${formatPercentage(h.winRate)} | ${formatCurrency(h.averageResult)})`).join(', ')}</span></span>
                </div>
              )}
              {dayScenario.scenario.recommendedPointRange.range !== 'N/A' && (
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Faixa de Pontuação Recomendada: <span className="font-medium text-white">{dayScenario.scenario.recommendedPointRange.range} ({formatPercentage(dayScenario.scenario.recommendedPointRange.winRate)} | {formatCurrency(dayScenario.scenario.recommendedPointRange.averageResult)})</span></span>
                </div>
              )}
              {dayScenario.scenario.bestFinancialValueRange.range !== 'N/A' && (
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Melhor Faixa de Valor Financeiro: <span className="font-medium text-white">{dayScenario.scenario.bestFinancialValueRange.range} ({formatPercentage(dayScenario.scenario.bestFinancialValueRange.winRate)} | {formatCurrency(dayScenario.scenario.bestFinancialValueRange.averageResult)})</span></span>
                </div>
              )}
              {dayScenario.scenario.optimalMaxLossTolerance > 0 && (
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
                  <span>Tolerância Máxima de Perda Diária: <span className="font-medium text-red-300">{formatCurrency(dayScenario.scenario.optimalMaxLossTolerance)}</span></span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

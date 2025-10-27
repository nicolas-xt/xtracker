import React from 'react';
import { DetailedStats } from '../../types';

interface PerformanceSummaryProps {
  stats: DetailedStats;
}

const StatCard = ({ label, value, color }: { label: string; value: string | number; color?: string }) => (
    <div className="bg-b-dark-2 border border-b-border rounded-md p-4 flex justify-between items-center">
        <span className="text-b-text-2 uppercase text-sm tracking-wider">{label}</span>
        <span className={`font-semibold text-lg ${color || 'text-b-text-1'}`}>{value}</span>
    </div>
);

export const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({ stats }) => {
    const formatCurrency = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;
    const formatPercent = (val: number) => `${(val * 100).toFixed(2).replace('.', ',')}%`;

    const netResultColor = stats.netResult >= 0 ? 'text-b-green' : 'text-b-red';
    const profitFactorColor = stats.profitFactor >= 1 ? 'text-b-green' : 'text-b-red';
    const mathExpectationColor = stats.mathExpectation >= 0 ? 'text-b-green' : 'text-b-red';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Resultado Líquido" value={formatCurrency(stats.netResult)} color={netResultColor} />
            <StatCard label="Total de Trades" value={stats.totalTrades} />
            <StatCard label="Taxa de Acerto" value={formatPercent(stats.winRate)} />
            <StatCard label="Payoff" value={stats.payoff.toFixed(2)} />
            <StatCard label="Fator de Lucro" value={stats.profitFactor.toFixed(2)} color={profitFactorColor} />
            <StatCard label="Expectativa Matemática" value={formatCurrency(stats.mathExpectation)} color={mathExpectationColor} />
            <StatCard label="Média de Ganho" value={formatCurrency(stats.avgWin)} color="text-b-green" />
            <StatCard label="Média de Perda" value={formatCurrency(Math.abs(stats.avgLoss))} color="text-b-red" />
            <StatCard label="Maior Ganho" value={formatCurrency(stats.maxWin)} color="text-b-green" />
            <StatCard label="Maior Prejuízo" value={formatCurrency(stats.maxLoss)} color="text-b-red" />
            <StatCard label="Máx. Ganhos Consecutivos" value={stats.maxConsecutiveWins} color="text-b-green" />
            <StatCard label="Máx. Perdas Consecutivas" value={stats.maxConsecutiveLosses} color="text-b-red" />
            <StatCard label="Máximo Drawdown" value={`${formatCurrency(stats.maxDrawdown)} (${formatPercent(stats.maxDrawdownPercent)})`} color="text-b-red" />
        </div>
    );
};
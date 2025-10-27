import React, { useState } from 'react';
import { DetailedStats, Trade } from '../../types';
import { PerformanceSummary } from './PerformanceSummary';
import { OperationsAnalysis } from './OperationsAnalysis';

interface DetailedReportsProps {
  stats: DetailedStats;
  trades: Trade[];
}

type ReportView = 'performance' | 'operations';

export const DetailedReports: React.FC<DetailedReportsProps> = ({ stats, trades }) => {
  const [view, setView] = useState<ReportView>('performance');

  if (trades.length === 0) {
      return <div className="p-6 text-center text-b-text-2">Nenhum dado para gerar relatórios. Importe seus trades primeiro.</div>;
  }

  const renderContent = () => {
      switch(view) {
          case 'performance':
              return <PerformanceSummary stats={stats} />;
          case 'operations':
              return <OperationsAnalysis stats={stats} />;
          default:
              return <PerformanceSummary stats={stats} />;
      }
  }

  const NavItem = ({ reportView, label }: { reportView: ReportView; label: string }) => (
      <button
          onClick={() => setView(reportView)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors tracking-wider ${
              view === reportView 
              ? 'border-b-blue text-b-text-1' 
              : 'border-transparent text-b-text-2 hover:border-b-border hover:text-b-text-1'
          }`}
      >
          {label}
      </button>
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider">Relatórios Detalhados</h2>
      <div className="border-b border-b-border mb-6">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            <NavItem reportView="performance" label="RESUMO DE PERFORMANCE" />
            <NavItem reportView="operations" label="ANÁLISE DE OPERAÇÕES" />
        </nav>
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};
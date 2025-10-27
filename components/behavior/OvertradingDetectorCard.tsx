import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, AlertTriangle, Settings, PauseCircle } from 'lucide-react'; // Icons
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'; // For mini-charts
import { DetailedStats } from '../../types'; // Keep existing import for DetailedStats



// --- Helper Functions ---
const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
const formatPercentage = (value: number) => `${(value * 100).toFixed(0)}%`;

// --- Component Sketch ---
interface OvertradingDetectorProps {
  stats: DetailedStats; // Keep existing prop
}

export const OvertradingDetectorCard: React.FC<OvertradingDetectorProps> = ({ stats }) => {
  // TODO: Fetch user settings from a real source
  const userSettings = {
    overtradingAlertThreshold: 0.20,
    consecutiveLossesThreshold: 2,
    pauseAlertActive: true
  };
  const [isPauseAlertActive, setIsPauseAlertActive] = useState(userSettings.pauseAlertActive);

  const isCriticalFrequency = (stats.overtradingSessionFrequency ?? 0) > userSettings.overtradingAlertThreshold;
  const resultAfter2LossesColor = (stats.resultAfter2Losses ?? 0) >= 0 ? 'text-b-green' : 'text-b-red';

  const barChartData = [
    { name: 'Dias com Overtrading', value: stats.resultAfter2Losses ?? 0 },
  ];

  return (
    <Card className="bg-b-dark-2 border border-b-border rounded-md p-6 relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold uppercase tracking-wider">
          Detector de Overtrading
        </CardTitle>
        <Settings className="h-5 w-5 text-b-text-2 cursor-pointer hover:text-b-blue" title="Configurar Alertas" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-b-text-2 flex items-center">
              Resultado em Dias de Overtrading
              <Info className="h-3 w-3 ml-1 text-b-text-3" title="Resultado médio dos dias em que ocorreram 2 ou mais perdas consecutivas." />
            </p>
            <p className={`text-2xl font-bold ${resultAfter2LossesColor} ${isCriticalFrequency ? 'animate-pulse' : ''}`}>
              {formatCurrency(stats.resultAfter2Losses ?? 0)}
            </p>
            <p className="text-xs text-b-text-2">resultado final do dia apos ter mais de dois loss seguidos</p>
          </div>
          <div>
            <p className="text-sm text-b-text-2 flex items-center">
              Frequência de Overtrading
              <Info className="h-3 w-3 ml-1 text-b-text-3" title="Percentual de sessões de trading onde você continuou operando após uma sequência de perdas." />
            </p>
            <p className={`text-2xl font-bold ${isCriticalFrequency ? 'text-b-red' : 'text-b-green'} flex items-center`}>
              {formatPercentage(stats.overtradingSessionFrequency ?? 0)}
              {isCriticalFrequency && <AlertTriangle className="h-5 w-5 ml-2 text-b-red" title="Frequência de overtrading acima do limite!" />}
            </p>
            <p className="text-xs text-b-text-2">Das sessões com sequência de perdas</p>
          </div>
        </div>

        {/* Mini Bar Chart: Performance after X Losses */}
        <div className="bg-b-dark border border-b-border rounded-md p-3">
          <p className="text-sm font-semibold mb-2">Performance Média Pós-Perdas:</p>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={barChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '10px' }} />
              <YAxis hide domain={['dataMin', 'dataMax']} />
              <Tooltip cursor={{ fill: 'transparent' }} formatter={(value, name, payload) => {
                if (payload && payload.length > 0) {
                  const data = payload[0].payload;
                  if (typeof data.value === 'number') {
                    return formatCurrency(data.value);
                  }
                }
                return value;
              }} />
              <Bar dataKey="value">
                {barChartData.map((entry, index) => (
                  <Bar key={`bar-${index}`} fill={entry.value >= 0 ? '#2ECC71' : '#E74C3C'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insight & Sugestão */}
        <div className="p-3 bg-b-dark border border-b-border rounded-md">
          <p className="font-semibold text-b-blue">💡 Insight:</p>
          <p className="text-b-text-2">Após sequências de perda, seu desempenho tende a ser negativo.</p>
          <p className="font-semibold text-b-blue mt-2">🎯 Sugestão:</p>
          <p className="text-b-text-2">Considere uma pausa após {userSettings.consecutiveLossesThreshold} losses consecutivos.</p>
        </div>

        {/* Historical Examples */}
        <div>
          <p className="text-sm font-semibold mb-2">Exemplos Recentes:</p>
          {stats.occurrences?.slice(0, 2).map((occurrence, index) => (
            <p key={index} className="text-xs text-b-text-2">
              Perdeu {formatCurrency(occurrence.amountLost)} após {occurrence.losses} losses em {new Date(occurrence.date).toLocaleDateString('pt-BR')}.
            </p>
          ))}
        </div>

        {/* Simulation */}
        <div className="p-3 bg-b-dark border border-b-border rounded-md">
          <p className="font-semibold text-b-blue">📊 Simulação:</p>
          <p className="text-b-text-2">Se tivesse parado após {userSettings.consecutiveLossesThreshold} losses, teria poupado <span className="text-b-green font-bold">{formatCurrency(stats.simulationSavings ?? 0)}</span> nos últimos 3 meses.</p>
        </div>

        {/* Evolution Summary Mini-Chart */}
        <div className="bg-b-dark border border-b-border rounded-md p-3">
          <p className="text-sm font-semibold mb-2">Evolução da Frequência de Overtrading:</p>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={stats.frequencyTrend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} style={{ fontSize: '10px' }} />
              <YAxis hide domain={[0, 0.5]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value) => typeof value === 'number' ? formatPercentage(value) : value} />
              <Line type="monotone" dataKey="frequency" stroke="#2f81f7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Interaction: Pause Alert Toggle */}
        <div className="flex items-center justify-between p-3 bg-b-dark border border-b-border rounded-md">
          <div className="flex items-center">
            <PauseCircle className="h-5 w-5 text-b-blue mr-2" />
            <p className="text-sm font-semibold">Alerta de Pausa Ativo:</p>
          </div>
          <button
            onClick={() => setIsPauseAlertActive(!isPauseAlertActive)}
            className={`px-4 py-2 rounded-md text-sm font-semibold ${isPauseAlertActive ? 'bg-b-green text-white' : 'bg-b-red text-white'}`}
          >
            {isPauseAlertActive ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
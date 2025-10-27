import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, AlertTriangle, Settings, BellRing } from 'lucide-react'; // Icons
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'; // For mini-charts
import { DetailedStats } from '../../types'; // Keep existing import for DetailedStats



// --- Helper Functions ---
const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
const formatPercentage = (value: number) => `${(value * 100).toFixed(0)}%`;

// --- Component Sketch ---
interface EuphoriaDetectorProps {
  stats: DetailedStats; // Keep existing prop
}

export const EuphoriaDetectorCard: React.FC<EuphoriaDetectorProps> = ({ stats }) => {
  // TODO: Fetch user settings from a real source
  const userSettings = {
    euphoriaAlertThreshold: 0.20,
    devolutionAmountThreshold: 1000,
    stopGainAlertActive: true
  };
  const [isStopGainAlertActive, setIsStopGainAlertActive] = useState(userSettings.stopGainAlertActive);

  const isCriticalDevolutionAmount = (stats.totalProfitDevolution ?? 0) > userSettings.devolutionAmountThreshold;
  const isCriticalFrequency = (stats.profitDevolutionSessionFrequency ?? 0) > userSettings.euphoriaAlertThreshold;

  return (
    <Card className="bg-b-dark-2 border border-b-border rounded-md p-6 relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold uppercase tracking-wider">
          Detector de Euforia
        </CardTitle>
        <Settings className="h-5 w-5 text-b-text-2 cursor-pointer hover:text-b-blue" title="Configurar Alertas" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-b-text-2 flex items-center">
              Devolução Detectada
              <Info className="h-3 w-3 ml-1 text-b-text-3" title="Valor total de lucro que foi devolvido ao mercado após atingir um pico." />
            </p>
            <p className={`text-2xl font-bold text-b-red ${isCriticalDevolutionAmount ? 'animate-pulse' : ''}`}>
              {formatCurrency(stats.totalProfitDevolution ?? 0)}
            </p>
            <p className="text-xs text-b-text-2">Lucro devolvido em {stats.profitDevolutionOccurrences} ocasiões</p>
          </div>
          <div>
            <p className="text-sm text-b-text-2 flex items-center">
              Frequência
              <Info className="h-3 w-3 ml-1 text-b-text-3" title="Percentual de sessões de trading onde houve devolução de lucro." />
            </p>
            <p className={`text-2xl font-bold ${isCriticalFrequency ? 'text-b-red' : 'text-b-green'} flex items-center`}>
              {formatPercentage(stats.profitDevolutionSessionFrequency ?? 0)}
              {isCriticalFrequency && <AlertTriangle className="h-5 w-5 ml-2 text-b-red" title="Frequência de devolução acima do limite!" />}
            </p>
            <p className="text-xs text-b-text-2">Das sessões com devolução</p>
          </div>
        </div>

        {/* Insight & Sugestão */}
        <div className="p-3 bg-b-dark border border-b-border rounded-md">
          <p className="font-semibold text-b-blue">💡 Insight:</p>
          <p className="text-b-text-2">Você tende a devolver lucro após atingir picos.</p>
          <p className="font-semibold text-b-blue mt-2">🎯 Sugestão:</p>
          <p className="text-b-text-2">Considere definir metas de gain ou realizar parciais para proteger o lucro.</p>
        </div>

        {/* Historical Examples */}
        <div>
          <p className="text-sm font-semibold mb-2">Exemplos Recentes:</p>
          {stats.euphoriaOccurrences && stats.euphoriaOccurrences.slice(0, 2).map((occurrence, index) => (
            <p key={index} className="text-xs text-b-text-2">
              Devolveu {formatCurrency(occurrence.amountDevolved)} após pico de {formatCurrency(occurrence.peakProfit)} em {new Date(occurrence.date).toLocaleDateString('pt-BR')}.
            </p>
          ))}
        </div>

        {/* Simulation */}
        <div className="p-3 bg-b-dark border border-b-border rounded-md">
          <p className="font-semibold text-b-blue">📊 Simulação:</p>
          <p className="text-b-text-2">Se tivesse definido stop gain em R$X, teria evitado devolver <span className="text-b-green font-bold">{formatCurrency(stats.totalProfitDevolution ?? 0)}</span> nos últimos 3 meses.</p>
        </div>

        {/* Evolution Summary Mini-Chart */}
        <div className="bg-b-dark border border-b-border rounded-md p-3">
          <p className="text-sm font-semibold mb-2">Evolução da Devolução de Lucro:</p>
          <ResponsiveContainer width="100%" height={80}>
            {stats.devolutionTrend && (
              <LineChart data={stats.devolutionTrend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} style={{ fontSize: '10px' }} />
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value) => typeof value === 'number' ? formatCurrency(value) : value} />
                <Line type="monotone" dataKey="amount" stroke="#E74C3C" strokeWidth={2} dot={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Interaction: Stop Gain Alert Toggle */}
        <div className="flex items-center justify-between p-3 bg-b-dark border border-b-border rounded-md">
          <div className="flex items-center">
            <BellRing className="h-5 w-5 text-b-blue mr-2" />
            <p className="text-sm font-semibold">Alerta de Stop Gain Ativo:</p>
          </div>
          <button
            onClick={() => setIsStopGainAlertActive(!isStopGainAlertActive)}
            className={`px-4 py-2 rounded-md text-sm font-semibold ${isStopGainAlertActive ? 'bg-b-green text-white' : 'bg-b-red text-white'}`}
          >
            {isStopGainAlertActive ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
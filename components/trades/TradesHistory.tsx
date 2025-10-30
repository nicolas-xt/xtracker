import React, { useState } from 'react';
import { Trade } from '../../types';
import { useSortableData } from '../../hooks/useSortableData';

interface TradesHistoryProps {
  trades: Trade[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
};

const formatPrice = (value: number) => {
  return value.toLocaleString('pt-BR');
};

const formatDuration = (durationStr: string) => {
  if (typeof durationStr !== 'string') return '';
  const parts = durationStr.split(':').map(Number);
  if (parts.length !== 3) return durationStr;

  const [hours, minutes, seconds] = parts;
  
  let formattedParts = [];
  if (hours > 0) formattedParts.push(`${hours}h`);
  if (minutes > 0) formattedParts.push(`${minutes}m`);
  if (seconds > 0 || formattedParts.length === 0) formattedParts.push(`${seconds}s`);
  
  return formattedParts.join(' ');
};

const calculateScore = (trade: Trade) => {
  const score = trade.result >= 0 
    ? Math.abs(trade.closePrice - trade.openPrice)
    : -Math.abs(trade.closePrice - trade.openPrice);
  return `${score > 0 ? '+' : ''}${score.toFixed(0)}pts`;
};

export const TradesHistory: React.FC<TradesHistoryProps> = ({ trades }) => {
  const [filterAsset, setFilterAsset] = useState('all');
  const [filterResult, setFilterResult] = useState('all');

  const { items: sortedTrades, requestSort, sortConfig } = useSortableData(trades, { key: 'openTime', direction: 'descending' });

  const filteredTrades = sortedTrades.filter(trade => {
    if (filterAsset !== 'all' && trade.asset !== filterAsset) return false;
    if (filterResult !== 'all' && (trade.result >= 0 ? 'gain' : 'loss') !== filterResult) return false;
    return true;
  });

  const uniqueAssets = [...new Set(trades.map(trade => trade.asset))];

  const Th = ({ children, sortKey }: { children: React.ReactNode, sortKey: keyof Trade }) => {
    const isSorted = sortConfig?.key === sortKey;
    const direction = isSorted ? (sortConfig?.direction === 'ascending' ? ' ▲' : ' ▼') : '';
    return (
      <th scope="col" className="text-center text-sm text-gray-400 pb-3 cursor-pointer" onClick={() => requestSort(sortKey)}>
        {children} <span className="text-blue-500">{direction}</span>
      </th>
    );
  };

  if (trades.length === 0) {
    return <div className="p-6 text-center text-white">Nenhum trade para exibir. Importe seus dados na aba 'Configurações'.</div>;
  }

  const totalResult = trades.reduce((acc, trade) => acc + trade.result, 0);
  const totalPoints = trades.reduce((acc, trade) => {
    const score = trade.side === 'C' ? trade.closePrice - trade.openPrice : trade.openPrice - trade.closePrice;
    return acc + score;
  }, 0);
  const averagePoints = totalPoints / (trades.length || 1);
  
  const totalDurationInSeconds = trades.reduce((acc, trade) => {
    if (typeof trade.duration !== 'string') {
      return acc;
    }
    
    let totalSeconds = 0;
    const minMatch = trade.duration.match(/(\d+)min/);
    const secMatch = trade.duration.match(/(\d+)s/);

    if (minMatch) {
      totalSeconds += parseInt(minMatch[1], 10) * 60;
    }
    if (secMatch) {
      totalSeconds += parseInt(secMatch[1], 10);
    }
    
    return acc + totalSeconds;
  }, 0);

  const averageDuration = trades.length > 0 ? totalDurationInSeconds / trades.length : 0;

  const formatAvgDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.round(duration % 60);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
          <div className="relative text-center">
            <p className="text-sm text-gray-400 mb-1">Resultado no Período</p>
            <p className={`text-2xl font-semibold ${totalResult >= 0 ? 'text-[#28C780]' : 'text-[#EA3943]'}`}>{formatCurrency(totalResult)}</p>
            <p className="text-xs text-gray-400 mt-1">Soma dos resultados</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
          <div className="relative text-center">
            <p className="text-sm text-gray-400 mb-1">Resultado em Pontos</p>
            <p className={`text-2xl font-semibold ${totalPoints >= 0 ? 'text-[#28C780]' : 'text-[#EA3943]'}`}>{totalPoints.toFixed(0)}pts</p>
            <p className="text-xs text-gray-400 mt-1">Soma dos pontos</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
          <div className="relative text-center">
            <p className="text-sm text-gray-400 mb-1">Média de Pontos</p>
            <p className={`text-2xl font-semibold ${averagePoints >= 0 ? 'text-[#28C780]' : 'text-[#EA3943]'}`}>{averagePoints.toFixed(1)}pts</p>
            <p className="text-xs text-gray-400 mt-1">Por operação</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
          <div className="relative text-center">
            <p className="text-sm text-gray-400 mb-1">Tempo Médio</p>
            <p className="text-2xl font-semibold text-white">{formatAvgDuration(averageDuration)}</p>
            <p className="text-xs text-gray-400 mt-1">Duração das operações</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
        <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>

        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
            <h3 className="text-lg font-semibold text-white">Histórico de Operações</h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <select
                  value={filterAsset}
                  onChange={(e) => setFilterAsset(e.target.value)}
                  className="bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[12px] border border-gray-500/25 text-white px-3 py-2 rounded-[12px] focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                >
                  <option value="all">Todos os Ativos</option>
                  {uniqueAssets.map(asset => (
                    <option key={asset} value={asset}>{asset}</option>
                  ))}
                </select>
                <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.03] to-transparent rounded-[11px] pointer-events-none"></div>
              </div>
              <div className="relative">
                <select
                  value={filterResult}
                  onChange={(e) => setFilterResult(e.target.value)}
                  className="bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[12px] border border-gray-500/25 text-white px-3 py-2 rounded-[12px] focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                >
                  <option value="all">Todos os Resultados</option>
                  <option value="gain">Apenas Gains</option>
                  <option value="loss">Apenas Losses</option>
                </select>
                <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.03] to-transparent rounded-[11px] pointer-events-none"></div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-500/20">
                  <Th sortKey="asset">Ativo</Th>
                  <Th sortKey="openTime">Entrada</Th>
                  <Th sortKey="openPrice">Preço Entrada</Th>
                  <Th sortKey="closeTime">Saída</Th>
                  <Th sortKey="closePrice">Preço Saída</Th>
                  <Th sortKey="quantity">Contratos</Th>
                  <Th sortKey="duration">Duração</Th>
                  <Th sortKey="result">Pontuação</Th>
                  <Th sortKey="result">Resultado</Th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.map((trade) => (
                  <tr key={trade.id} className={`border-b border-gray-500/10 ${trade.result >= 0 ? 'bg-green-500/5' : 'bg-red-500/5'} hover:bg-gray-500/10 transition-colors duration-200`}>
                    <td className="py-4 text-center">
                      <span className="text-white font-medium">{trade.asset}</span>
                    </td>
                    <td className="py-4 text-center">
                      <div className="text-white text-sm">
                        <div>{new Date(trade.openTime).toLocaleDateString('pt-BR')}</div>
                        <div className="text-xs text-gray-400">{new Date(trade.openTime).toLocaleTimeString('pt-BR')}</div>
                      </div>
                    </td>
                    <td className="py-4 text-white text-center">{formatPrice(trade.openPrice)}</td>
                    <td className="py-4 text-center">
                      <div className="text-white text-sm">
                        <div>{new Date(trade.closeTime).toLocaleDateString('pt-BR')}</div>
                        <div className="text-xs text-gray-400">{new Date(trade.closeTime).toLocaleTimeString('pt-BR')}</div>
                      </div>
                    </td>
                    <td className="py-4 text-white text-center">{formatPrice(trade.closePrice)}</td>
                    <td className="py-4 text-white text-center">{trade.quantity}</td>
                    <td className="py-4 text-white text-center">{formatDuration(trade.duration)}</td>
                    <td className="py-4 text-white text-center">{calculateScore(trade)}</td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className={trade.result >= 0 ? 'text-[#28C780] font-semibold' : 'text-[#EA3943] font-semibold'}>
                          {formatCurrency(trade.result)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-[8px] ${
                          trade.result >= 0
                            ? 'bg-[#28C780]/20 text-[#28C780] border border-[#28C780]/30'
                            : 'bg-[#EA3943]/20 text-[#EA3943] border border-[#EA3943]/30'
                        }`}>
                          {trade.result >= 0 ? 'Gain' : 'Loss'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
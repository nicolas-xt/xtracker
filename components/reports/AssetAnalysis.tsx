import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DetailedStats } from '../../types';

interface AssetAnalysisProps {
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

const formatPercent = (value: number) => {
  return `${value.toFixed(1)}%`;
};

export const AssetAnalysis: React.FC<AssetAnalysisProps> = ({ stats }) => {
  const assetPerformance = stats.resultsByAsset.map(assetStat => {
    // Placeholder for sector logic - you might need a more sophisticated mapping
    let sector = 'Outros';
    if (assetStat.key.startsWith('WDO') || assetStat.key.startsWith('WIN')) {
      sector = 'Índice';
    } else if (assetStat.key.endsWith('3') || assetStat.key.endsWith('4')) { // Simple heuristic for stocks
      sector = 'Ações';
    }

    // Calculate gains and losses from raw trades if needed, or derive from winRate and totalTrades
    // For now, we'll just use the winRate and totalTrades to estimate
    const gains = Math.round(assetStat.winRate * assetStat.trades);
    const losses = assetStat.trades - gains;

    return {
      asset: assetStat.key,
      totalResult: assetStat.result,
      winRate: assetStat.winRate * 100, // Convert to percentage
      payoff: assetStat.winRate > 0 && (1 - assetStat.winRate) > 0 ? (assetStat.result / assetStat.trades) / (stats.avgLoss * -1) : 0, // Simplified payoff calculation
      totalTrades: assetStat.trades,
      avgResult: assetStat.trades > 0 ? assetStat.result / assetStat.trades : 0,
      gains,
      losses,
      sector,
    };
  });

  const sectorDataMap = assetPerformance.reduce((acc, asset) => {
    if (!acc[asset.sector]) {
      acc[asset.sector] = { name: asset.sector, value: 0, color: '#00D0FF' }; // Default color
    }
    acc[asset.sector].value += asset.totalResult;
    return acc;
  }, {} as Record<string, { name: string; value: number; color: string }>);

  const sectorData = Object.values(sectorDataMap);

  const totalSectorValue = sectorData.reduce((sum, entry) => sum + entry.value, 0);

  const mostProfitableAsset = assetPerformance.reduce((prev, current) => (
    (prev.totalResult > current.totalResult) ? prev : current
  ), { asset: '', totalResult: -Infinity, winRate: 0, payoff: 0, totalTrades: 0, avgResult: 0, gains: 0, losses: 0, sector: '' });

  const highestVolumeAsset = assetPerformance.reduce((prev, current) => (
    (prev.totalTrades > current.totalTrades) ? prev : current
  ), { asset: '', totalResult: 0, winRate: 0, payoff: 0, totalTrades: -Infinity, avgResult: 0, gains: 0, losses: 0, sector: '' });

  const bestConsistencyAsset = assetPerformance.reduce((prev, current) => (
    (prev.winRate > current.winRate) ? prev : current
  ), { asset: '', totalResult: 0, winRate: -Infinity, payoff: 0, totalTrades: 0, avgResult: 0, gains: 0, losses: 0, sector: '' });

  return (
    <div className="space-y-6">
      {/* Treemap por Setor */}
      <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
        <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>

        <div className="relative">
          <h3 className="text-lg font-semibold text-white mb-4">Distribuição por Setor</h3>
          <div className="grid grid-cols-2 gap-4 h-32">
            {sectorData.map((sector, index) => (
              <div
                key={sector.name}
                className="bg-gradient-to-br from-[#242424]/60 to-[#242424]/80 backdrop-blur-[12px] border border-gray-500/20 rounded-[16px] p-4 flex flex-col justify-between relative overflow-hidden hover:from-[#242424]/70 hover:to-[#242424]/90 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[16px]"></div>
                <div className="relative">
                  <p className="text-sm text-gray-300">{sector.name}</p>
                  <p className="text-lg font-semibold text-white">{formatCurrency(sector.value)}</p>
                  <p className="text-xs text-gray-400">{formatPercent((sector.value / totalSectorValue) * 100)} do total</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumo por Ativo - Tabela */}
      <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
        <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>

        <div className="relative">
          <h3 className="text-lg font-semibold text-white mb-4">Resumo por Ativo</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-500/20">
                  <th className="text-left text-sm text-gray-400 pb-3">Ativo</th>
                  <th className="text-left text-sm text-gray-400 pb-3">Resultado Líquido</th>
                  <th className="text-left text-sm text-gray-400 pb-3">Taxa de Acerto</th>
                  <th className="text-left text-sm text-gray-400 pb-3">Payoff</th>
                  <th className="text-left text-sm text-gray-400 pb-3">Operações</th>
                  <th className="text-left text-sm text-gray-400 pb-3">Resultado Médio</th>
                  <th className="text-left text-sm text-gray-400 pb-3">G/L</th>
                </tr>
              </thead>
              <tbody>
                {assetPerformance.map((asset, index) => (
                  <tr key={asset.asset} className="border-b border-gray-500/10 hover:bg-gray-500/10 transition-colors duration-200">
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 bg-[#00D0FF]/20 text-[#00D0FF] border border-[#00D0FF]/30 rounded-[6px]">
                          {asset.asset}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <span className={asset.totalResult >= 0 ? 'text-[#28C780] font-semibold' : 'text-[#EA3943] font-semibold'}>
                          {asset.totalResult >= 0 ? '↗' : '↙'}
                        </span>
                        <span className={asset.totalResult >= 0 ? 'text-[#28C780] font-semibold' : 'text-[#EA3943] font-semibold'}>
                          {formatCurrency(asset.totalResult)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-white">{formatPercent(asset.winRate)}</span>
                      </div>
                    </td>
                    <td className="py-4 text-white">
                      {asset.payoff > 0 ? `${asset.payoff.toFixed(2)} : 1` : 'N/A'}
                    </td>
                    <td className="py-4 text-white">{asset.totalTrades}</td>
                    <td className="py-4">
                      <span className={asset.avgResult >= 0 ? 'text-[#28C780]' : 'text-[#EA3943]'}>
                        {formatCurrency(asset.avgResult)}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-1">
                        <span className="text-xs px-2 py-1 bg-[#28C780]/20 text-[#28C780] border border-[#28C780]/30 rounded-[6px]">
                          {asset.gains}G
                        </span>
                        <span className="text-xs px-2 py-1 bg-[#EA3943]/20 text-[#EA3943] border border-[#EA3943]/30 rounded-[6px]">
                          {asset.losses}L
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>

          <div className="relative text-center">
            <h4 className="text-sm text-gray-400 mb-3">Ativo Mais Lucrativo</h4>
            <span className="text-xs px-2 py-1 bg-[#28C780]/20 text-[#28C780] border border-[#28C780]/30 rounded-[6px] mb-2 inline-block">
              {mostProfitableAsset.asset || 'N/A'}
            </span>
            <p className="text-2xl font-semibold text-[#28C780] mb-1">
              {formatCurrency(mostProfitableAsset.totalResult)}
            </p>
            <p className="text-xs text-gray-400">{formatPercent(mostProfitableAsset.winRate)} de acerto</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>

          <div className="relative text-center">
            <h4 className="text-sm text-gray-400 mb-3">Maior Volume</h4>
            <span className="text-xs px-2 py-1 bg-[#00D0FF]/20 text-[#00D0FF] border border-[#00D0FF]/30 rounded-[6px] mb-2 inline-block">
              {highestVolumeAsset.asset || 'N/A'}
            </span>
            <p className="text-2xl font-semibold text-white mb-1">
              {highestVolumeAsset.totalTrades} operações
            </p>
            <p className="text-xs text-gray-400">{formatPercent((highestVolumeAsset.totalTrades / stats.totalTrades) * 100)} do total</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>

          <div className="relative text-center">
            <h4 className="text-sm text-gray-400 mb-3">Melhor Consistência</h4>
            <span className="text-xs px-2 py-1 bg-[#28C780]/20 text-[#28C780] border border-[#28C780]/30 rounded-[6px] mb-2 inline-block">
              {bestConsistencyAsset.asset || 'N/A'}
            </span>
            <p className="text-2xl font-semibold text-[#28C780] mb-1">
              {formatPercent(bestConsistencyAsset.winRate)}
            </p>
            <p className="text-xs text-gray-400">Taxa de acerto</p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
        <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>

        <div className="relative">
          <h4 className="text-lg font-semibold text-white mb-4">Insights por Ativo</h4>
          <div className="space-y-4">
            {assetPerformance.length > 0 ? (
              assetPerformance.map((asset, index) => (
                <div key={asset.asset} className="p-4 bg-gradient-to-br from-[#00D0FF]/10 to-[#00D0FF]/5 border border-[#00D0FF]/20 rounded-[16px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[16px]"></div>
                  <p className="relative text-sm text-gray-300">
                    💡 <strong className="text-white">{asset.asset}</strong>: Resultado total de {formatCurrency(asset.totalResult)}, com {formatPercent(asset.winRate)} de acerto em {asset.totalTrades} operações.
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">Nenhum dado de ativo disponível para insights.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
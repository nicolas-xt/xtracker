import { useState, useEffect } from 'react';
import { Trade, DashboardStats, DetailedStats, ResultBy } from '../types';
import { parseDuration } from '../utils/formatters';

interface TradeStats {
  stats: DashboardStats;
  detailedStats: DetailedStats; // No longer null
}

// Helper to create a default, empty stats object
const createEmptyStats = (initialCapital: number): DetailedStats => ({
    grossResult: 0,
    fees: 0,
    brokerage: 0,
    b3Fees: 0,
    irrf: 0,
    netResult: 0,
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    payoff: 0,
    avgWin: 0,
    avgLoss: 0,
    maxWin: 0,
    maxLoss: 0,
    bestTrades: [],
    worstTrades: [],
    avgProfitPerTrade: 0,
    dailyPerformance: [],
    positiveDays: 0,
    negativeDays: 0,
    avgWinDuration: 0,
    avgLossDuration: 0,
    resultAfter2Losses: 0,
    overtradingSessionFrequency: 0,
    totalProfitDevolution: 0,
    profitDevolutionSessionFrequency: 0,
    profitDevolutionOccurrences: 0,
    profitFactor: 0,
    mathExpectation: 0,
    maxConsecutiveWins: 0,
    maxConsecutiveLosses: 0,
    maxDrawdown: 0,
    maxDrawdownPercent: 0,
    resultsByAsset: [],
    resultsByType: [],
    resultsByDayOfWeek: [],
    occurrences: [],
    simulationSavings: 0,
    frequencyTrend: [],
    euphoriaOccurrences: [],
    devolutionTrend: [],
    previousPeriodStats: null,
    performanceByHour: [],
    entryExitPatterns: { avgDuration: 0, stdDevDuration: 0 },
    sentimentCorrelation: [],
    strategyAssertiveness: [],
    payoffByStrategy: [],
    payoffBySentiment: [],
    winLossStreaks: { maxWins: 0, maxLosses: 0, performanceAfterLossStreak: 0, performanceAfterWinStreak: 0 },
    totalContracts: 0,
    taxaBMf: 0,
    finalResult: 0,
    avgScoreOnWinDays: 0,
});


const getSettings = () => {
  try {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (error) {
    console.error("Failed to parse app settings from localStorage", error);
  }
  return {
    initialCapital: 100000,
    monthlyGoal: 10000,
    dailyLossLimit: 1000,
    overtradingThreshold: 2,
    euphoriaThreshold: 20,
  };
};

const calculateStats = (trades: Trade[], initialCapital: number): DetailedStats => {
  if (trades.length === 0) {
    // Return the empty, default object instead of null
    return createEmptyStats(initialCapital);
  }

  const sortedTrades = [...trades].sort((a, b) => new Date(a.openTime).getTime() - new Date(b.openTime).getTime());

  const wins = sortedTrades.filter(t => t.result > 0);
  const losses = sortedTrades.filter(t => t.result < 0);

  const grossResult = sortedTrades.reduce((sum, t) => sum + t.result, 0);
  const totalWins = wins.reduce((sum, t) => sum + t.result, 0);
  const totalLosses = losses.reduce((sum, t) => sum + t.result, 0);

  const totalBrokerage = sortedTrades.reduce((sum, t) => sum + (t.brokerage || 0), 0);
  const totalB3Fees = sortedTrades.reduce((sum, t) => sum + (t.b3Fees || 0), 0);
  const totalFees = totalBrokerage + totalB3Fees;

  const taxaPorContrato = 0.50;
  const totalContracts = sortedTrades.reduce((sum, t) => sum + t.quantity, 0);
  const taxaBMf = totalContracts * taxaPorContrato;
  // Corrected IRRF calculation
  const baseCalculoIRRF = grossResult - taxaBMf;
  const irrf = baseCalculoIRRF > 0 ? baseCalculoIRRF * 0.01 : 0;
  const finalResult = grossResult - irrf - taxaBMf;
  
  const avgWin = wins.length > 0 ? totalWins / wins.length : 0;
  const avgLoss = losses.length > 0 ? totalLosses / losses.length : 0;
  const winRate = sortedTrades.length > 0 ? wins.length / sortedTrades.length : 0;

  const basicStats = {
    grossResult,
    fees: totalFees,
    brokerage: totalBrokerage,
    b3Fees: totalB3Fees,
    irrf,
    netResult: grossResult - totalFees,
    totalTrades: sortedTrades.length,
    winningTrades: wins.length,
    losingTrades: losses.length,
    winRate,
    payoff: Math.abs(avgLoss) > 0 ? avgWin / Math.abs(avgLoss) : 0,
    avgWin,
    avgLoss,
  };

  const getLocalDate = (dateString: string) => dateString.split('T')[0];

  const tradesByDay = sortedTrades.reduce((acc, trade) => {
      const day = getLocalDate(trade.openTime);
      if (!acc[day]) acc[day] = [];
      acc[day].push(trade);
      return acc;
  }, {} as Record<string, Trade[]>);

  const dailyStats = Object.entries(tradesByDay).map(([date, dayTrades]) => {
      let dailyPeak = 0, dailyCumulative = 0, hasLossSequence = false, consecutiveLosses = 0;
      for (const trade of dayTrades) {
          dailyCumulative += trade.result;
          if (dailyCumulative > dailyPeak) dailyPeak = dailyCumulative;
          consecutiveLosses = trade.result < 0 ? consecutiveLosses + 1 : 0;
          if (consecutiveLosses >= 2) hasLossSequence = true;
      }
      const devolution = dailyPeak > dailyCumulative ? dailyPeak - dailyCumulative : 0;
      return { date, devolution, hasLossSequence, dailyPeak };
  });

  const totalProfitDevolution = dailyStats.reduce((sum, day) => sum + day.devolution, 0);
  const devolutionOccurrences = dailyStats.filter(d => d.devolution > 0).length;
  const profitDevolutionSessionFrequency = dailyStats.length > 0 ? devolutionOccurrences / dailyStats.length : 0;

  const euphoriaOccurrences = dailyStats.filter(d => d.devolution > 0).map(d => ({
      date: d.date,
      peakProfit: d.dailyPeak,
      amountDevolved: d.devolution
  }));

  const devolutionByMonth = dailyStats.reduce((acc, d) => {
      const month = new Date(d.date).toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = 0;
      acc[month] += d.devolution;
      return acc;
  }, {} as Record<string, number>);

  const devolutionTrend = Object.entries(devolutionByMonth).map(([month, amount]) => ({
      month,
      amount
  }));

  const overtradingDays = Object.values(tradesByDay).filter(dayTrades => {
    let consecutiveLosses = 0;
    for (const trade of dayTrades) {
      consecutiveLosses = trade.result < 0 ? consecutiveLosses + 1 : 0;
      if (consecutiveLosses >= 2) return true;
    }
    return false;
  });

  const avgResultOnOvertradingDays = overtradingDays.length > 0
    ? overtradingDays.reduce((sum, day) => sum + day.reduce((daySum, trade) => daySum + trade.result, 0), 0) / overtradingDays.length
    : 0;

  const overtradingSessionFrequency = dailyStats.length > 0 ? overtradingDays.length / dailyStats.length : 0;

  const occurrences = overtradingDays.map(dayTrades => {
      let consecutiveLosses = 0, losses = 0, amountLost = 0;
      let overtradingStarted = false;
      const date = getLocalDate(dayTrades[0].openTime);

      for (const trade of dayTrades) {
          if (trade.result < 0) consecutiveLosses++;
          else consecutiveLosses = 0;

          if (consecutiveLosses >= 2 && !overtradingStarted) {
              overtradingStarted = true;
              losses = consecutiveLosses;
          }
          if (overtradingStarted) amountLost += trade.result;
      }
      return { date, losses, amountLost };
  });

  const simulationSavings = overtradingDays.reduce((totalSavings, dayTrades) => {
      let consecutiveLosses = 0, overtradingStarted = false, dailyLoss = 0;
      for (const trade of dayTrades) {
          if (overtradingStarted) dailyLoss += trade.result;
          if (trade.result < 0) consecutiveLosses++;
          else consecutiveLosses = 0;
          if (consecutiveLosses >= 2 && !overtradingStarted) overtradingStarted = true;
      }
      return totalSavings - dailyLoss;
  }, 0);

  const tradesByMonth = sortedTrades.reduce((acc, trade) => {
      const month = new Date(trade.openTime).toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = [];
      acc[month].push(trade);
      return acc;
  }, {} as Record<string, Trade[]>);

  const frequencyTrend = Object.entries(tradesByMonth).map(([month, monthTrades]) => {
      const tradesByDayInMonth = monthTrades.reduce((acc, trade) => {
          const day = getLocalDate(trade.openTime);
          if (!acc[day]) acc[day] = [];
          acc[day].push(trade);
          return acc;
      }, {} as Record<string, Trade[]>);

      const overtradingDaysInMonth = Object.values(tradesByDayInMonth).filter(dayTrades => {
          let consecutiveLosses = 0;
          for (const trade of dayTrades) {
              consecutiveLosses = trade.result < 0 ? consecutiveLosses + 1 : 0;
              if (consecutiveLosses >= 2) return true;
          }
          return false;
      });

      const frequency = Object.keys(tradesByDayInMonth).length > 0 ? overtradingDaysInMonth.length / Object.keys(tradesByDayInMonth).length : 0;
      return { month, frequency };
  });

  const maxWin = Math.max(0, ...sortedTrades.map(t => t.result));
  const maxLoss = Math.min(0, ...sortedTrades.map(t => t.result));
  const bestTrades = [...sortedTrades].sort((a, b) => b.result - a.result).slice(0, 5);
  const worstTrades = [...sortedTrades].sort((a, b) => a.result - b.result).slice(0, 5);
  
  const dailyPerformance = Object.entries(tradesByDay).map(([day, dayTrades]) => ({
      key: day,
      result: dayTrades.reduce((sum, t) => sum + t.result, 0),
      trades: dayTrades.length,
      winRate: dayTrades.length > 0 ? dayTrades.filter(t => t.result > 0).length / dayTrades.length : 0,
  }));

  const winningDays = dailyPerformance.filter(d => d.result > 0);
  const totalScoreOnWinDays = winningDays.reduce((totalScore, day) => {
    const dayTrades = tradesByDay[day.key];
    const dailyScore = dayTrades.reduce((dayTotal, trade) => {
      const score = trade.side === 'C' 
        ? trade.closePrice - trade.openPrice 
        : trade.openPrice - trade.closePrice;
      return dayTotal + score;
    }, 0);
    return totalScore + dailyScore;
  }, 0);

  const avgScoreOnWinDays = winningDays.length > 0 ? totalScoreOnWinDays / winningDays.length : 0;

  let consecutive = { wins: 0, losses: 0, maxWins: 0, maxLosses: 0 };
  sortedTrades.forEach(t => {
    if (t.result > 0) { consecutive.wins++; consecutive.losses = 0; } 
    else if (t.result < 0) { consecutive.losses++; consecutive.wins = 0; }
    if (consecutive.wins > consecutive.maxWins) consecutive.maxWins = consecutive.wins;
    if (consecutive.losses > consecutive.maxLosses) consecutive.maxLosses = consecutive.losses;
  });

  let peak = initialCapital, maxDrawdown = 0, cumulative = initialCapital;
  sortedTrades.forEach(t => {
    cumulative += t.result;
    if (cumulative > peak) peak = cumulative;
    const drawdown = peak - cumulative;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  });

  const groupTrades = (trades: Trade[], keyExtractor: (trade: Trade) => string): ResultBy<string>[] => {
      const groups = trades.reduce((acc, trade) => {
          const key = keyExtractor(trade);
          if (!acc[key]) acc[key] = { key, result: 0, trades: 0, winRate: 0, _wins: 0 };
          acc[key].result += trade.result;
          acc[key].trades += 1;
          if (trade.result > 0) acc[key]._wins += 1;
          return acc;
      }, {} as Record<string, any>);

      return Object.values(groups).map(group => ({
          key: group.key,
          result: group.result,
          trades: group.trades,
          winRate: group.trades > 0 ? group._wins / group.trades : 0,
      }));
    };
  const dayOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const performanceByHourMap = sortedTrades.reduce((acc, trade) => {
    const hour = new Date(trade.openTime).getHours();
    if (!acc[hour]) acc[hour] = { hour, totalResult: 0, totalTrades: 0, winningTrades: 0 };
    acc[hour].totalResult += trade.result;
    acc[hour].totalTrades += 1;
    if (trade.result > 0) acc[hour].winningTrades += 1;
    return acc;
  }, {} as Record<number, { hour: number; totalResult: number; totalTrades: number; winningTrades: number }>);

  const performanceByHour = Object.values(performanceByHourMap).map(hourStats => ({
    hour: hourStats.hour,
    totalResult: hourStats.totalResult,
    totalTrades: hourStats.totalTrades,
    winRate: hourStats.totalTrades > 0 ? hourStats.winningTrades / hourStats.totalTrades : 0,
  })).sort((a, b) => a.hour - b.hour);

  const durations = sortedTrades.map(t => parseDuration(t.duration));
  const avgDuration = durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0;
  const stdDevDuration = durations.length > 0 ? Math.sqrt(durations.map(d => Math.pow(d - avgDuration, 2)).reduce((sum, sq) => sum + sq, 0) / durations.length) : 0;

  const entryExitPatterns = { avgDuration, stdDevDuration };

  const sentimentCorrelationMap = sortedTrades.reduce((acc, trade) => {
    if (trade.sentiment) {
      if (!acc[trade.sentiment]) acc[trade.sentiment] = { sentiment: trade.sentiment, totalResult: 0, totalTrades: 0 };
      acc[trade.sentiment].totalResult += trade.result;
      acc[trade.sentiment].totalTrades += 1;
    }
    return acc;
  }, {} as Record<string, { sentiment: string; totalResult: number; totalTrades: number }>);

  const sentimentCorrelation = Object.values(sentimentCorrelationMap).map(s => ({
    sentiment: s.sentiment,
    avgResult: s.totalTrades > 0 ? s.totalResult / s.totalTrades : 0,
    totalTrades: s.totalTrades,
  }));

  const strategyAssertivenessMap = sortedTrades.reduce((acc, trade) => {
    if (trade.setup) {
      if (!acc[trade.setup]) acc[trade.setup] = { strategy: trade.setup, totalResult: 0, totalTrades: 0, winningTrades: 0 };
      acc[trade.setup].totalResult += trade.result;
      acc[trade.setup].totalTrades += 1;
      if (trade.result > 0) acc[trade.setup].winningTrades += 1;
    }
    return acc;
  }, {} as Record<string, { strategy: string; totalResult: number; totalTrades: number; winningTrades: number }>);

  const strategyAssertiveness = Object.values(strategyAssertivenessMap).map(s => ({
    strategy: s.strategy,
    totalResult: s.totalResult,
    totalTrades: s.totalTrades,
    winRate: s.totalTrades > 0 ? s.winningTrades / s.totalTrades : 0,
  }));

  const payoffByStrategy = strategyAssertiveness.map(s => ({
    strategy: s.strategy,
    avgPayoff: s.winRate > 0 && (1 - s.winRate) > 0 ? (s.totalResult / s.totalTrades) / (basicStats.avgLoss * -1) : 0,
  }));

  const payoffBySentiment = sentimentCorrelation.map(s => ({
    sentiment: s.sentiment,
    avgPayoff: s.totalTrades > 0 && s.avgResult > 0 && (1 - (s.totalResult / s.totalTrades)) > 0 ? (s.avgResult) / (basicStats.avgLoss * -1) : 0,
  }));

  let performanceAfterLossStreak = 0, performanceAfterWinStreak = 0;
  let currentStreak = 0, tradesAfterLossStreak = 0, tradesAfterWinStreak = 0;

  for (let i = 0; i < sortedTrades.length - 1; i++) {
    const trade = sortedTrades[i];
    if (trade.result > 0) {
      if (currentStreak < 0 && Math.abs(currentStreak) >= 2) {
        performanceAfterLossStreak += sortedTrades[i + 1].result;
        tradesAfterLossStreak++;
      }
      currentStreak = currentStreak > 0 ? currentStreak + 1 : 1;
    } else if (trade.result < 0) {
      if (currentStreak > 0 && currentStreak >= 2) {
        performanceAfterWinStreak += sortedTrades[i + 1].result;
        tradesAfterWinStreak++;
      }
      currentStreak = currentStreak < 0 ? currentStreak - 1 : -1;
    } else {
      currentStreak = 0;
    }
  }

  const winLossStreaks = {
    maxWins: consecutive.maxWins,
    maxLosses: consecutive.maxLosses,
    performanceAfterLossStreak: tradesAfterLossStreak > 0 ? performanceAfterLossStreak / tradesAfterLossStreak : 0,
    performanceAfterWinStreak: tradesAfterWinStreak > 0 ? performanceAfterWinStreak / tradesAfterWinStreak : 0,
  };

  return {
      ...basicStats,
      maxWin, maxLoss, bestTrades, worstTrades,
      avgProfitPerTrade: sortedTrades.length > 0 ? grossResult / sortedTrades.length : 0,
      dailyPerformance,
      positiveDays: dailyPerformance.filter(d => d.result > 0).length,
      negativeDays: dailyPerformance.filter(d => d.result < 0).length,
      avgWinDuration: wins.length > 0 ? wins.reduce((sum, t) => sum + parseDuration(t.duration), 0) / wins.length : 0,
      avgLossDuration: losses.length > 0 ? losses.reduce((sum, t) => sum + parseDuration(t.duration), 0) / losses.length : 0,
      resultAfter2Losses: avgResultOnOvertradingDays,
      overtradingSessionFrequency,
      totalProfitDevolution,
      profitDevolutionSessionFrequency,
      profitDevolutionOccurrences: devolutionOccurrences,
      profitFactor: Math.abs(totalLosses) > 0 ? totalWins / Math.abs(totalLosses) : 0,
      mathExpectation: (winRate * avgWin) + ((1 - winRate) * avgLoss),
      maxConsecutiveWins: consecutive.maxWins,
      maxConsecutiveLosses: consecutive.maxLosses,
      maxDrawdown,
      maxDrawdownPercent: peak > 0 ? maxDrawdown / peak : 0,
      resultsByAsset: groupTrades(sortedTrades, t => t.asset),
      resultsByType: groupTrades(sortedTrades, t => t.side === 'C' ? 'Compra' : 'Venda') as ResultBy<'Compra' | 'Venda'>[],
      resultsByDayOfWeek: groupTrades(sortedTrades, t => dayOfWeek[new Date(t.openTime).getDay()]),
      occurrences,
      simulationSavings,
      frequencyTrend,
      euphoriaOccurrences,
      devolutionTrend,
      previousPeriodStats: null,
      performanceByHour,
      entryExitPatterns,
      sentimentCorrelation,
      strategyAssertiveness,
      payoffByStrategy,
      payoffBySentiment,
      winLossStreaks,
      totalContracts,
      taxaBMf,
      finalResult,
      avgScoreOnWinDays,
  };
};


export const useTradeStats = (trades: Trade[], previousPeriodTrades?: Trade[]): TradeStats => {
  const [stats, setStats] = useState<DashboardStats>(createEmptyStats(0));
  const [detailedStats, setDetailedStats] = useState<DetailedStats>(createEmptyStats(0));

  useEffect(() => {
    const settings = getSettings();
    const initialCapital = settings.initialCapital;

    const currentPeriodStats = calculateStats(trades, initialCapital);
    const prevPeriodStats = previousPeriodTrades ? calculateStats(previousPeriodTrades, initialCapital) : null;

    currentPeriodStats.previousPeriodStats = prevPeriodStats;
    setStats(currentPeriodStats);
    setDetailedStats(currentPeriodStats);

  }, [trades, previousPeriodTrades]);

  return { stats, detailedStats };
};
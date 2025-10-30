import { useMemo } from 'react';
import { Trade } from '../types';

interface PerformanceMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalResult: number;
  averageResult: number;
}

interface HourlyPerformance extends PerformanceMetrics {
  hour: number;
}

interface RangePerformance extends PerformanceMetrics {
  range: string;
}

interface RangePerformanceExtended extends RangePerformance {
  averagePeak?: number; // average of daily maximum cumulative peaks for that range
  days?: number;
}
// New Interfaces for Best Scenario

export interface BestHourDetail {
  hour: number;
  averageResult: number;
  winRate: number;
  totalTrades: number;
}

export interface BestScenarioDetail {
  bestHours: BestHourDetail[];
  recommendedPointRange: { range: string; averageResult: number; winRate: number; totalTrades?: number; averagePeak?: number; days?: number };
  bestFinancialValueRange: { range: string; averageResult: number; winRate: number; totalTrades?: number; averagePeak?: number; days?: number };
  optimalMaxLossTolerance: number; // Renamed and refined
}

export interface BestScenarioByDay {
  dayOfWeek: string;
  scenario: BestScenarioDetail;
}

const calculatePerformanceMetrics = (trades: Trade[]): PerformanceMetrics => {
  const totalTrades = trades.length;
  const winningTrades = trades.filter(trade => trade.result > 0).length;
  const losingTrades = trades.filter(trade => trade.result < 0).length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const totalResult = trades.reduce((sum, trade) => sum + trade.result, 0);
  const averageResult = totalTrades > 0 ? totalResult / totalTrades : 0;

  return {
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    totalResult,
    averageResult,
  };
};

const getPeriodStartDate = (period: string): Date => {
  const now = new Date();
  switch (period) {
    case 'day':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case 'week':
      const dayOfWeek = now.getDay(); // Sunday - 0, Monday - 1, etc.
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday of current week
      return new Date(now.setDate(diff));
    case 'month':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case 'semester':
      const currentMonth = now.getMonth();
      const semesterStartMonth = currentMonth < 6 ? 0 : 6;
      return new Date(now.getFullYear(), semesterStartMonth, 1);
    case 'year':
      return new Date(now.getFullYear(), 0, 1);
    case 'all':
    default:
      return new Date(0); // Epoch for all history
  }
};

  const getRecommendedPointRange = (trades: Trade[]): { range: string; averageResult: number; winRate: number; totalTrades?: number; averagePeak?: number; days?: number } => {
  const pointRanges: { [key: string]: Trade[] } = {};
  const ranges = [
    { label: '> 300 pts', min: 301, max: Infinity },
    { label: '201-300 pts', min: 201, max: 300 },
    { label: '101-200 pts', min: 101, max: 200 },
    { label: '51-100 pts', min: 51, max: 100 },
    { label: '1-50 pts', min: 1, max: 50 },
    { label: '0 pts', min: 0, max: 0 },
    { label: '-1 - -100 pts', min: -100, max: -1 },
    { label: '-101 - -200 pts', min: -200, max: -101 },
    { label: '< -200 pts', min: -Infinity, max: -201 },
  ];

  trades.forEach(trade => {
    const points = trade.closePrice - trade.openPrice;
    const foundRange = ranges.find(r => points >= r.min && points <= r.max);
    const rangeLabel = foundRange ? foundRange.label : 'Unknown';

    if (!pointRanges[rangeLabel]) {
      pointRanges[rangeLabel] = [];
    }
    pointRanges[rangeLabel].push(trade);
  });

  let bestRange: { range: string; averageResult: number; winRate: number; totalTrades?: number; averagePeak?: number; days?: number } = { range: 'N/A', averageResult: 0, winRate: 0 };
  let maxScore = -Infinity;

  Object.entries(pointRanges).forEach(([range, tradesInRage]) => {
    const metrics = calculatePerformanceMetrics(tradesInRage);

    // Compute daily peaks for this range
    const tradesByDay: { [key: string]: Trade[] } = {};
    tradesInRage.forEach(t => {
      const d = new Date(t.openTime).toDateString();
      if (!tradesByDay[d]) tradesByDay[d] = [];
      tradesByDay[d].push(t);
    });

    const dailyPeaks: number[] = [];
    Object.values(tradesByDay).forEach(dayTrades => {
      dayTrades.sort((a, b) => new Date(a.closeTime).getTime() - new Date(b.closeTime).getTime());
      let cum = 0;
      let peak = -Infinity;
      dayTrades.forEach(tr => {
        cum += tr.result;
        if (cum > peak) peak = cum;
      });
      if (peak !== -Infinity) dailyPeaks.push(peak);
    });

    const averagePeak = dailyPeaks.length > 0 ? dailyPeaks.reduce((s, v) => s + v, 0) / dailyPeaks.length : undefined;
    const sampleFactor = Math.sqrt(metrics.totalTrades || 1);
    const normalizedWin = metrics.winRate / 100;

    // Use averagePeak when available to prefer daily peak performance
    const primaryMetric = averagePeak !== undefined ? averagePeak : metrics.averageResult;
    const score = primaryMetric * normalizedWin * sampleFactor;

    if (score > maxScore) {
      maxScore = score;
      bestRange = { range, averageResult: metrics.averageResult, winRate: metrics.winRate, totalTrades: metrics.totalTrades, averagePeak, days: Object.keys(tradesByDay).length };
    }
  });

  return bestRange;
};

const getOptimalMaxLossTolerance = (trades: Trade[]): number => {
  const dailyTradesMap: { [key: string]: Trade[] } = {};

  // Group trades by day
  trades.forEach(trade => {
    const date = new Date(trade.openTime).toDateString();
    if (!dailyTradesMap[date]) {
      dailyTradesMap[date] = [];
    }
    dailyTradesMap[date].push(trade);
  });

  const perDayMaxRecoverable: number[] = [];

  Object.values(dailyTradesMap).forEach(dayTrades => {
    if (dayTrades.length === 0) return;

    // Sort trades by close time to simulate chronological trading
    dayTrades.sort((a, b) => new Date(a.closeTime).getTime() - new Date(b.closeTime).getTime());

    // Build cumulative array
    const cum: number[] = [];
    for (let i = 0; i < dayTrades.length; i++) {
      const val = dayTrades[i].result;
      cum[i] = (i === 0 ? val : cum[i - 1] + val);
    }

    // Build suffix maxima: max cumulative from i..end
    const suffixMax: number[] = new Array(cum.length).fill(-Infinity);
    for (let i = cum.length - 1; i >= 0; i--) {
      suffixMax[i] = i === cum.length - 1 ? cum[i] : Math.max(cum[i], suffixMax[i + 1]);
    }

    // For each prefix i where cum[i] < 0, consider losses that were later recovered.
    // We want the largest intraday loss that the trader later reversed (e.g. hit -800 but finished the day above -800 or positive).
    const recoverableLosses: number[] = [];
    const finalCum = cum[cum.length - 1];
    for (let i = 0; i < cum.length; i++) {
      // cum[i] is a trough if negative
      if (cum[i] < 0) {
        // If later there was a point that exceeded this trough (suffixMax > cum[i]) and either
        // the suffixMax reached non-negative OR the day ended above the trough, count it as "recovered"
        if (suffixMax[i] > cum[i] && (suffixMax[i] >= 0 || finalCum > cum[i])) {
          recoverableLosses.push(Math.abs(cum[i]));
        }
      }
    }

    if (recoverableLosses.length > 0) {
      const maxRecoverable = Math.max(...recoverableLosses);
      perDayMaxRecoverable.push(maxRecoverable);
    }
  });

  if (perDayMaxRecoverable.length === 0) return 0;
  const sum = perDayMaxRecoverable.reduce((s, v) => s + v, 0);
  return sum / perDayMaxRecoverable.length;
};

export const useTradeAnalysis = (trades: Trade[]) => {

  const filterTradesByPeriod = (allTrades: Trade[], period: string): Trade[] => {
    if (period === 'all') {
      return allTrades;
    }
    const startDate = getPeriodStartDate(period);
    return allTrades.filter(trade => new Date(trade.openTime) >= startDate);
  };

  const analyzeFinancialValuePerformance = (allTrades: Trade[], period: string): RangePerformanceExtended[] => {
    const filteredTrades = filterTradesByPeriod(allTrades, period);
    const valueRanges: { [key: string]: Trade[] } = {};

    filteredTrades.forEach(trade => {
      const value = trade.result;
      let range: string;

      if (value > 500) range = '> R$ 500';
      else if (value > 100) range = 'R$ 101 - R$ 500';
      else if (value > 0) range = 'R$ 1 - R$ 100';
      else if (value === 0) range = 'R$ 0';
      else if (value < -500) range = '< -R$ 500';
      else if (value < 0) range = '-R$ 1 - -R$ 500';
      else range = 'Unknown';

      if (!valueRanges[range]) {
        valueRanges[range] = [];
      }
      valueRanges[range].push(trade);
    });

    return Object.entries(valueRanges).map(([range, tradesInRage]) => {
      const metrics = calculatePerformanceMetrics(tradesInRage);

      // compute daily peaks for this value range
      const byDay: { [key: string]: Trade[] } = {};
      tradesInRage.forEach(t => {
        const d = new Date(t.openTime).toDateString();
        if (!byDay[d]) byDay[d] = [];
        byDay[d].push(t);
      });

      const dailyPeaks: number[] = [];
      Object.values(byDay).forEach(dayTrades => {
        dayTrades.sort((a, b) => new Date(a.closeTime).getTime() - new Date(b.closeTime).getTime());
        let cum = 0;
        let peak = -Infinity;
        dayTrades.forEach(tr => {
          cum += tr.result;
          if (cum > peak) peak = cum;
        });
        if (peak !== -Infinity) dailyPeaks.push(peak);
      });

      const averagePeak = dailyPeaks.length > 0 ? dailyPeaks.reduce((s, v) => s + v, 0) / dailyPeaks.length : undefined;

      return {
        range,
        ...metrics,
        averagePeak,
        days: Object.keys(byDay).length,
      } as RangePerformanceExtended;
    });
  };

  const analyzeHourlyPerformance = (allTrades: Trade[], period: string): HourlyPerformance[] => {
    const filteredTrades = filterTradesByPeriod(allTrades, period);
    const hourlyTrades: { [key: number]: Trade[] } = {};

    filteredTrades.forEach(trade => {
      const tradeHour = new Date(trade.openTime).getHours();
      if (!hourlyTrades[tradeHour]) {
        hourlyTrades[tradeHour] = [];
      }
      hourlyTrades[tradeHour].push(trade);
    });

    return Object.entries(hourlyTrades).map(([hour, tradesInHour]) => ({
      hour: parseInt(hour),
      ...calculatePerformanceMetrics(tradesInHour),
    })).sort((a, b) => a.hour - b.hour);
  };

  const analyzeBestScenarioByDayOfWeek = (allTrades: Trade[], period: string): BestScenarioByDay[] => {
    const filteredTrades = filterTradesByPeriod(allTrades, period);
    const tradesByDay: { [key: string]: Trade[] } = {};

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    filteredTrades.forEach(trade => {
      const dayIndex = new Date(trade.openTime).getDay();
      const dayName = daysOfWeek[dayIndex];
      if (!tradesByDay[dayName]) {
        tradesByDay[dayName] = [];
      }
      tradesByDay[dayName].push(trade);
    });

    return Object.entries(tradesByDay).map(([dayOfWeek, tradesForDay]) => {
      const hourlyPerformance = analyzeHourlyPerformance(tradesForDay, 'all'); // Analyze hourly for the day's trades
      const financialValuePerformance = analyzeFinancialValuePerformance(tradesForDay, 'all'); // Analyze financial value for the day's trades

      // Determine best hours
      // Use composite score: averageResult * normalizedWinRate * sqrt(sampleSize)
      const minTradesPerHour = 3;
      const bestHours = hourlyPerformance
        .filter(h => h.totalTrades >= minTradesPerHour && h.averageResult > 0) // require minimal sample size
        .map(h => ({
          hour: h.hour,
          averageResult: h.averageResult,
          winRate: h.winRate,
          totalTrades: h.totalTrades,
          score: h.averageResult * (h.winRate / 100) * Math.sqrt(h.totalTrades || 1),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(h => ({ hour: h.hour, averageResult: h.averageResult, winRate: h.winRate, totalTrades: h.totalTrades }));

      // Determine recommended point range
      const recommendedPointRange = getRecommendedPointRange(tradesForDay);

      // Determine best financial value range
      const bestFinancialValueRange = (financialValuePerformance as RangePerformanceExtended[])
        .filter(r => r.totalTrades > 0 && (r.averagePeak !== undefined ? r.averagePeak > 0 : r.averageResult > 0))
        .sort((a, b) => {
          const aMetric = (a as RangePerformanceExtended).averagePeak !== undefined ? (a as RangePerformanceExtended).averagePeak! : a.averageResult;
          const bMetric = (b as RangePerformanceExtended).averagePeak !== undefined ? (b as RangePerformanceExtended).averagePeak! : b.averageResult;
          return bMetric - aMetric;
        })[0] || { range: 'N/A', averageResult: 0, winRate: 0, averagePeak: undefined, days: 0 };

      // Determine optimal max loss tolerance
      const optimalMaxLossTolerance = getOptimalMaxLossTolerance(tradesForDay);

      return {
        dayOfWeek,
        scenario: {
          bestHours,
          recommendedPointRange,
          bestFinancialValueRange,
          optimalMaxLossTolerance,
        },
      };
    }).sort((a, b) => daysOfWeek.indexOf(a.dayOfWeek) - daysOfWeek.indexOf(b.dayOfWeek)); // Sort by day of week
  };

  return {
    filterTradesByPeriod,
    analyzeFinancialValuePerformance,
    analyzeHourlyPerformance,
    analyzeBestScenarioByDayOfWeek,
  };
};
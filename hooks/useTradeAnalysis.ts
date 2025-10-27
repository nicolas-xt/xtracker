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

// New Interfaces for Best Scenario
interface BestScenarioDetail {
  bestHours: { hour: number; averageResult: number; winRate: number }[];
  recommendedPointRange: { range: string; averageResult: number; winRate: number };
  bestFinancialValueRange: { range: string; averageResult: number; winRate: number };
  optimalMaxLossTolerance: number; // Renamed and refined
}

interface BestScenarioByDay {
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

const getRecommendedPointRange = (trades: Trade[]): { range: string; averageResult: number; winRate: number } => {
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

  let bestRange: { range: string; averageResult: number; winRate: number } = { range: 'N/A', averageResult: 0, winRate: 0 };
  let maxScore = -Infinity;

  Object.entries(pointRanges).forEach(([range, tradesInRage]) => {
    const metrics = calculatePerformanceMetrics(tradesInRage);
    // Prioritize profitability and win rate
    const score = metrics.averageResult * metrics.winRate; // Simple scoring, can be refined

    if (score > maxScore) {
      maxScore = score;
      bestRange = { range, ...metrics };
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

  let overallOptimalDailyLossTolerance = 0;
  let maxOverallImprovement = 0;

  Object.values(dailyTradesMap).forEach(dayTrades => {
    // Sort trades by close time to simulate chronological trading
    dayTrades.sort((a, b) => new Date(a.closeTime).getTime() - new Date(b.closeTime).getTime());

    const initialDailyResult = dayTrades.reduce((sum, trade) => sum + trade.result, 0);

    // Generate potential daily loss tolerances from the day's cumulative losses
    const potentialTolerances: number[] = [];
    let runningResult = 0;
    dayTrades.forEach(trade => {
      runningResult += trade.result;
      if (runningResult < 0 && !potentialTolerances.includes(runningResult)) {
        potentialTolerances.push(runningResult);
      }
    });

    // If no losses or day was profitable, no tolerance needed for this day
    if (potentialTolerances.length === 0 && initialDailyResult >= 0) return;

    // Add 0 as a potential tolerance to represent not stopping at all (if day ends positive)
    if (initialDailyResult >= 0) {
      potentialTolerances.push(0);
    }

    // Iterate through each potential daily loss tolerance
    potentialTolerances.forEach(tolerance => {
      let simulatedFinalResult = 0;
      let currentCumulativeResult = 0;
      let stoppedForDay = false;

      for (const trade of dayTrades) {
        if (!stoppedForDay) {
          currentCumulativeResult += trade.result;
          if (currentCumulativeResult < tolerance) {
            // If cumulative loss exceeds tolerance, stop trading for the day
            simulatedFinalResult = tolerance; // Cap the loss at the tolerance
            stoppedForDay = true;
          } else {
            simulatedFinalResult = currentCumulativeResult;
          }
        }
      }

      // Calculate improvement only if the day was initially negative or if stopping improved a positive day
      const improvement = simulatedFinalResult - initialDailyResult;

      // We are looking for the tolerance that maximizes the improvement (or minimizes the loss)
      if (improvement > maxOverallImprovement) {
        maxOverallImprovement = improvement;
        overallOptimalDailyLossTolerance = Math.abs(tolerance);
      }
    });
  });

  return overallOptimalDailyLossTolerance;
};

export const useTradeAnalysis = (trades: Trade[]) => {

  const filterTradesByPeriod = (allTrades: Trade[], period: string): Trade[] => {
    if (period === 'all') {
      return allTrades;
    }
    const startDate = getPeriodStartDate(period);
    return allTrades.filter(trade => new Date(trade.openTime) >= startDate);
  };

  const analyzeFinancialValuePerformance = (allTrades: Trade[], period: string): RangePerformance[] => {
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

    return Object.entries(valueRanges).map(([range, tradesInRage]) => ({
      range,
      ...calculatePerformanceMetrics(tradesInRage),
    }));
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
      const bestHours = hourlyPerformance
        .filter(h => h.totalTrades > 0 && h.averageResult > 0) // Only consider profitable hours
        .sort((a, b) => b.averageResult - a.averageResult) // Sort by average result
        .slice(0, 3) // Take top 3 best hours
        .map(h => ({ hour: h.hour, averageResult: h.averageResult, winRate: h.winRate }));

      // Determine recommended point range
      const recommendedPointRange = getRecommendedPointRange(tradesForDay);

      // Determine best financial value range
      const bestFinancialValueRange = financialValuePerformance
        .filter(r => r.totalTrades > 0 && r.averageResult > 0)
        .sort((a, b) => b.averageResult - a.averageResult)[0] || { range: 'N/A', averageResult: 0, winRate: 0 };

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
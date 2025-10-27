export interface RawTrade {
  Ativo: string;
  Abertura: string;
  Fechamento: string;
  'Tempo Operacao': string;
  'Qtd Compra': string;
  'Qtd Venda': string;
  Lado: string;
  'Preo Compra': string;
  'Preo Venda': string;
  'Res. Operao': string;
}

export interface Trade {
  id: string; // hash of the trade
  asset: string;
  openTime: string;
  closeTime: string;
  duration: string;
  quantity: number;
  side: string;
  openPrice: number;
  closePrice: number;
  result: number;
  contracts: number;
  brokerage: number;
  b3Fees: number;
  setup?: string;
  sentiment?: string;
}

export interface DashboardStats {
  grossResult: number;
  fees: number;
  brokerage: number;
  b3Fees: number;
  irrf: number;
  netResult: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  payoff: number;
  avgWin: number;
  avgLoss: number;
}

export interface ResultBy<T> {
  key: T;
  result: number;
  trades: number;
  winRate: number;
}

export interface DetailedStats extends DashboardStats {
  profitFactor: number;
  mathExpectation: number;
  maxWin: number;
  maxLoss: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  avgProfitPerTrade: number;
  initialCapital: number;
  finalCapital: number;
  resultsByAsset: ResultBy<string>[];
  resultsByType: ResultBy<'Compra' | 'Venda'>[];
  resultsByDayOfWeek: ResultBy<string>[];
  dailyPerformance: ResultBy<string>[];
  avgWinDuration: number;
  avgLossDuration: number;
  bestTrades: Trade[];
  worstTrades: Trade[];
  positiveDays: number;
  negativeDays: number;

  // Advanced Behavioral Stats
  resultAfter1Loss: number;
  resultAfter2Losses: number;
  overtradingSessionFrequency: number;
  totalProfitDevolution: number;
  profitDevolutionSessionFrequency: number;
  profitDevolutionOccurrences: number;

  // New properties for behavioral analysis
  occurrences: { date: string; losses: number; amountLost: number; }[];
  simulationSavings: number;
  frequencyTrend: { month: string; frequency: number; }[];

  // New properties for euphoria detector
  euphoriaOccurrences: { date: string; peakProfit: number; amountDevolved: number; }[];
  devolutionTrend: { month: string; amount: number; }[];

  previousPeriodStats: DetailedStats | null;
  performanceByHour: { hour: number; totalResult: number; totalTrades: number; winRate: number; }[];
  entryExitPatterns: { avgDuration: number; stdDevDuration: number; };
  sentimentCorrelation: { sentiment: string; avgResult: number; totalTrades: number; }[];
  strategyAssertiveness: { strategy: string; totalResult: number; totalTrades: number; winRate: number; }[];
  payoffByStrategy: { strategy: string; avgPayoff: number; }[];
  payoffBySentiment: { sentiment: string; avgPayoff: number; }[];
  winLossStreaks: { maxWins: number; maxLosses: number; performanceAfterLossStreak: number; performanceAfterWinStreak: number; };

  // Tax and Fee Calculations
  totalContracts: number;
  taxaBMf: number;
  irrf: number;
  finalResult: number;
  avgScoreOnWinDays: number;
}

import { Tick } from './Tick';

export type IntervalType =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w'
  | '1M';

export interface SimulationTrade {
  entryPrice: number;
  entryTime: string;
  exitPrice: number;
  exitTime: string;
  holdingPeriod: number;
  profit: number;
}

export interface SimulationAnalysis {
  averageLosingTrade: number;
  averageProfitPerTrade: number;
  averageWinningTrade: number;
  barCount: number;
  expectedValue: number;
  expectency: number;
  finalCapital: number;
  growth: number;
  maxDrawdown: number;
  maxDrawdownPct: number;
  maxRiskPct: number;
  numLosingTrades: number;
  numWinningTrades: number;
  percentProfitable: number;
  profit: number;
  profitPct: number;
  proportionProfitable: number;
  returnOnAccount: number;
  rmultipleStdDev: number;
  startingCapital: number;
  totalTrades: number;
}

export type TransactionDirection = 'buy' | 'sell';

export interface Simulation {
  analysis: SimulationAnalysis;
  history: Tick[];
  id: string;
  interval: IntervalType;
  name: string;
  opportunities: {
    [key in TransactionDirection]: boolean;
  };
  trades: SimulationTrade[];
}

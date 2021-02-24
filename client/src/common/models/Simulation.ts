import { Tick } from './Tick';

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
  name: string;
  opportunities: {
    [key in TransactionDirection]: boolean;
  };
  trades: SimulationTrade[];
}

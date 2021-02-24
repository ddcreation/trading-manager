import { IntervalType } from './CryptoApiParams';
import { CryptoHistory } from './CryptoHistory';

export interface SimulationTrade {
  entryPrice: number;
  entryTime: Date;
  exitPrice: number;
  exitTime: Date;
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

export interface Simulation {
  analysis: SimulationAnalysis;
  history: CryptoHistory[];
  id: string;
  interval: IntervalType;
  name: string;
  opportunities: {
    [key in 'buy' | 'sell']: boolean;
  };
  trades: SimulationTrade[];
}

import { IStrategy } from 'grademark';
import { IntervalType } from './CryptoApiParams';
import { CryptoHistory } from './CryptoHistory';

export interface IBar {
  time: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Strategy extends IStrategy {
  id: string;
  interval: IntervalType;
  name: string;
  parameters?: any;
  checkBuyOpportunity: (args: any) => boolean;
  checkSellOpportunity: (args: any) => boolean;
  entryRule: (enterPosition: any, args: any) => void;
  exitRule: (exitPosition: any, args: any) => void;
  getHistory$: (symbol: string) => Promise<CryptoHistory[]>;
  historicToDataframe: (history: CryptoHistory[]) => any;
  stopLoss?: (args: any) => number;
}

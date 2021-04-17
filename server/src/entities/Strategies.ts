import { IStrategy } from 'grademark';
import { IntervalType } from './CryptoApiParams';
import { SymbolHistory } from './SymbolHistory';

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
  getHistory$: (symbol: string) => Promise<SymbolHistory[]>;
  historicToDataframe: (history: SymbolHistory[]) => any;
  stopLoss?: (args: any) => number;
}

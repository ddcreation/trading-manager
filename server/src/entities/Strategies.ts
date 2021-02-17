import { CryptoHistory } from './CryptoHistory';

export interface IBar {
  time: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Strategy {
  id: string;
  name: string;
  parameters?: any;
  checkBuyOpportunity: (args: any) => boolean;
  checkSellOpportunity: (args: any) => boolean;
  entryRule: (enterPosition: any, args: any) => void;
  exitRule: (exitPosition: any, args: any) => void;
  historicToDataframe: (history: CryptoHistory[]) => any;
  stopLoss?: (args: any) => number;
}

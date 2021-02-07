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
  historicToDataframe: (history: CryptoHistory[]) => any;
  entryRule: (enterPosition: any, args: any) => void;
  exitRule: (exitPosition: any, args: any) => void;
  stopLoss?: (args: any) => number;
}

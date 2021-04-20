import { TradingConnector } from '@shared/TradingConnector';
import { IStrategy } from 'grademark';
import { IntervalType } from './CryptoApiParams';
import { AssetHistory } from './AssetHistory';

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
  connector: TradingConnector;

  checkBuyOpportunity: (args: any) => boolean;
  checkSellOpportunity: (args: any) => boolean;
  entryRule: (enterPosition: any, args: any) => void;
  exitRule: (exitPosition: any, args: any) => void;
  getHistory$: (asset: string) => Promise<AssetHistory[]>;
  historicToDataframe: (history: AssetHistory[]) => any;
  stopLoss?: (args: any) => number;
}

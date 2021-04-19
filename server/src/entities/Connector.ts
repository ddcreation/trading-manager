import { HistoryParams, IntervalType } from './CryptoApiParams';
import { SymbolHistory } from './SymbolHistory';
import { DbEntity } from './DbEntity';

export interface UserConnectorConfig extends DbEntity {
  user_id: string;
  connector_id: string;
  enabled: boolean;
  [prop: string]: unknown;
}

export interface ConnectorConfig {
  id: string;
  name: string;
  properties: {
    [propName: string]: { label: string; type: string };
  };
  class: string;
}

export interface Connector {
  config: ConnectorConfig;

  account$: () => Promise<any>;
  exchangeInfo$: () => Promise<any>;
  symbolHistory$: (
    symbol: string,
    interval: IntervalType,
    requestParams: HistoryParams
  ) => Promise<SymbolHistory[]>;
  symbolPrices$: () => Promise<unknown>;
}

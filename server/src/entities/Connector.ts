import { HistoryParams, IntervalType } from './CryptoApiParams';
import { AssetHistory } from './AssetHistory';
import { DbEntity } from './DbEntity';
import { Order } from './Order';

export interface UserConnectorConfig extends DbEntity {
  user_id: string;
  connector_id: string;
  enabled: boolean;
  favoritesAssets?: string[];
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
  assetHistory$: (
    asset: string,
    interval: IntervalType,
    requestParams: HistoryParams
  ) => Promise<AssetHistory[]>;
  assetPrice$: (asset: string) => Promise<number>;
  assetPrices$: () => Promise<{ [asset: string]: number }>;
  exchangeInfo$: () => Promise<any>;
  listAssets$: () => Promise<string[]>;
  placeOrder$: (params: Order) => Promise<unknown>;
}

export interface ConnectorError {
  code: string;
  message: string;
}

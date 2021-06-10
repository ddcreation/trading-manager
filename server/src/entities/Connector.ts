import { HistoryParams, IntervalType } from './CryptoApiParams';
import { AssetHistory } from './AssetHistory';
import { DbEntity } from './DbEntity';
import { Order } from './Order';
import { ExchangeInfoResponse } from './ExchangeInfoResponse';

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
  limits?: {
    history?: number;
  };
}

export interface Connector {
  config: ConnectorConfig;

  account$: () => Promise<any>;
  assetHistory$: (
    asset: string,
    interval: IntervalType,
    requestParams?: HistoryParams
  ) => Promise<AssetHistory[]>;
  assetPrice$: (asset: string) => Promise<number>;
  assetPrices$: () => Promise<{ [asset: string]: number }>;
  exchangeInfo$: (asset?: string[]) => Promise<ExchangeInfoResponse>;
  listAssets$: () => Promise<string[]>;
  placeOrder$: (params: Order) => Promise<unknown>;
}

export interface ConnectorError {
  errorCode: string;
  errorMessage: string;
}

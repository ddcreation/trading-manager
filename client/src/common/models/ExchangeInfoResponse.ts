export interface ExchangeInfoResponse {
  exchangeFilters: any[];
  rateLimits: RateLimit[];
  serverTime: number;
  assets: Asset[];
  timezone: string;
}

export interface RateLimit {}

export interface Asset {
  baseAsset: string;
  baseAssetPrecision: number;
  filters: any[];
  icebergAllowed: boolean;
  isMarginTradingAllowed: boolean;
  isSpotTradingAllowed: boolean;
  ocoAllowed: boolean;
  orderTypes: string[];
  permissions: string[];
  quoteAsset: string;
  quoteAssetPrecision: number;
  quotePrecision: number;
  status: string;
  asset: string;
}

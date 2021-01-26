export interface ExchangeInfoResponse {
  exchangeFilters: any[];
  rateLimits: RateLimit[];
  serverTime: number;
  symbols: Symbol[];
  timezone: string;
}

export interface RateLimit {}

export interface Symbol {
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
  symbol: string;
}

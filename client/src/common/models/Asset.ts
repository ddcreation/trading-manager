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
  symbol: string;
}

export interface AssetPrice {
  name: string;
  price: number;
}

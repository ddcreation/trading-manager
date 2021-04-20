import { Asset } from './Asset';

export interface ExchangeInfoResponse {
  exchangeFilters: any[];
  rateLimits: RateLimit[];
  serverTime: number;
  assets: Asset[];
  timezone: string;
}

export interface RateLimit {}

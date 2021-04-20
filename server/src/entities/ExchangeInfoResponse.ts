import { Asset } from './Asset';

export interface ExchangeInfoResponse {
  exchangeFilters: any[];
  rateLimits: RateLimit[];
  serverTime: number;
  symbols: Asset[];
  timezone: string;
}

export interface RateLimit {}

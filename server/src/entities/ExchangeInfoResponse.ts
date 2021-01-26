import { Symbol } from './Symbol';

export interface ExchangeInfoResponse {
  exchangeFilters: any[];
  rateLimits: RateLimit[];
  serverTime: number;
  symbols: Symbol[];
  timezone: string;
}

export interface RateLimit {}

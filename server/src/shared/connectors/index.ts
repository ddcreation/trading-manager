import { BinanceConfig } from './BinanceConnector';
import { BinanceFuturesConfig } from './BinanceFuturesConnector';

export const connectors = [BinanceConfig, BinanceFuturesConfig];

export * from './BinanceConnector';
export * from './BinanceFuturesConnector';

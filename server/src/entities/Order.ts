import { DbEntity } from './DbEntity';

export const OrderSide = {
  buy: 'BUY' as const,
  sell: 'SELL' as const,
};

export type OrderSide = keyof typeof OrderSide;

export const OrderStatus = {
  CLOSE: 'CLOSE' as const,
  OPEN: 'OPEN' as const,
  PENDING: 'PENDING' as const,
};

export type OrderStatus = keyof typeof OrderStatus;

export const OrderSource = {
  MANUAL: 'MANUAL' as const,
  STATEGY: 'STRATEGY' as const,
};

export type OrderSource = keyof typeof OrderSource;

export const OrderType = {
  DIRECT: 'DIRECT' as const,
  POSITION: 'POSITION' as const,
};

export type OrderType = keyof typeof OrderType;

export interface OrderParameters {
  amount: number;
  symbol: string;
  direction: OrderSide;
  source: OrderSource;
  stopLoss?: number;
  takeProfit?: number;
}

export interface Order extends DbEntity {
  user_id: string;
  connector_id: string;
  asset: string;
  status: OrderStatus;
  amount: number;
  direction: OrderSide;
  source: OrderSource;
  type: OrderType;
  created_at: string;
  closed_at?: string;
  transaction_id?: string;
}

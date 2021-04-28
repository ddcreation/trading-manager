export const OrderSide = {
  buy: 'BUY' as const,
  sell: 'SELL' as const,
};

export type OrderSideType = keyof typeof OrderSide;

export interface OrderParameters {
  price: number;
  symbol: string;
  side: OrderSideType;
  stopLoss?: number;
  takeProfit?: number;
}

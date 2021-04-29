export const OrderDirection = {
  BUY: 'BUY' as const,
  SELL: 'SELL' as const,
};

export type OrderDirectionType = keyof typeof OrderDirection;

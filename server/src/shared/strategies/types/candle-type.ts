export const CandleColor = {
  green: 'green' as const,
  red: 'red' as const,
};

export type CandleColor = keyof typeof CandleColor;

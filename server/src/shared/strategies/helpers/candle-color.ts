import { SymbolHistory } from '@entities/SymbolHistory';
import { CandleColor } from '../types';

export const candleColor = (history: SymbolHistory): CandleColor => {
  return history.close > history.open ? CandleColor.green : CandleColor.red;
};

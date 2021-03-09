import { CryptoHistory } from '@entities/CryptoHistory';
import { CandleColor } from '../types';

export const candleColor = (history: CryptoHistory): CandleColor => {
  return history.close > history.open ? CandleColor.green : CandleColor.red;
};

import { AssetHistory } from '@entities/AssetHistory';
import { CandleColor } from '../types';

export const candleColor = (history: AssetHistory): CandleColor => {
  return history.close > history.open ? CandleColor.green : CandleColor.red;
};

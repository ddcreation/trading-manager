import { AssetHistory } from '@entities/AssetHistory';
import { candleColor } from '../helpers';
import { CandleColor } from '../types';
import { chainedCandles } from './chained-candles';

export const bullishFlagRecognition = (
  history: AssetHistory[],
  currentIndex: number,
  minPullbackLength: number = 3
): boolean => {
  return (
    chainedCandles(history, currentIndex - 1, minPullbackLength) ===
      CandleColor.red &&
    candleColor(history[currentIndex]) === CandleColor.green
  );
};

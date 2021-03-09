import { CryptoHistory } from '@entities/CryptoHistory';
import { candleColor } from '../helpers';
import { CandleColor } from '../types';

export const chainedCandles = (
  history: CryptoHistory[],
  currentIndex: number,
  minChainLength: number
): CandleColor | false => {
  const startIndex = currentIndex - minChainLength + 1;
  if (startIndex < 0) {
    return false;
  }

  let iterateIndex = currentIndex - 1;
  let chain: CandleColor | false = candleColor(history[currentIndex]);
  while (iterateIndex >= startIndex) {
    if (candleColor(history[iterateIndex]) !== chain) {
      chain = false;
      break;
    }
    iterateIndex--;
  }

  return chain;
};

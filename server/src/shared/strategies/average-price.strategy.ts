import * as dataForge from 'data-forge';
import { CryptoHistory } from '@entities/CryptoHistory';
import { Strategy } from '@entities/Strategies';

/**
 * Stretegy AvgPrice
 * @description Simple strategy that sell if the price is higher than the Avg and buy if lower
 */
export const AvgPriceStrategy: Strategy = {
  id: 'avg-price',
  name: 'Average price',

  // Buy when price is below average.
  entryRule: (enterPosition: any, args: any): void => {
    if (args.bar.close < args.bar.avgMonth * 0.95) {
      enterPosition({ direction: 'long' }); // Long is default, pass in "short" to short sell.
    }
  },

  // Sell when price is above average.
  exitRule: (exitPosition: any, args: any): void => {
    if (args.bar.close > args.bar.avgMonth * 1.05) {
      exitPosition();
    }
  },

  historicToDataframe: (historic: CryptoHistory[]): any => {
    const formatedHistoric = historic.map((history) => {
      return {
        close: history.close,
        date: new Date(history.closeTime).toISOString(),
        high: history.high,
        low: history.low,
        open: history.open,
        volume: history.volume,
      };
    });
    let dataFrame = new dataForge.DataFrame(formatedHistoric)
      .tail(30)
      .setIndex('date')
      .renameSeries({ date: 'time' });

    // Add average:
    const serie = dataFrame.deflate((bar) => bar.close);
    const movingAverage = serie.average();
    dataFrame = dataFrame.select((row) => {
      return {
        ...row,
        avgMonth: movingAverage,
      };
    });

    return dataFrame;
  },

  stopLoss: (args) => {
    // Optional intrabar stop loss.
    return args.entryPrice * 0.1; // Stop out on 10% loss from entry price.
  },
};

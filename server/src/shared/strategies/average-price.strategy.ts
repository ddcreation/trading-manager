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
    if (args.bar.close < args.bar.intervalAvg * 0.95) {
      enterPosition({ direction: 'long' }); // Long is default, pass in "short" to short sell.
    }
  },

  // Sell when price is above average.
  exitRule: (exitPosition: any, args: any): void => {
    if (args.bar.close > args.bar.intervalAvg * 1.05) {
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
      .setIndex('date')
      .renameSeries({ date: 'time' });

    // Add average:
    const avgDays = 30; // Price avg on last 30 days
    const dataFramewithAvg = dataFrame.generateSeries({
      intervalAvg: (row, rowIndex) => {
        const startIdx = avgDays < rowIndex ? rowIndex - avgDays : 0;

        return dataFrame
          .between(startIdx, rowIndex)
          .deflate((bar) => bar.close)
          .average();
      },
    });

    return dataFramewithAvg;
  },

  // Stop out on 10% loss from entry price.
  stopLoss: (args) => {
    return args.entryPrice * 0.1; // Stop out on 10% loss from entry price.
  },
};

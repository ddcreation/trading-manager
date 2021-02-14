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
  parameters: { startDate: null },

  // Buy when price is below average.
  entryRule: (enterPosition: any, args: any): void => {
    const blankDays = 30;
    const startAnalyzeDate = new Date(args.parameters.startDate);
    const blankAnalyzingPeriod = startAnalyzeDate.setDate(
      startAnalyzeDate.getDate() + blankDays
    );

    if (blankAnalyzingPeriod > new Date(args.bar.time).getTime()) {
      return;
    }

    if (args.bar.close < args.bar.intervalAvg * 0.95) {
      enterPosition({ direction: 'long' }); // Long is default, pass in "short" to short sell.
    }
  },

  // Sell when 5% bonus or too long
  exitRule: (exitPosition: any, args: any): void => {
    const maxDuration = 10;
    const entryTime = new Date(args.position.entryTime).getTime();
    const currentTime = new Date(args.bar.time).getTime();

    if (
      args.bar.close > args.entryPrice * 1.05 ||
      (currentTime - entryTime) / (1000 * 3600 * 24) > maxDuration
    ) {
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

    const dataFrame = new dataForge.DataFrame(formatedHistoric)
      .setIndex('date')
      .renameSeries({ date: 'time' });

    // Add average price:
    const avgDays = 10;
    const rows = dataFrame.toPairs() as any[];

    const dataFramewithAvg = dataFrame.generateSeries({
      intervalAvg: (row, rowIndex) => {
        const startIdx = avgDays < rowIndex ? rowIndex - avgDays : 0;

        return dataFrame
          .between(rows[startIdx][0], rows[rowIndex][0])
          .deflate((bar) => bar.close)
          .average();
      },
    });

    // Set first date:
    AvgPriceStrategy.parameters.startDate = formatedHistoric[0].date;

    return dataFramewithAvg;
  },

  // Stop out on 10% loss from entry price.
  stopLoss: (args) => {
    return args.entryPrice * 0.2; // Stop out on 20% loss from entry price.
  },
};

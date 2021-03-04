import * as dataForge from 'data-forge';
import { CryptoHistory } from '@entities/CryptoHistory';
import { Strategy } from '@entities/Strategies';
import {
  EnterPositionFn,
  ExitPositionFn,
  TradeDirection,
} from 'grademark/build/lib/strategy';
import CryptoProviderApi from '@shared/CryptoProviderApi';
import { IntervalType } from '@entities/CryptoApiParams';

/**
 * Strategy AvgPrice
 * @description Simple strategy that sell if the price is higher than the Avg and buy if lower
 */
class AvgPriceStrategy implements Strategy {
  public id = 'avg-price';
  public interval = IntervalType['1d'];
  public name = 'Average price';
  public parameters = { startDate: '' };
  private _averageDays = 10;

  // Buy when price is below average.
  public checkBuyOpportunity(args: any): boolean {
    return args.bar.close < args.bar.intervalAvg * 0.95;
  }

  public checkSellOpportunity(args: any): boolean {
    return false;
  }

  public entryRule(enterPosition: EnterPositionFn, args: any): void {
    const startAnalyzeDate = new Date(args.parameters.startDate);
    const blankAnalyzingPeriod = startAnalyzeDate.setDate(
      startAnalyzeDate.getDate() + this._averageDays
    );

    if (
      blankAnalyzingPeriod < new Date(args.bar.time).getTime() &&
      this.checkBuyOpportunity!(args)
    ) {
      enterPosition({ direction: TradeDirection.Long }); // Long is default, pass in "short" to short sell.
    }
  }

  // Sell when 5% bonus or too long
  public exitRule(exitPosition: ExitPositionFn, args: any): void {
    const maxDuration = 10;
    const entryTime = new Date(args.position.entryTime).getTime();
    const currentTime = new Date(args.bar.time).getTime();

    if (
      args.bar.close > args.entryPrice * 1.05 ||
      (currentTime - entryTime) / (1000 * 3600 * 24) > maxDuration
    ) {
      exitPosition();
    }
  }

  public getHistory$(symbol: string): Promise<CryptoHistory[]> {
    return CryptoProviderApi.symbolHistory$(symbol, this.interval, {
      limit: 300,
    });
  }

  public historicToDataframe(historic: CryptoHistory[]): any {
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
    const rows = dataFrame.toPairs() as any[];

    const dataFramewithAvg = dataFrame.generateSeries({
      intervalAvg: (row, rowIndex) => {
        const startIdx =
          this._averageDays < rowIndex ? rowIndex - this._averageDays : 0;

        return dataFrame
          .between(rows[startIdx][0], rows[rowIndex][0])
          .deflate((bar) => bar.close)
          .average();
      },
    });

    // Set first date:
    this.parameters.startDate = formatedHistoric[0].date;

    return dataFramewithAvg;
  }

  // Stop out on 10% loss from entry price.
  public stopLoss(args: any): number {
    return args.entryPrice * 0.2; // Stop out on 20% loss from entry price.
  }
}

export default new AvgPriceStrategy();

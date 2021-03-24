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
 * Strategy LastDayFall
 * @description Simple strategy that buy if the price is higher than last day
 */
class LastDayFallStrategy implements Strategy {
  public id = 'last-day-fall';
  public interval = IntervalType['1h'];
  public name = 'Last day fall';
  public parameters = { percentGap: 0.02 };

  // Buy when price is below average.
  public checkBuyOpportunity(args: any): boolean {
    return (
      args.bar.lastday !== null &&
      args.bar.close < args.bar.lastday * (1 - this.parameters.percentGap)
    );
  }

  public checkSellOpportunity(args: any): boolean {
    return false;
  }

  public entryRule(enterPosition: EnterPositionFn, args: any): void {
    if (this.checkBuyOpportunity(args)) {
      enterPosition({ direction: TradeDirection.Long });
    }
  }

  // Sell when came back to price
  public exitRule(exitPosition: ExitPositionFn, args: any): void {
    if (args.bar.close > args.entryPrice * (1 + this.parameters.percentGap)) {
      exitPosition();
    }
  }

  public getHistory$(symbol: string): Promise<CryptoHistory[]> {
    return CryptoProviderApi.symbolHistory$(symbol, this.interval, {
      limit: 5000,
    });
  }

  public historicToDataframe(historic: CryptoHistory[]): any {
    const formatedHistoric = historic.map((history, index) => {
      const lastDayIndex = index - 24;

      return {
        close: history.close,
        date: new Date(history.closeTime).toISOString(),
        high: history.high,
        low: history.low,
        open: history.open,
        volume: history.volume,
        lastday: lastDayIndex >= 0 ? historic[lastDayIndex].close : null,
      };
    });

    const dataFrame = new dataForge.DataFrame(formatedHistoric)
      .setIndex('date')
      .renameSeries({ date: 'time' });

    return dataFrame;
  }

  // Stop out on 30% loss from entry price.
  public stopLoss(args: any): number {
    return args.entryPrice * 0.01;
  }
}

export default new LastDayFallStrategy();
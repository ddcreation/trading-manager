import * as dataForge from 'data-forge';
import { CryptoHistory } from '@entities/CryptoHistory';
import { Strategy } from '@entities/Strategies';
import {
  EnterPositionFn,
  ExitPositionFn,
  TradeDirection,
} from 'grademark/build/lib/strategy';

/**
 * Strategy Momentum day
 * @description Strategy based on make high profit when the price rises (inspired by https://www.warriortrading.com/momentum-day-trading-strategy/)
 */
export class MomentumDayStrategy implements Strategy {
  public id = 'momentum-day';
  public name = 'Momentum day';

  public checkBuyOpportunity(args: any): boolean {
    return true;
  }

  public checkSellOpportunity(args: any): boolean {
    return false;
  }

  public entryRule(enterPosition: EnterPositionFn, args: any): void {
    if (true) {
      enterPosition({ direction: TradeDirection.Long });
    }
  }

  // Sell when 5% bonus or too long
  public exitRule(exitPosition: ExitPositionFn, args: any): void {
    if (args.bar.close > args.entryPrice * 1.05) {
      exitPosition();
    }
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

    return dataFrame;
  }

  // Stop out on lost.
  public stopLoss(): number {
    return 0.5;
  }
}

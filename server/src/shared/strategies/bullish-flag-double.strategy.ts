import * as dataForge from 'data-forge';
import { SymbolHistory } from '@entities/SymbolHistory';
import { Strategy } from '@entities/Strategies';
import {
  EnterPositionFn,
  ExitPositionFn,
  TradeDirection,
} from 'grademark/build/lib/strategy';
import TradingConnector from '@shared/TradingConnector';
import { IntervalType } from '@entities/CryptoApiParams';
import { bullishFlagRecognition, chainedCandles } from './pattern-recognition';

/**
 * Strategy bullish flag double
 * @description Strategy based on make high profit when the price rises (inspired by https://www.warriortrading.com/momentum-day-trading-strategy/)
 */
class BullishFlagDoubleStrategy implements Strategy {
  public id = 'bullish-flag-double';
  public interval = IntervalType['1m'];
  public name = 'Bullish flag double';

  public checkBuyOpportunity(args: any): boolean {
    return args.bar.flags.bullish;
  }

  public checkSellOpportunity(args: any): boolean {
    return false;
  }

  public entryRule(enterPosition: EnterPositionFn, args: any): void {
    if (this.checkBuyOpportunity(args)) {
      enterPosition({ direction: TradeDirection.Long });
    }
  }

  public exitRule(exitPosition: ExitPositionFn, args: any): void {
    if (args.bar.close > args.bar.stoploss * 2) {
      exitPosition();
    }
  }

  public getHistory$(symbol: string): Promise<SymbolHistory[]> {
    return TradingConnector.symbolHistory$(symbol, this.interval, {
      limit: 1000,
    });
  }

  public historicToDataframe(historic: SymbolHistory[]): any {
    const formatedHistoric = historic.map((history, index) => {
      return {
        close: history.close,
        date: new Date(history.closeTime).toISOString(),
        high: history.high,
        low: history.low,
        open: history.open,
        volume: history.volume,
        flags: { bullish: bullishFlagRecognition(historic, index, 5) },
        stoploss: historic[index].open - historic[index - 1]?.low || 0,
      };
    });

    const dataFrame = new dataForge.DataFrame(formatedHistoric)
      .setIndex('date')
      .renameSeries({ date: 'time' });

    return dataFrame;
  }

  // Stop out on lost.
  public stopLoss(args: any): number {
    return args.bar.stoploss;
  }
}

export default new BullishFlagDoubleStrategy();

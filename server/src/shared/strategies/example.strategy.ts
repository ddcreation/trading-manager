import * as dataForge from 'data-forge';
import { AssetHistory } from '@entities/AssetHistory';
import { Strategy } from '@entities/Strategies';
import {
  EnterPositionFn,
  ExitPositionFn,
  TradeDirection,
} from 'grademark/build/lib/strategy';
import { TradingConnector } from '@shared/TradingConnector';
import { IntervalType } from '@entities/CryptoApiParams';
const talib = require('talib/build/Release/talib');

/**
 * Example strategy
 * @description Strategy example
 */
export class ExampleStrategy implements Strategy {
  public id = 'example';
  public interval = IntervalType['1d'];
  public name = 'Example';
  public connector: TradingConnector;

  constructor(connector: TradingConnector) {
    this.connector = connector;
  }

  // Rule to define if we should BUY
  public checkBuyOpportunity(args: any): boolean {
    return true;
  }

  // Rule to define if we should SELL
  public checkSellOpportunity(args: any): boolean {
    return false;
  }

  // Rules to open a position (BUY or SELL position)
  public entryRule(enterPosition: EnterPositionFn, args: any): void {
    if (this.checkBuyOpportunity(args)) {
      enterPosition({ direction: TradeDirection.Long }); // Open buy position
    } else if (this.checkSellOpportunity(args)) {
      enterPosition({ direction: TradeDirection.Short }); // Open sell position
    }
  }

  // Close transaction when price is 5% upper than the enter price
  public exitRule(exitPosition: ExitPositionFn, args: any): void {
    if (args.bar.close > args.entryPrice * 1.05) {
      exitPosition();
    }
  }

  // Retrieve crypto history from external API
  public getHistory$(asset: string): Promise<AssetHistory[]> {
    return this.connector.assetHistory$(asset, this.interval, {
      limit: 1000,
    });
  }

  // Convert a crypto history to dataframe for grademark framework simulations
  public historicToDataframe(historic: AssetHistory[]): any {
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

  // Stop out on 10% loss from entry price.
  public stopLoss(args: any): number {
    return args.entryPrice * 0.1;
  }
}

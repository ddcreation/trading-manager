import { CryptoHistory } from '@entities/CryptoHistory';
import { strategies } from './strategies';
import { backtest, analyze } from 'grademark';
import {
  Simulation,
  SimulationAnalysis,
  SimulationTrade,
} from '@entities/Simulation';
import { Strategy } from '@entities/Strategies';

export class Simulator {
  public simulate$(params: {
    symbol: string;
    capital?: number;
    leverage?: number;
  }): Promise<Simulation[]> {
    const leverage = params?.leverage ? params.leverage : 1;
    const startingCapital = params?.capital ? params.capital : 20;

    const simulations: Simulation[] = [];
    return new Promise((resolve, reject) => {
      strategies.forEach((strategy: Strategy, index: number) => {
        strategy.getHistory$(params.symbol).then((datas) => {
          const dataFrame = strategy.historicToDataframe(datas);

          // Backtest each strategy
          const trades = backtest(strategy, dataFrame as any, {});
          const analysis = analyze(startingCapital * leverage, trades);

          const lastBar = dataFrame.tail(1).toArray()[0];
          const lastDatasArgs = {
            bar: lastBar,
            lookback: dataFrame,
            parameters: strategy.parameters,
          };

          simulations.push({
            analysis: analysis as SimulationAnalysis,
            history: datas,
            id: strategy.id,
            interval: strategy.interval,
            name: strategy.name,
            opportunities: {
              buy: strategy.checkBuyOpportunity(lastDatasArgs),
              sell: strategy.checkSellOpportunity(lastDatasArgs),
            },
            trades: trades as SimulationTrade[],
          });

          if (index === strategies.length - 1) {
            resolve(simulations);
          }
        });
      });

      return simulations;
    });
  }
}

import { CryptoHistory } from '@entities/CryptoHistory';
import { strategies } from './strategies';
import { backtest, analyze } from 'grademark';
import {
  Simulation,
  SimulationAnalysis,
  SimulationTrade,
} from '@entities/Simulation';
import { Strategy } from '@entities/Strategies';

interface SimulateParams {
  symbol: string;
  capital?: number;
  leverage?: number;
}

export class Simulator {
  public simulateAllStrategies$(params: SimulateParams): Promise<Simulation[]> {
    return Promise.all(
      strategies.map((strategy) => this.getStrategySimulation(params, strategy))
    );
  }

  public simulateStrategy$(
    strategyId: string,
    params: SimulateParams
  ): Promise<Simulation> | null {
    const strategy = strategies.find((strategy) => strategy.id === strategyId);

    return strategy ? this.getStrategySimulation(params, strategy) : null;
  }

  public async getStrategySimulation(
    params: SimulateParams,
    strategy: Strategy
  ): Promise<Simulation> {
    const leverage = params?.leverage ? params.leverage : 1;
    const startingCapital = params?.capital ? params.capital : 20;

    const datas = await strategy.getHistory$(params.symbol);
    const dataFrame = strategy.historicToDataframe(datas);

    const trades = backtest(strategy, dataFrame as any, {});
    const analysis = analyze(startingCapital * leverage, trades);

    const lastBar = dataFrame.tail(1).toArray()[0];
    const lastDatasArgs = {
      bar: lastBar,
      lookback: dataFrame,
      parameters: strategy.parameters,
    };

    return {
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
    };
  }
}

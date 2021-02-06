import { CryptoHistory } from '@entities/CryptoHistory';
import { strategies } from './strategies';
import { backtest, analyze } from 'grademark';

export class Simulator {
  private _datas: CryptoHistory[];

  constructor(history: CryptoHistory[]) {
    this._datas = history;
  }

  public simulate(params?: { capital: number; leverage: number }): unknown[] {
    const leverage = params?.leverage ? params.leverage : 5;
    const startingCapital = params?.capital ? params.capital : 20;

    const simulations = strategies.map((strategy) => {
      const datas = strategy.historicToDataframe(this._datas);

      // Backtest each strategy
      const trades = backtest(strategy, datas as any);
      const analysis = analyze(startingCapital * leverage, trades);

      return { id: strategy.id, name: strategy.name, analysis, trades };
    });

    return simulations;
  }
}

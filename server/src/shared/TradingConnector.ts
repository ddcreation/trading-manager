import { ConnectorAccount } from '@entities/ConnectorAccount';
import { SymbolHistory } from '@entities/SymbolHistory';
import {
  CryptoFilterType,
  IntervalType,
  HistoryParams,
} from '@entities/CryptoApiParams';
import { BinanceConnector } from './connectors/BinanceConnector';
import { Symbol } from '@entities/Symbol';
import { ExchangeInfoResponse } from '@entities/ExchangeInfoResponse';

// TODO: set this list in user preferences
const defaultFavoritesCrypto = ['ETHUSDT', 'BCHUSDT', 'BTCUSDT', 'LTCUSDT'];

export class TradingConnector {
  public defaultHistoryParams: HistoryParams = {
    limit: 100,
  };

  private _account: ConnectorAccount | undefined;
  private _provider: any;

  constructor() {
    this._provider = new BinanceConnector();
  }

  public exchangeInfo$(
    cryptoFilter: CryptoFilterType = CryptoFilterType.all
  ): Promise<ExchangeInfoResponse> {
    if (cryptoFilter === CryptoFilterType.favorites) {
      return new Promise((resolve, reject) => {
        Promise.all([this.getAccount$(), this._provider.exchangeInfo$()]).then(
          ([account, exchangeInfos]) => {
            const filteredSymbols = exchangeInfos.symbols
              .filter((symbol: Symbol) =>
                account.favoritesSymbols.includes(symbol.symbol)
              )
              .sort(
                (symbolA: Symbol, symbolB: Symbol) =>
                  account.favoritesSymbols.indexOf(symbolA.symbol) -
                  account.favoritesSymbols.indexOf(symbolB.symbol)
              );

            resolve({ ...exchangeInfos, symbols: filteredSymbols });
          },
          (err) => reject(err)
        );
      });
    }

    return this._provider.exchangeInfo$();
  }

  public getAccount$(): Promise<ConnectorAccount> {
    return new Promise<ConnectorAccount>((resolve, reject) => {
      if (this._account) {
        resolve(this._account);
      }

      this._provider.account$().then(
        (providerAccount: unknown) => {
          resolve({
            favoritesSymbols: defaultFavoritesCrypto,
            connectorDatas: providerAccount as any,
          });
        },
        (error: unknown) => reject(error)
      );
    }).then((account) => {
      this._account = account;
      return this._account;
    });
  }

  public symbolHistory$(
    symbol: string,
    interval: IntervalType = IntervalType['5m'],
    params?: HistoryParams
  ): Promise<SymbolHistory[]> {
    const requestParams: HistoryParams = {
      ...this.defaultHistoryParams,
      ...params,
    };

    return this._provider.symbolHistory$(symbol, interval, requestParams);
  }

  public symbolPrices$(): Promise<unknown> {
    return this._provider.symbolPrices$();
  }
}

export default new TradingConnector();

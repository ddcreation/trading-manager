import { ConnectorAccount } from '@entities/ConnectorAccount';
import { CryptoHistory } from '@entities/CryptoHistory';
import {
  CryptoFilterType,
  IntervalType,
  HistoryParams,
} from '@entities/CryptoApiParams';
import binance from './connectors/binance';
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
    this._provider = binance;
  }

  public exchangeInfo$(
    cryptoFilter: CryptoFilterType = CryptoFilterType.all
  ): Promise<ExchangeInfoResponse> {
    if (cryptoFilter === CryptoFilterType.favorites) {
      return new Promise((resolve, reject) => {
        Promise.all([this.getAccount$(), this._provider.exchangeInfo()]).then(
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

    return this._provider.exchangeInfo();
  }

  public getAccount$(): Promise<ConnectorAccount> {
    return new Promise<ConnectorAccount>((resolve, reject) => {
      if (this._account) {
        resolve(this._account);
      }

      this._provider.account().then(
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
  ): Promise<CryptoHistory[]> {
    const requestParams: HistoryParams = {
      ...this.defaultHistoryParams,
      ...params,
    };

    return new Promise((resolve, reject) => {
      this._provider.candlesticks(
        symbol,
        interval,
        (error: unknown, ticks: Array<string[]>, symbol: string) => {
          if (error) {
            reject(error);
          }

          const formatedTicks = this._formatTicksResponse(ticks);
          resolve(formatedTicks);
        },
        requestParams
      );
    });
  }

  public symbolPrices$(): Promise<unknown> {
    return this._provider.prices();
  }

  private _formatTicksResponse(ticks: Array<string[]>): CryptoHistory[] {
    return ticks.map((tick) => {
      const [
        time,
        open,
        high,
        low,
        close,
        volume,
        closeTime,
        assetVolume,
        trades,
        buyBaseVolume,
        buyAssetVolume,
        ignored,
      ] = tick.map((value) => parseFloat(value));
      return {
        assetVolume,
        buyAssetVolume,
        buyBaseVolume,
        close,
        closeTime,
        high,
        ignored,
        low,
        open,
        time,
        trades,
        volume,
      };
    });
  }
}

export default new TradingConnector();

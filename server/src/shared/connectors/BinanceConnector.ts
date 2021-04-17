import { Connector, ConnectorConfig } from '@entities/Connector';
import { HistoryParams, IntervalType } from '@entities/CryptoApiParams';
import { SymbolHistory } from '@entities/SymbolHistory';

const Binance = require('node-binance-api');

export const BinanceConfig: ConnectorConfig = {
  id: 'Binance',
  properties: {
    APIKEY: {
      label: 'API key',
      type: 'string',
    },
    APISECRET: {
      label: 'API secret',
      type: 'password',
    },
    test: {
      label: 'Test api',
      type: 'boolean',
    },
  },
  class: 'BinanceConnector',
};

export class BinanceConnector implements Connector {
  public config;

  private _binanceApi: any;

  constructor(connectorConfigValues: any) {
    this.config = BinanceConfig;

    this._binanceApi = new Binance().options(connectorConfigValues);
  }

  public account$() {
    return this._binanceApi.account();
  }

  public exchangeInfo$() {
    return this._binanceApi.exchangeInfo();
  }

  public async symbolHistory$(
    symbol: string,
    interval: IntervalType = IntervalType['5m'],
    requestParams: HistoryParams
  ): Promise<SymbolHistory[]> {
    return new Promise((resolve, reject) => {
      this._binanceApi.candlesticks(
        symbol,
        interval,
        (error: unknown, ticks: Array<string[]>, symbol: string) => {
          console.log('CandleStick', error, symbol);
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
    return this._binanceApi.prices();
  }

  private _formatTicksResponse(ticks: Array<string[]>): SymbolHistory[] {
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

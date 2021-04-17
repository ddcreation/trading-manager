import { Connector } from '@entities/Connector';
import { HistoryParams, IntervalType } from '@entities/CryptoApiParams';
import { SymbolHistory } from '@entities/SymbolHistory';

const Binance = require('node-binance-api');

export class BinanceConnector implements Connector {
  public id;
  public properties: any;

  private _binanceApi: any;

  constructor() {
    this.id = 'Binance';
    this.properties = {
      APIKEY: {
        label: 'API key',
        type: 'string',
        value: process.env.BINANCE_API_KEY,
      },
      APISECRET: {
        label: 'API secret',
        type: 'password',
        value: process.env.BINANCE_API_SECRET,
      },
      test: {
        label: 'Test api',
        type: 'boolean',
        value: process.env.BINANCE_API_TEST,
      },
    };

    this._binanceApi = new Binance().options({
      APIKEY: this.properties.APIKEY.value,
      APISECRET: this.properties.APISECRET.value,
      test: this.properties.test.value,
    });
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

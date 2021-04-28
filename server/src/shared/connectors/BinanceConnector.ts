import {
  Connector,
  ConnectorConfig,
  UserConnectorConfig,
} from '@entities/Connector';
import { HistoryParams, IntervalType } from '@entities/CryptoApiParams';
import { AssetHistory } from '@entities/AssetHistory';
import { Asset } from '@entities/Asset';
import { OrderParameters } from '@entities/Order';

const Binance = require('node-binance-api');

export const BinanceConfig: ConnectorConfig = {
  id: 'binance',
  name: 'Binance',
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

  constructor(connectorConfigValues: UserConnectorConfig) {
    this.config = BinanceConfig;

    this._binanceApi = new Binance().options({
      APIKEY: connectorConfigValues.APIKEY,
      APISECRET: connectorConfigValues.APISECRET,
      test: connectorConfigValues.test,
    });
  }

  public account$() {
    return this._binanceApi.account();
  }

  public exchangeInfo$() {
    return this._binanceApi.exchangeInfo();
  }

  public listAssets$(): Promise<string[]> {
    return this.exchangeInfo$().then((exchangeInfo: { symbols: Asset[] }) => {
      return exchangeInfo.symbols.map((asset) => asset.symbol);
    });
  }

  public async assetHistory$(
    asset: string,
    interval: IntervalType = IntervalType['5m'],
    requestParams: HistoryParams
  ): Promise<AssetHistory[]> {
    return new Promise((resolve, reject) => {
      this._binanceApi.candlesticks(
        asset,
        interval,
        (error: unknown, ticks: Array<string[]>, asset: string) => {
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

  public assetPrices$(): Promise<unknown> {
    return this._binanceApi.prices();
  }

  public placeOrder$(params: OrderParameters): Promise<unknown> {
    return new Promise((resolve, reject) => resolve(''));
  }

  private _formatTicksResponse(ticks: Array<string[]>): AssetHistory[] {
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

import {
  Connector,
  ConnectorConfig,
  ConnectorError,
  UserConnectorConfig,
} from '@entities/Connector';
import { HistoryParams, IntervalType } from '@entities/CryptoApiParams';
import { AssetHistory } from '@entities/AssetHistory';
import { Asset } from '@entities/Asset';
import { Order, OrderSide, OrderType } from '@entities/Order';
import { ExchangeInfoResponse } from '@entities/ExchangeInfoResponse';

const Binance = require('node-binance-api');

interface BinanceFuturesError {
  body: string;
}

export const BinanceFuturesConfig: ConnectorConfig = {
  id: 'binance-futures',
  name: 'Binance futures',
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
  class: 'BinanceFuturesConnector',
};

export class BinanceFuturesConnector implements Connector {
  public config;

  private _binanceFutureApi: any;

  constructor(connectorConfigValues: UserConnectorConfig) {
    this.config = BinanceFuturesConfig;

    this._binanceFutureApi = new Binance().options({
      APIKEY: connectorConfigValues.APIKEY,
      APISECRET: connectorConfigValues.APISECRET,
      test: connectorConfigValues.test,
    });
  }

  public account$() {
    return this._binanceFutureApi.futuresAccount().catch(this._errorHandler);
  }

  public exchangeInfo$(assetsFilter?: string[]) {
    return this._binanceFutureApi
      .futuresExchangeInfo()
      .then((exchangeInfos: ExchangeInfoResponse) => {
        return {
          ...exchangeInfos,
          symbols: exchangeInfos.symbols.filter(
            (symbol) =>
              !assetsFilter ||
              !assetsFilter.length ||
              assetsFilter.includes(symbol.symbol)
          ),
        };
      })
      .catch(this._errorHandler);
  }

  public listAssets$(): Promise<string[]> {
    return this.exchangeInfo$()
      .then((exchangeInfo: { symbols: Asset[] }) => {
        return exchangeInfo.symbols.map((asset) => asset.symbol);
      })
      .catch(this._errorHandler);
  }

  public async assetHistory$(
    asset: string,
    interval: IntervalType = IntervalType['5m'],
    requestParams: HistoryParams
  ): Promise<AssetHistory[]> {
    return this._binanceFutureApi
      .futuresCandles(asset, interval, requestParams)
      .then((ticks: any) => {
        return this._formatTicksResponse(ticks);
      });
  }

  public assetPrice$(asset: string): Promise<number> {
    return this._binanceFutureApi
      .futuresPrices(asset)
      .then((prices: { [asset: string]: number }) => prices[asset])
      .catch(this._errorHandler);
  }

  public assetPrices$(): Promise<{ [asset: string]: number }> {
    return this._binanceFutureApi.futuresPrices().catch(this._errorHandler);
  }

  public placeOrder$(params: Order): Promise<unknown> {
    let promise;

    if (params.type === OrderType.MARKET) {
      promise = this._binanceFutureApi[
        params.direction === OrderSide.BUY
          ? 'futuresMarketBuy'
          : 'futuresMarketSell'
      ](params.asset, params.quantity);
    } else if (params.type === OrderType.LIMIT) {
      promise = this._binanceFutureApi[
        params.direction === OrderSide.BUY ? 'futuresBuy' : 'futuresSell'
      ](params.asset, params.quantity, params.price);
    }

    return promise.catch((error: BinanceFuturesError) =>
      this._errorHandler(error)
    );
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

  private _errorHandler(binanceError: BinanceFuturesError): {
    error: ConnectorError;
  } {
    const error = JSON.parse(binanceError.body);

    const connectorError = {
      code: `${this.config.id.toUpperCase()}${error.code}`,
      message: `${this.config.id.toUpperCase()} API ERROR: ${error.msg}`,
    };

    throw connectorError;
  }
}

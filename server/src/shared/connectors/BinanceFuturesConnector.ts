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

interface BinanceFuturesApiError {
  body: string;
}

interface BinanceFuturesError {
  code: number;
  msg: string;
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
  limits: {
    history: 1500,
  },
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
    requestParams?: HistoryParams
  ): Promise<AssetHistory[]> {
    if (requestParams?.limit) {
      requestParams.limit =
        this.config.limits?.history &&
        this.config.limits.history < requestParams.limit
          ? this.config.limits.history
          : requestParams.limit;
    }

    return this._binanceFutureApi
      .futuresCandles(asset, interval, requestParams)
      .then((ticks: any) => {
        return this._formatTicksResponse(ticks);
      });
  }

  public assetPrice$(asset: string): Promise<number> {
    return this._binanceFutureApi
      .futuresPrices()
      .then((prices: { [asset: string]: number }) => prices[asset])
      .catch(this._errorHandler);
  }

  public assetPrices$(): Promise<{ [asset: string]: number }> {
    return this._binanceFutureApi.futuresPrices().catch(this._errorHandler);
  }

  public async placeOrder$(params: Order): Promise<unknown> {
    const orders = [];

    const defaultOptions = {
      newClientOrderId: `${params._id}`,
    };

    // - market order
    orders.push(
      this._binanceFutureApi.futuresOrder(params.direction, params.asset, params.quantity, false, {...defaultOptions, type: OrderType.MARKET})
    );

    const limitOptions = { type: OrderType.LIMIT };
    const limitOrderDirection = params.direction === OrderSide.BUY ? OrderSide.SELL : OrderSide.BUY;
    // - stoploss order
    if (params.stopLoss) {
      orders.push(
        this._binanceFutureApi.futuresOrder(limitOrderDirection, params.asset, params.quantity, params.stopLoss, {...defaultOptions, ...limitOptions, newClientOrderId: `${defaultOptions.newClientOrderId}-sl`})
      );
    }
    // - take profit order
    if (params.takeProfit) {
      orders.push(
        this._binanceFutureApi.futuresOrder(limitOrderDirection, params.asset, params.quantity, params.takeProfit, {...defaultOptions, ...limitOptions, newClientOrderId: `${defaultOptions.newClientOrderId}-tp`})
      );
    }

    return Promise.all(orders.map((orderPromise) => this._orderPromiseHandler(orderPromise))).catch((error: BinanceFuturesError) => this._errorHandler(error));
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

  private _errorHandler(binanceError: BinanceFuturesError): void {
    const connectorError: ConnectorError = {
      errorCode: `${this.config.id.toUpperCase()}${binanceError.code}`,
      errorMessage: binanceError.msg,
    };

    throw connectorError;
  }

  private _orderPromiseHandler(promise: Promise<any>): Promise<unknown> {
    return new Promise<unknown>((resolve, reject) => {
      promise.then((orderResponse) => {
        console.log(orderResponse);
        if(orderResponse.code < 0) {
          reject(orderResponse)
        } 
        resolve(orderResponse);
      }).catch((error: BinanceFuturesApiError) => reject(JSON.parse(error.body)))
    });
  }
}

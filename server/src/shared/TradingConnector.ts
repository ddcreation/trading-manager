import { ConnectorAccount } from '@entities/ConnectorAccount';
import { AssetHistory } from '@entities/AssetHistory';
import { IntervalType, HistoryParams } from '@entities/CryptoApiParams';
import { BinanceConnector } from './connectors/BinanceConnector';
import { ExchangeInfoResponse } from '@entities/ExchangeInfoResponse';
import { UserConnectorConfigDao } from '@daos/UserConnectorConfig/UserConnectorConfigDao';
import { Connector, UserConnectorConfig } from '@entities/Connector';
import {
  Order,
  OrderParameters,
  OrderStatus,
  OrderType,
} from '@entities/Order';
import { OrderDao } from '@daos/Order/Order';
import { BinanceFuturesConnector } from './connectors';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '@entities/Api';

const orderDao = new OrderDao();

export class TradingConnector {
  public defaultHistoryParams: HistoryParams = {
    limit: 100,
  };

  private _account: ConnectorAccount | undefined;
  private _config: UserConnectorConfig;
  private _provider!: Connector;

  constructor(connectorConfig: UserConnectorConfig) {
    this._config = connectorConfig;
    switch (this._config.connector_id) {
      case 'binance': {
        this._provider = new BinanceConnector(this._config);

        break;
      }
      case 'binance-futures': {
        this._provider = new BinanceFuturesConnector(this._config);

        break;
      }
    }
  }

  public async listAssets$(): Promise<string[]> {
    return await this._provider.listAssets$();
  }

  public async exchangeInfo$(assets?: string[]): Promise<ExchangeInfoResponse> {
    return this._provider.exchangeInfo$(assets);
  }

  public async getAccount$(): Promise<ConnectorAccount> {
    return new Promise<ConnectorAccount>((resolve, reject) => {
      if (this._account) {
        resolve(this._account);
      }

      this._provider.account$().then(
        (providerAccount: any) => {
          resolve({
            connectorDatas: providerAccount,
          });
        },
        (error: unknown) => reject(error)
      );
    }).then((account) => {
      this._account = account;
      return this._account;
    });
  }

  public async assetHistory$(
    asset: string,
    interval: IntervalType = IntervalType['5m'],
    params?: HistoryParams
  ): Promise<AssetHistory[]> {
    const requestParams: HistoryParams = {
      ...this.defaultHistoryParams,
      ...params,
    };

    return this._provider.assetHistory$(asset, interval, requestParams);
  }

  public async assetPrices$(): Promise<unknown> {
    return this._provider.assetPrices$();
  }

  public async placeOrder$(params: OrderParameters): Promise<unknown> {
    console.log('Place order', params);

    // - Determine quantity for the amount
    const { price, quantity } = await this.calculatePriceAndQuantityForOrder$(
      params.symbol,
      params.amount
    );

    const order: Order = {
      user_id: this._config.user_id,
      connector_id: this._config.connector_id,
      asset: params.symbol,
      status: OrderStatus.PENDING,
      amount: +params.amount,
      price,
      quantity,
      source: params.source,
      ...params.stopLoss ? {stopLoss: this.calculateLimitPrice({price, quantity, limit: params.stopLoss, direction: -1}) } : {},
      ...params.takeProfit ? {takeProfit: this.calculateLimitPrice({price, quantity, limit: params.takeProfit, direction: 1}) } : {},
      direction: params.direction,
      createdAt: new Date().toISOString(),
    };

    // Save order pending in DB
    const dbOrder = await orderDao.add$(order);

    console.log('DB order', dbOrder);

    // - Buy asset
    try {
      const placedOrders = await this._provider.placeOrder$(dbOrder);
      console.log(placedOrders);

      // - Update DB order (status, transactionID for cancel...)
    } catch (error) {
      // Delete uncomplete order
      await orderDao.delete$({ _id: dbOrder._id });

      throw error;
    }

    return dbOrder;
  }

  public calculateLimitPrice(limitParams: {price: number, quantity: number, limit: number, direction: 1 | -1}): number {
    const {price, quantity, limit, direction} = limitParams;

    const total = price * quantity;
    return direction > 0 ? Math.floor((total + limit) / quantity * 100) / 100 : Math.ceil((total - limit) / quantity * 100) / 100;
  }

  public async calculatePriceAndQuantityForOrder$(
    asset: string,
    amount: number
  ): Promise<{ price: number; quantity: number }> {
    const currentPrice = await this._provider.assetPrice$(asset);
    const calculatedPriceAndQuantity = {
      price: currentPrice,
      quantity: amount / currentPrice,
    };

    const exchangeInfos = await this._provider
      .exchangeInfo$([asset])
      .then((exchangeInfos) => exchangeInfos.symbols[0]);

    const lotSize = exchangeInfos.filters.find(
      (filter) => filter.filterType === 'LOT_SIZE'
    );
    if (lotSize) {
      calculatedPriceAndQuantity.quantity =
        Math.floor(calculatedPriceAndQuantity.quantity / lotSize.stepSize) *
        lotSize.stepSize;

      if (calculatedPriceAndQuantity.quantity <= 0) {
        throw new ApiError({
          code: 'ORDER-MIN-AMOUNT',
          message: `The minimum amount for this asset is ${
            Math.ceil(currentPrice * lotSize.stepSize * 100) / 100
          }`,
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }
    } else {
      const precision = Math.pow(10, +exchangeInfos.quotePrecision);

      calculatedPriceAndQuantity.quantity =
        Math.floor(calculatedPriceAndQuantity.quantity * precision) / precision;
    }

    return calculatedPriceAndQuantity;
  }
}

export const initConnector = async (connectorId: string, userId: string) => {
  const configDao = new UserConnectorConfigDao();
  const config = await configDao.getConfigForUser$(connectorId, userId);

  return new TradingConnector(config);
};

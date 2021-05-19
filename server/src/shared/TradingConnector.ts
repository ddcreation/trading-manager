import { ConnectorAccount } from '@entities/ConnectorAccount';
import { AssetHistory } from '@entities/AssetHistory';
import {
  IntervalType,
  HistoryParams,
  CryptoFilterType,
} from '@entities/CryptoApiParams';
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
import { ObjectId } from 'bson';

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
    }
  }

  public async listAssets$(): Promise<string[]> {
    return await this._provider.listAssets$();
  }

  public async exchangeInfo$(
    assetFilter: CryptoFilterType | string = CryptoFilterType.all
  ): Promise<ExchangeInfoResponse> {
    const infos: ExchangeInfoResponse = await this._provider.exchangeInfo$();

    return {
      ...infos,
      symbols: infos.symbols.filter(
        (asset) =>
          asset.symbol === assetFilter ||
          assetFilter === CryptoFilterType.all ||
          (assetFilter === CryptoFilterType.favorites &&
            this._config.favoritesAssets?.includes(asset.symbol))
      ),
    };
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
      type: OrderType.MARKET,
      status: OrderStatus.PENDING,
      amount: +params.amount,
      price,
      quantity,
      source: params.source,
      direction: params.direction,
      created_at: new Date().toISOString(),
    };

    // Save order pending in DB
    const dbOrder = await orderDao.add$(order);

    console.log('DB order', dbOrder);

    // - Buy asset
    try {
      const placedOrder = await this._provider.placeOrder$(dbOrder);
      console.log(placedOrder);

      // - place stoploss order
      if (params.stopLoss) {
        // - Determine the matching price for the quantity regarding the stoploss value
        // - place stoploss limit order
      }
      // - place take profit order
      if (params.takeProfit) {
        // - Determine the matching price for the quantity regarding the profit value
        // - place take profit limit order
      }
      // - Update DB order (status, transactionID for cancel...)
    } catch (error) {
      // Delete uncomplete order
      await orderDao.delete$({ _id: dbOrder._id });

      throw error;
    }

    return dbOrder;
  }

  public async calculatePriceAndQuantityForOrder$(
    asset: string,
    amount: number
  ): Promise<{ price: number; quantity: number }> {
    const currentPrice = await this._provider.assetPrice$(asset);

    return { price: currentPrice, quantity: amount / currentPrice };
  }
}

export const initConnector = async (connectorId: string, userId: string) => {
  const configDao = new UserConnectorConfigDao();
  const config = await configDao.getConfigForUser$(connectorId, userId);

  return new TradingConnector(config);
};

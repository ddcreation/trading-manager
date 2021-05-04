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
import { UserConnectorConfig } from '@entities/Connector';
import { OrderParameters, OrderStatus, OrderType } from '@entities/Order';
import { OrderDao } from '@daos/Order/Order';

const orderDao = new OrderDao();

export class TradingConnector {
  public defaultHistoryParams: HistoryParams = {
    limit: 100,
  };

  private _account: ConnectorAccount | undefined;
  private _config: UserConnectorConfig;
  private _provider: any;

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

  public exchangeInfo$(
    assetFilter: CryptoFilterType = CryptoFilterType.all
  ): Promise<ExchangeInfoResponse> {
    return this._provider
      .exchangeInfo$()
      .then((infos: ExchangeInfoResponse) => {
        return {
          ...infos,
          symbols: infos.symbols.filter(
            (asset) =>
              assetFilter === CryptoFilterType.all ||
              (assetFilter === CryptoFilterType.favorites &&
                this._config.favoritesAssets?.includes(asset.symbol))
          ),
        };
      });
  }

  public getAccount$(): Promise<ConnectorAccount> {
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

  public assetHistory$(
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

  public assetPrices$(): Promise<unknown> {
    return this._provider.assetPrices$();
  }

  public async placeOrder$(params: OrderParameters): Promise<unknown> {
    console.log('Place order', params);
    // - Save order pending in DB
    const order = await orderDao.add$({
      user_id: this._config.user_id,
      connector_id: this._config.connector_id,
      asset: params.symbol,
      type: OrderType.DIRECT,
      status: OrderStatus.PENDING,
      amount: +params.amount,
      source: params.source,
      direction: params.direction,
      created_at: new Date().toISOString(),
    });

    console.log('DB order', order);

    // TODO:
    // - Buy asset
    if (params.stopLoss) {
      // - place stoploss order
    }

    if (params.takeProfit) {
      // - place take profit order
    }
    // - Update DB order (status, transactionID for cancel...)

    return this._provider.placeOrder$(params);
  }
}

export const initConnector = async (connectorId: string, userId: string) => {
  const configDao = new UserConnectorConfigDao();
  const config = await configDao.getConfigForUser$(connectorId, userId);

  return new TradingConnector(config);
};

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
import { OrderParameters } from '@entities/Order';

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

  public placeOrder$(params: OrderParameters): Promise<unknown> {
    console.log('Place order', params);
    // TODO:
    // - Save order pending in DB
    // - Get order ID
    // - Buy asset
    // - place stoploss order if set in params
    // - place take profit order if set in params
    // - Update DB order (status, transactionID for cancel...)

    return this._provider.placeOrder$(params);
  }
}

export const initConnector = async (connectorId: string, userId: string) => {
  const configDao = new UserConnectorConfigDao();
  const config = await configDao.getConfigForUser$(connectorId, userId);

  return new TradingConnector(config);
};

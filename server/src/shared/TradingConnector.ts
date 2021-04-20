import { ConnectorAccount } from '@entities/ConnectorAccount';
import { AssetHistory } from '@entities/AssetHistory';
import {
  CryptoFilterType,
  IntervalType,
  HistoryParams,
} from '@entities/CryptoApiParams';
import { BinanceConnector } from './connectors/BinanceConnector';
import { Asset } from '@entities/Asset';
import { ExchangeInfoResponse } from '@entities/ExchangeInfoResponse';
import { UserConnectorConfigDao } from '@daos/UserConnectorConfig/UserConnectorConfigDao';
import { UserConnectorConfig } from '@entities/Connector';

// TODO: set this list in user preferences
const defaultFavoritesCrypto = ['ETHUSDT', 'BCHUSDT', 'BTCUSDT', 'LTCUSDT'];

export class TradingConnector {
  public defaultHistoryParams: HistoryParams = {
    limit: 100,
  };

  private _account: ConnectorAccount | undefined;
  private _provider: any;

  constructor(connectorConfig: UserConnectorConfig) {
    switch (connectorConfig.connector_id) {
      case 'binance': {
        this._provider = new BinanceConnector(connectorConfig);

        break;
      }
    }
  }

  public async listAssets$(): Promise<string[]> {
    return await this._provider.listAssets$();
  }

  public exchangeInfo$(
    cryptoFilter: CryptoFilterType = CryptoFilterType.all
  ): Promise<ExchangeInfoResponse> {
    if (cryptoFilter === CryptoFilterType.favorites) {
      return new Promise((resolve, reject) => {
        Promise.all([this.getAccount$(), this._provider.exchangeInfo$()]).then(
          ([account, exchangeInfos]) => {
            const filteredAssets = exchangeInfos.symbols
              .filter((asset: Asset) =>
                account.favoritesAssets.includes(asset.symbol)
              )
              .sort(
                (assetA: Asset, assetB: Asset) =>
                  account.favoritesAssets.indexOf(assetA.symbol) -
                  account.favoritesAssets.indexOf(assetB.symbol)
              );

            resolve({ ...exchangeInfos, assets: filteredAssets });
          },
          (err) => reject(err)
        );
      });
    }

    return this._provider.exchangeInfo$();
  }

  public getAccount$(): Promise<ConnectorAccount> {
    return new Promise<ConnectorAccount>((resolve, reject) => {
      if (this._account) {
        resolve(this._account);
      }

      this._provider.account$().then(
        (providerAccount: unknown) => {
          resolve({
            favoritesAssets: defaultFavoritesCrypto,
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
}

export const initConnector = async (connectorId: string, userId: string) => {
  const configDao = new UserConnectorConfigDao();
  const config = (await configDao.getConfigForUser$(
    connectorId,
    userId
  )) as any;

  return new TradingConnector(config);
};

import { Account, ExchangeInfoResponse, Tick } from '../common/models';
import {
  ConnectorConfig,
  ConnectorUserConfig,
} from '../common/models/Connector';
import { ApiService } from './api.service';

export class ConnectorsService {
  private _api: ApiService;

  constructor() {
    this._api = new ApiService();
  }

  public getAccount$(connectorId: string): Promise<Account> {
    return this._api.get<Account>(`/connectors/${connectorId}/account`);
  }

  public getConfig$(connectorId: string): Promise<ConnectorUserConfig> {
    return this._api.get(`/connectors/${connectorId}/user-connector-config`, {
      validateStatus: (status: number) => status === 200 || status === 404,
    });
  }

  public getExchangeInfos$(connectorId: string): Promise<ExchangeInfoResponse> {
    return this._api.get<ExchangeInfoResponse>(
      `/connectors/${connectorId}/exchange-info`
    );
  }

  public getFavorites$(connectorId: string): Promise<string[]> {
    return this._api.get<string[]>(`/connectors/${connectorId}/favorites`);
  }

  public getPrices$(connectorId: string): Promise<{ [key: string]: string }> {
    return this._api.get<{ [key: string]: string }>(
      `/connectors/${connectorId}/prices`
    );
  }

  public getAssetHistory$(connectorId: string, asset: string): Promise<Tick[]> {
    return this._api.get<Tick[]>(`/connectors/${connectorId}/${asset}/history`);
  }

  public getAssetSimulations$(
    connectorId: string,
    asset: string
  ): Promise<{ simulations: any[] }> {
    return this._api.get<{ simulations: any[] }>(
      `/connectors/${connectorId}/${asset}/simulations`
    );
  }

  public listConnectors$(): Promise<ConnectorConfig[]> {
    return this._api.get<ConnectorConfig[]>('/connectors');
  }

  public listActiveConnectors$(): Promise<ConnectorConfig[]> {
    return new Promise((resolve, reject) => {
      this.listConnectors$().then((connectors) => {
        resolve(connectors.filter((connector) => connector.config?.enabled));
      });
    });
  }

  public listConnectorAssets$(connectorId: string): Promise<string[]> {
    return this._api.get<string[]>(`/connectors/${connectorId}/assets`);
  }

  public placeOrder$(connectorId: string, orderRequest: unknown) {
    return this._api.post(`/connectors/${connectorId}/order`, orderRequest);
  }

  public saveConfig$(connectorId: string, config: unknown): Promise<void> {
    return this._api.put(
      `/connectors/${connectorId}/user-connector-config`,
      config
    );
  }
}

export const connectorsService = new ConnectorsService();

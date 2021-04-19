import { Account, ExchangeInfoResponse, Tick } from '../common/models';
import { ConnectorConfig } from '../common/models/Connector';
import { ApiService } from './api.service';

export class ConnectorsService {
  private _api: ApiService;

  constructor() {
    this._api = new ApiService();
  }

  public getAccount$(connectorId: string): Promise<Account> {
    return this._api.get<Account>(`/connectors/${connectorId}/account`);
  }

  public getConfig$(
    connectorId: string
  ): Promise<{ [k: string]: string | boolean }> {
    return this._api.get(`/connectors/${connectorId}/user-connector-config`);
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

  public getSymbolHistory$(
    connectorId: string,
    symbol: string
  ): Promise<Tick[]> {
    return this._api.get<Tick[]>(
      `/connectors/${connectorId}/${symbol}/history`
    );
  }

  public getSymbolSimulations$(
    connectorId: string,
    symbol: string
  ): Promise<{ simulations: any[] }> {
    return this._api.get<{ simulations: any[] }>(
      `/connectors/${connectorId}/${symbol}/simulations`
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

  public saveConfig$(connectorId: string, config: unknown): Promise<void> {
    return this._api.put(
      `/connectors/${connectorId}/user-connector-config`,
      config
    );
  }
}

export const connectorsService = new ConnectorsService();

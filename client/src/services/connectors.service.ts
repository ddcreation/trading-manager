import { Account, ExchangeInfoResponse, Tick } from '../common/models';
import { ConnectorConfig } from '../common/models/Connector';
import { ApiService } from './api.service';

export class ConnectorsService {
  private _api: ApiService;

  constructor() {
    this._api = new ApiService();
  }

  public getAccount$(): Promise<Account> {
    return this._api.get<Account>('/connectors/account');
  }

  public getConfig$(
    connectorId: string
  ): Promise<{ [k: string]: string | boolean }> {
    return this._api.get(`/connectors/${connectorId}/user-connector-config`);
  }

  public getExchangeInfos$(): Promise<ExchangeInfoResponse> {
    return this._api.get<ExchangeInfoResponse>('/connectors/exchange-info');
  }

  public getFavorites$(): Promise<string[]> {
    return this._api.get<string[]>('/connectors/favorites');
  }

  public getPrices$(): Promise<{ [key: string]: string }> {
    return this._api.get<{ [key: string]: string }>('/connectors/prices');
  }

  public getSymbolHistory$(symbol: string): Promise<Tick[]> {
    return this._api.get<Tick[]>(`/connectors/${symbol}/history`);
  }

  public getSymbolSimulations$(
    symbol: string
  ): Promise<{ simulations: any[] }> {
    return this._api.get<{ simulations: any[] }>(
      `/connectors/${symbol}/simulations`
    );
  }

  public listConnectors$(): Promise<ConnectorConfig[]> {
    return this._api.get<ConnectorConfig[]>('/connectors');
  }

  public saveConfig$(connectorId: string, config: unknown): Promise<void> {
    return this._api.put(
      `/connectors/${connectorId}/user-connector-config`,
      config
    );
  }
}

export const connectorsService = new ConnectorsService();

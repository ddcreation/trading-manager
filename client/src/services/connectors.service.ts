import { Account, ExchangeInfoResponse, Tick } from '../common/models';
import { ApiService } from './api.service';

export class ConnectorsService {
  private _api: ApiService;

  constructor() {
    this._api = new ApiService();
  }

  public getAccount$(): Promise<Account> {
    return this._api.get<Account>('/connectors/account');
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
}

export const connectorsService = new ConnectorsService();

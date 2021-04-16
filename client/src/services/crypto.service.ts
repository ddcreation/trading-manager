import { Account, ExchangeInfoResponse, Tick } from '../common/models';
import { ApiService } from './api.service';

export class CryptoService {
  private _api: ApiService;

  constructor() {
    this._api = new ApiService();
  }

  public getAccount$(): Promise<Account> {
    return this._api.get<Account>('/cryptos/account');
  }

  public getExchangeInfos$(): Promise<ExchangeInfoResponse> {
    return this._api.get<ExchangeInfoResponse>('/cryptos/exchange-info');
  }

  public getFavorites$(): Promise<string[]> {
    return this._api.get<string[]>('/cryptos/favorites');
  }

  public getPrices$(): Promise<{ [key: string]: string }> {
    return this._api.get<{ [key: string]: string }>('/cryptos/prices');
  }

  public getSymbolHistory$(symbol: string): Promise<Tick[]> {
    return this._api.get<Tick[]>(`/cryptos/${symbol}/history`);
  }

  public getSymbolSimulations$(
    symbol: string
  ): Promise<{ simulations: any[] }> {
    return this._api.get<{ simulations: any[] }>(
      `/cryptos/${symbol}/simulations`
    );
  }
}

export const cryptoService = new CryptoService();

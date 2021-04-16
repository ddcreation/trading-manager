import { Account, ExchangeInfoResponse } from '../common/models';
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
}

export const cryptoService = new CryptoService();

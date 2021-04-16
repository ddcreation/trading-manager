import { ApiService } from './api.service';

export class UserService {
  private _api: ApiService;

  constructor() {
    this._api = new ApiService();
  }

  public async me$(): Promise<{ [k: string]: unknown }> {
    const userData = await this._api.get<{ [k: string]: unknown }>('/users/me');

    return userData;
  }
}

export const userService = new UserService();

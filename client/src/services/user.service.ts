import { ApiService } from './api.service';

export class UserService {
  private _api: ApiService;

  constructor() {
    this._api = new ApiService();
  }

  public async me$(): Promise<unknown> {
    const userData = await this._api.get('/users/me');

    return userData;
  }
}

export const userService = new UserService();

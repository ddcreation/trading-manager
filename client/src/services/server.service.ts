import { ApiService } from './api.service';

export class ServerService {
  private _api: ApiService;

  constructor() {
    this._api = new ApiService();
  }

  public async healthcheck$(): Promise<string> {
    const status = await this._api.get<string>('/healthcheck');

    return status;
  }
}

export const serverService = new ServerService();

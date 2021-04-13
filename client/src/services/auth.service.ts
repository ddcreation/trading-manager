import { LOGIN_SUCCESS } from '../redux';
import store from '../redux/store';
import { ApiService } from './api.service';

export interface LoginRequest {
  username: string;
  password: string;
}

export class AuthService {
  private _api: ApiService;

  constructor() {
    this._api = new ApiService();
  }

  public login(credentials: LoginRequest): void {
    this._api.post('/auth/login', credentials).then((response) => {
      store.dispatch({ type: LOGIN_SUCCESS });
    });
  }
}

export const authService = new AuthService();

import { loginAction, logoutAction, registerAction } from '../redux';
import { store } from '../redux/store';
import { ApiService } from './api.service';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  confirmPassword: string;
}

export class AuthService {
  private _api: ApiService;

  constructor() {
    this._api = new ApiService();
  }

  public login(credentials: LoginRequest): void {
    this._api.post('/auth/login', credentials).then((response) => {
      store.dispatch(loginAction(response));
    });
  }

  public logout(): void {
    const token = store.getState().user.refreshToken;

    this._api.post('/auth/logout', { token }).finally(() => {
      store.dispatch(logoutAction());
    });
  }

  public async refreshToken$(): Promise<unknown> {
    return this._api
      .post('/auth/refresh', { token: store.getState().user.refreshToken })
      .then((response) => {
        store.dispatch(loginAction(response));
      })
      .catch(() => this.logout());
  }

  public async register$(credentials: RegisterRequest): Promise<unknown> {
    return this._api.post('/auth/register', credentials).then((response) => {
      store.dispatch(registerAction());

      return response;
    });
  }
}

export const authService = new AuthService();

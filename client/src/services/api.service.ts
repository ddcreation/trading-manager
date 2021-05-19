import axios from 'axios';
import {
  NotificationConfig,
  NotificationType,
} from '../common/models/Notification';
import { logoutAction, notifyAction } from '../redux';
import { store } from '../redux/store';

const { REACT_APP_API_URL } = process.env;

export class ApiService {
  private _apiUrl = REACT_APP_API_URL;
  private _config = {
    headers: {} as any,
  };

  constructor() {
    this._setHeaders();

    store.subscribe(() => {
      this._setHeaders();
    });
  }

  public get<T>(path: string): Promise<T> {
    return new Promise((resolve) => {
      axios
        .get<T>(`${this._apiUrl}${path}`, this._config)
        .then((response) => resolve(response.data))
        .catch(this.errorHandler);
    });
  }

  public post<T>(path: string, body: unknown): Promise<T> {
    return new Promise((resolve) => {
      axios
        .post<T>(`${this._apiUrl}${path}`, body, this._config)
        .then((response) => resolve(response.data))
        .catch(this.errorHandler);
    });
  }

  public put<T>(path: string, body: unknown): Promise<T> {
    return new Promise((resolve) => {
      axios
        .put<T>(`${this._apiUrl}${path}`, body, this._config)
        .then((response) => resolve(response.data))
        .catch(this.errorHandler);
    });
  }

  public errorHandler(error: any): void {
    if (error.response?.status === 401) {
      store.dispatch(logoutAction());
    }

    store.dispatch(
      notifyAction({
        type: NotificationType.ERROR,
        title: error.response.data.code || 'ERROR',
        body: error.response.data.message || 'ERROR',
        persistent: false,
        dismissable: true,
      } as NotificationConfig)
    );
  }

  private _setHeaders = () => {
    const accessToken = store.getState().user.accessToken;

    if (accessToken) {
      this._config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete this._config.headers.Authorization;
    }
  };
}

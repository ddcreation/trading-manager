import axios from 'axios';
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

  public post<T>(path: string, body: any): Promise<void | T> {
    return new Promise((resolve) => {
      axios
        .post<T>(`${this._apiUrl}${path}`, body, this._config)
        .then((response) => resolve(response.data))
        .catch(this.errorHandler);
    });
  }

  public errorHandler(error: any): void {
    // TODO send UI redux action to show toaster
    console.log(error);
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

import { Axios, HttpOptions } from './axios/axios-instances';

const { REACT_APP_API_URL } = process.env;

export class ApiService {
  private _apiUrl = REACT_APP_API_URL;
  private _axios = new Axios();

  public get<T>(path: string, options?: HttpOptions): Promise<T> {
    return this._axios.get<T>(`${this._apiUrl}${path}`, options);
  }

  public post<T>(
    path: string,
    body: unknown,
    options?: HttpOptions
  ): Promise<T> {
    return this._axios.post<T>(`${this._apiUrl}${path}`, body, options);
  }

  public put<T>(
    path: string,
    body: unknown,
    options?: HttpOptions
  ): Promise<T> {
    return this._axios.put<T>(`${this._apiUrl}${path}`, body, options);
  }
}

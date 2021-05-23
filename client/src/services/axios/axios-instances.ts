import axios, { AxiosInstance } from 'axios';
import {
  authorizationHeaderInterceptor,
  refreshTokenInterceptor,
} from './interceptors';
import { errorNotificationInterceptor } from './interceptors/error-notification';

export const HttpOptionsType = {
  AUTH: 'AUTH' as const,
  'NOTIFY-ERROR': 'NOTIFY-ERROR' as const,
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type HttpOptionsType = keyof typeof HttpOptionsType;

export type HttpOptions = Partial<{
  [key: string]: unknown;
}>;

export class Axios {
  public getInstance(options?: HttpOptions): AxiosInstance {
    const defaultOptions = {
      [HttpOptionsType.AUTH]: true,
      [HttpOptionsType['NOTIFY-ERROR']]: true,
    };

    const instanceOptions = { ...defaultOptions, ...options };

    const axiosInstance = axios.create();

    if (instanceOptions[HttpOptionsType.AUTH]) {
      axiosInstance.interceptors.request.use(authorizationHeaderInterceptor);
      axiosInstance.interceptors.response.use(
        (response) => response,
        refreshTokenInterceptor
      );
    }

    if (instanceOptions[HttpOptionsType['NOTIFY-ERROR']]) {
      axiosInstance.interceptors.response.use(
        (response) => response,
        errorNotificationInterceptor
      );
    }

    return axiosInstance;
  }

  public get<T>(path: string, options?: HttpOptions): Promise<T> {
    return this.getInstance(options)
      .get<T>(path, this._cleanAppOptions(options))
      .then((response) =>
        response.status < 399 ? response.data : (null as any as T)
      );
  }

  public post<T>(
    path: string,
    body: unknown,
    options?: HttpOptions
  ): Promise<T> {
    return this.getInstance(options)
      .post<T>(path, body, this._cleanAppOptions(options))
      .then((response) => response.data);
  }

  public put<T>(
    path: string,
    body: unknown,
    options?: HttpOptions
  ): Promise<T> {
    return this.getInstance(options)
      .put<T>(path, body, this._cleanAppOptions(options))
      .then((response) => response.data);
  }

  private _cleanAppOptions(options?: HttpOptions): HttpOptions | undefined {
    if (options) {
      Object.keys(HttpOptionsType).forEach((appKey) => {
        if (typeof options[appKey] !== 'undefined') {
          delete options[appKey];
        }
      });
    }

    return options;
  }
}

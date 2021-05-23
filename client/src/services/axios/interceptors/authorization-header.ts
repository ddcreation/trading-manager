import { AxiosRequestConfig } from 'axios';
import { store } from '../../../redux';

export const authorizationHeaderInterceptor = (
  request: AxiosRequestConfig
): AxiosRequestConfig => {
  const accessToken = store.getState().user.accessToken;

  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    delete request.headers.Authorization;
  }

  return request;
};

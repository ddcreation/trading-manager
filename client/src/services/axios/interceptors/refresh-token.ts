import { AxiosError } from 'axios';
import { logoutAction, store } from '../../../redux';

export const refreshTokenInterceptor = (error: AxiosError): Promise<never> => {
  if (error.response?.status === 401) {
    store.dispatch(logoutAction());
  }

  return Promise.reject(error.response);
};

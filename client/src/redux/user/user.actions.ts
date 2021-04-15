import { AUTH_LOGOUT, AUTH_REGISTER, LOGIN_SUCCESS } from './user.types';

export const loginAction = (authData: any) => ({
  type: LOGIN_SUCCESS,
  payload: authData,
});

export const logoutAction = () => ({
  type: AUTH_LOGOUT,
  payload: {},
});

export const registerAction = () => ({
  type: AUTH_REGISTER,
  payload: {},
});

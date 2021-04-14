import { AUTH_REGISTER, LOGIN_SUCCESS } from './user.types';

export const loginAction = (authData: any) => ({
  type: LOGIN_SUCCESS,
  payload: authData,
});

export const registerAction = () => ({
  type: AUTH_REGISTER,
  payload: {},
});

export const logout = () => (dispatch: any) => {};

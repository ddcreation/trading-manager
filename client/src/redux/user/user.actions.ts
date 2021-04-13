import { LOGIN_SUCCESS } from './user.types';

export const loginAction = (authData: any) => ({
  type: LOGIN_SUCCESS,
  payload: authData,
});

export const logout = () => (dispatch: any) => {};

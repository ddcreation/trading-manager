import { AUTH_LOGOUT, AUTH_REGISTER, LOGIN_SUCCESS } from './user.types';

interface UserState {
  accessToken?: string;
  refreshToken?: string;
  authenticated: boolean;
  registered: boolean;
}

const initialState: UserState = {
  authenticated: false,
  registered: false,
};

const userReducer = (state = initialState, action: any): UserState => {
  let newState = { ...state };

  switch (action.type) {
    case LOGIN_SUCCESS: {
      newState = { ...state, ...action.payload };
      newState.authenticated = true;
      break;
    }
    case AUTH_LOGOUT: {
      newState = initialState;
      break;
    }
    case AUTH_REGISTER: {
      newState.registered = true;
      break;
    }
  }

  return newState;
};

export default userReducer;

import { AUTH_REGISTER, LOGIN_SUCCESS } from './user.types';

interface UserState {
  authenticated: boolean;
  registered: boolean;
}

const initialState: UserState = {
  authenticated: false,
  registered: false,
};

const userReducer = (state = initialState, action: any): UserState => {
  const newState = { ...state };

  switch (action.type) {
    case LOGIN_SUCCESS: {
      newState.authenticated = true;
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

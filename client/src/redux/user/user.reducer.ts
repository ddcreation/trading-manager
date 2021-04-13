import { LOGIN_SUCCESS } from './user.types';

interface UserState {
  authenticated: boolean;
}

const initialState: UserState = {
  authenticated: false,
};

const userReducer = (state = initialState, action: any): UserState => {
  if (action.type === LOGIN_SUCCESS) {
    return {
      ...state,
      authenticated: true,
    };
  }
  return state;
};

export default userReducer;

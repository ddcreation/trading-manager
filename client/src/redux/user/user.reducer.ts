interface UserState {
  authenticated: boolean;
}

const initialState: UserState = {
  authenticated: false,
};

const userReducer = (state = initialState, action: any): UserState => {
  return state;
};

export default userReducer;

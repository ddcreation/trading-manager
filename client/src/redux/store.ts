import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import userReducer from './user/user.reducer';

const reducer = combineReducers({
  user: userReducer,
});

const store = createStore(reducer, applyMiddleware(ReduxThunk));

export default store;

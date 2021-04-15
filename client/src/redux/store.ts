import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import userReducer from './user/user.reducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const reducer = combineReducers({
  user: persistReducer(
    {
      key: 'user',
      storage,
    },
    userReducer
  ),
});

const store = createStore(reducer, applyMiddleware(ReduxThunk));

const persistor = persistStore(store);

export { store, persistor };

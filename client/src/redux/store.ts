import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import userReducer from './user/user.reducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import uiReducer from './ui/ui.reducer';

const reducer = combineReducers({
  user: persistReducer(
    {
      key: 'user',
      storage,
    },
    userReducer
  ),
  ui: uiReducer,
});

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(ReduxThunk))
);

const persistor = persistStore(store);

export { store, persistor };

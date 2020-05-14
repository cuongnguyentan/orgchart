import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import app from './AppReducer';

const reducers = {
  app
};

const rootReducer = combineReducers(reducers);

const persistConfig = {
  key: `orgchart.${process.env.REACT_APP_STORE_KEY}`,
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: ['app']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(
  persistedReducer,
  applyMiddleware(
    thunkMiddleware
  )
);

export const persistor = persistStore(store);

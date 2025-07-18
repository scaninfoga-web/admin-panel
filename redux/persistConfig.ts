import { persistReducer } from 'redux-persist';
import type { Storage } from 'redux-persist';
let storage: Storage;

if (typeof window !== 'undefined') {
  storage = require('redux-persist/lib/storage').default;
}

export const getPersistedReducer = (rootReducer: any) => {
  if (!storage) {
    return rootReducer;
  }

  const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'info'],
  };

  return persistReducer(persistConfig, rootReducer);
};

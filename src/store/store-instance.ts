

// store/store-instance.ts
'use client';

import { makeStore } from './index';
import { persistStore } from 'redux-persist';

export const store = makeStore();
export const persistor = persistStore(store, null, () => {
  console.log('store-instance: Persistor initialized, state rehydrated');
});
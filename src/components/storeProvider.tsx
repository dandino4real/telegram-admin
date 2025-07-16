
'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { setupListeners } from '@reduxjs/toolkit/query';
import { store, persistor } from '@/store/store-instance';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

setupListeners(store.dispatch);

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<LoadingSpinner size="md" />}
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;
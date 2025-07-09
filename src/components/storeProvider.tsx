

// components/StoreProvider.tsx
'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { setupListeners } from '@reduxjs/toolkit/query';
import { store, persistor } from '@/store/store-instance';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useEffect, useState } from 'react';

setupListeners(store.dispatch);

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Provider store={store}>
      {isClient ? (
        <PersistGate
          loading={<LoadingSpinner size="md" />}
          persistor={persistor}
          onBeforeLift={() => {
            if (typeof window !== 'undefined') {
              console.log('Rehydrated state:', store.getState().authSession);
            }
          }}
        >
          {children}
        </PersistGate>
      ) : (
        // Server-side: Render without PersistGate
        children
      )}
    </Provider>
  );
};

export default StoreProvider;


// // components/StoreProvider.tsx
// 'use client';

// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { setupListeners } from '@reduxjs/toolkit/query';
// import { store, persistor } from '@/store/store-instance';
// import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
// import { useEffect, useState } from 'react';
// import { setLoadingState } from '@/lib/authManager';

// setupListeners(store.dispatch);

// const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isClient, setIsClient] = useState(false);
//   useEffect(() => {
//     // Disable loading state after initial mount
//     setLoadingState(false);
//   }, []);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   return (
//     <Provider store={store}>
//       {isClient ? (
//         <PersistGate
//           loading={<LoadingSpinner size="md" />}
//           persistor={persistor}
//           // onBeforeLift={() => {
//           //   if (typeof window !== 'undefined') {
//           //     console.log('Rehydrated state:', store.getState().authSession);
//           //   }
//           // }}
//           onBeforeLift={() => setLoadingState(true)}
//           onAfterLift={() => setLoadingState(false)}
//         >
//           {children}
//         </PersistGate>
//       ) : (
//         // Server-side: Render without PersistGate
//         children
//       )}
//     </Provider>
//   );
// };

// export default StoreProvider;



'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { setupListeners } from '@reduxjs/toolkit/query';
import { store, persistor } from '@/store/store-instance';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useEffect, useState } from 'react';
import { setLoadingState } from '@/lib/authManager';

setupListeners(store.dispatch);

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle rehydration completion
  const handleBeforeLift = () => {
    setLoadingState(true);
    console.log('StoreProvider: Rehydration started');
  };

  return (
    <Provider store={store}>
      {isClient ? (
        <PersistGate
          loading={<LoadingSpinner size="md" />}
          persistor={persistor}
          onBeforeLift={handleBeforeLift}
        >
          <RehydrationHandler>
            {children}
          </RehydrationHandler>
        </PersistGate>
      ) : (
        // Server-side: Render without PersistGate
        children
      )}
    </Provider>
  );
};

// Component to handle post-rehydration logic
const RehydrationHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    console.log('StoreProvider: Rehydration completed');
    setLoadingState(false);
  }, []);

  return <>{children}</>;
};

export default StoreProvider;
'use client';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';

import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';

export function ProviderUtil({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Toaster position="top-right" richColors />
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

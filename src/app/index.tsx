import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { queryClient } from './providers/query-client';
import { appRouter } from './router/app-router';
import { appStore } from './store/app-store';

import './index.css';

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import('@/shared/api/mocks/browser');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={appStore}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={appRouter} />
          <Toaster richColors position="top-right" />
        </QueryClientProvider>
      </Provider>
    </StrictMode>,
  );
});

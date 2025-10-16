import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/components/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import Provider from '@/app/Provider.tsx';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
);

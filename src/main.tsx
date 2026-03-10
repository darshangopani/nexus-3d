import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import AppRoutes from './AppRoutes.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);

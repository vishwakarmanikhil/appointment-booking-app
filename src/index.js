import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import PublicRouter from './router/publicRouter';
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './app/common.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <PublicRouter />
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>
  </Provider>
);
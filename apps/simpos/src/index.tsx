import React from 'react';
import ReactDOM from 'react-dom/client';
// @ts-ignore
import onScan from 'onscan.js';
import { AuthProvider } from './contexts/AuthProvider';
import { ThemeProvider } from './configs/themes';
import { PreferenceProvider } from './contexts/PreferenceProvider';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

onScan.attachTo(document);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <PreferenceProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </PreferenceProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

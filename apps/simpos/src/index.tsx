import React from 'react';
import ReactDOM from "react-dom/client";
// @ts-ignore
import onScan from 'onscan.js';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { AuthProvider } from './contexts/AuthProvider';
import { ThemeProvider } from './configs/themes';
import reportWebVitals from './reportWebVitals';
import { PreferenceProvider } from './contexts/PreferenceProvider';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

onScan.attachTo(document);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <PreferenceProvider>
        <AuthProvider>
        <RouterProvider router={router} />
        </AuthProvider>
      </PreferenceProvider>
    </ThemeProvider>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

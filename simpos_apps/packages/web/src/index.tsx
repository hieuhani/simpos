import React from 'react';
import ReactDOM from 'react-dom';
// @ts-ignore
import onScan from 'onscan.js';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { AuthProvider } from './contexts/AuthProvider';
import { Routes } from './configs/routes';
import { ThemeProvider } from './configs/themes';
import reportWebVitals from './reportWebVitals';
import { PreferenceProvider } from './contexts/PreferenceProvider';

onScan.attachTo(document);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <PreferenceProvider>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </PreferenceProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

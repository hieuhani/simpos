import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { Routes } from './configs/routes';
import { ThemeProvider } from './configs/themes';
import reportWebVitals from './reportWebVitals';
import { PreferenceProvider } from './contexts/PreferenceProvider';

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

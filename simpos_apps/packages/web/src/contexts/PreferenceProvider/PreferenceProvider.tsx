import React, { createContext, useContext, useEffect, useState } from 'react';

export interface PreferenceContextState {
  isOnline: boolean;
}

const PreferenceContext = createContext<PreferenceContextState | undefined>(
  undefined,
);

export const PreferenceProvider: React.FunctionComponent = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    function changeStatus() {
      setIsOnline(navigator.onLine);
    }
    window.addEventListener('online', changeStatus);
    window.addEventListener('offline', changeStatus);
    return () => {
      window.removeEventListener('online', changeStatus);
      window.removeEventListener('offline', changeStatus);
    };
  }, []);

  return (
    <PreferenceContext.Provider value={{ isOnline }}>
      {children}
    </PreferenceContext.Provider>
  );
};

export function usePreference() {
  return useContext(PreferenceContext)!;
}

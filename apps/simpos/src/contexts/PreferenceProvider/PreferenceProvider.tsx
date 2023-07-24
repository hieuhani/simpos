import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useWindowSize } from '../../hooks/use-window-size';

export interface PreferenceContextState {
  isOnline: boolean;
  isMobile: boolean;
}

const PreferenceContext = createContext<PreferenceContextState | undefined>(
  undefined,
);

export const PreferenceProvider: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width <= 768, [width]);
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
    <PreferenceContext.Provider value={{ isOnline, isMobile }}>
      {children}
    </PreferenceContext.Provider>
  );
};

export function usePreference() {
  return useContext(PreferenceContext)!;
}

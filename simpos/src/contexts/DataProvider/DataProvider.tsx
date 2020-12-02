import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionManager } from '../../apps/pos/components/SessionManager';
import { AuthUserMeta, PosSession } from '../../services/db';
import { useAuth } from '../AuthProvider';
import { getLoadModelsMap, getModelNames } from './dataLoader';

export interface DataContextState {}

const initialState: DataContextState = {};
const DataContext = createContext<DataContextState>(initialState);

export const DataProvider: React.FunctionComponent = ({ children }) => {
  const auth = useAuth();
  const [session, setSession] = useState<PosSession | undefined>(undefined);
  const [initializing, setInitializing] = useState(true);
  const initializeData = async (userMeta: AuthUserMeta) => {
    const loadModelsMap = getLoadModelsMap();
    const requiredKeys = getModelNames();

    await Promise.all(
      requiredKeys
        .map((key) => {
          if (!loadModelsMap[key]) {
            return null;
          }
          return loadModelsMap[key].load({
            userMeta,
          });
        })
        .filter(Boolean),
    );

    setInitializing(false);
  };

  useEffect(() => {
    if (auth.userMeta) {
      initializeData(auth.userMeta);
    }
  }, [auth.userMeta]);

  const onSessionSelected = (selectedSession: PosSession) => {
    setSession(selectedSession);
  };

  if (!auth.userMeta) {
    return null;
  }

  return (
    <DataContext.Provider value={{}}>
      {!initializing && (
        <>
          {children}
          {!session && (
            <SessionManager
              authUserMeta={auth.userMeta}
              onSessionSelected={onSessionSelected}
            />
          )}
        </>
      )}
    </DataContext.Provider>
  );
};

export function useData() {
  return useContext(DataContext);
}

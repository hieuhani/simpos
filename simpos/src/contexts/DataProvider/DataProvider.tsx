import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionManager } from '../../apps/pos/components/SessionManager';
import {
  AuthUserMeta,
  PosConfig,
  posConfigRepository,
  PosSession,
} from '../../services/db';
import { useAuth } from '../AuthProvider';
import { getLoadModelsMap, getModelNames } from './dataLoader';

export interface DataContextState {
  posConfig: PosConfig;
  posSession: PosSession;
}

const DataContext = createContext<DataContextState | undefined>(undefined);

export const DataProvider: React.FunctionComponent = ({ children }) => {
  const auth = useAuth();
  const [data, setData] = useState<DataContextState | undefined>(undefined);

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
    } else {
      setInitializing(false);
    }
  }, [auth.userMeta]);

  const onSessionSelected = async (selectedSession: PosSession) => {
    const posConfig = await posConfigRepository.findById(selectedSession.id);
    if (!posConfig) {
      throw new Error('Data error');
    }
    setData({
      posConfig,
      posSession: selectedSession,
    });
  };

  return (
    <DataContext.Provider value={data}>
      {!initializing && (
        <>
          {children}
          {!data && auth.userMeta && (
            <SessionManager
              authUserMeta={auth.userMeta!}
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

import React, { createContext, useContext, useEffect } from 'react';
import { AuthUserMeta } from '../../services/db';
import { rootDb } from '../../services/db/root';

import { useAuth } from '../AuthProvider';
import { getLoadModelsMap, getModelNames } from './dataLoader';

export interface DataContextState {}

const initialState: DataContextState = {};
const DataContext = createContext<DataContextState>(initialState);

export const DataProvider: React.FunctionComponent = ({ children }) => {
  const auth = useAuth();

  const initializeData = async (userMeta: AuthUserMeta) => {
    const currentTableNames = await rootDb.currentTableNames();

    const loadModelsMap = getLoadModelsMap();
    const requiredKeys = getModelNames();
    const missingKeys = requiredKeys.filter(
      (x) => !currentTableNames.includes(x),
    );
    if (missingKeys.length > 0) {
      await Promise.all(
        missingKeys
          .map((key) => {
            if (!loadModelsMap[key]) {
              return null;
            }
            return loadModelsMap[key].load();
          })
          .filter(Boolean),
      );
    }
  };
  useEffect(() => {
    if (auth.userMeta) {
      initializeData(auth.userMeta);
    }
  }, [auth.userMeta]);
  return <DataContext.Provider value={{}}>{children}</DataContext.Provider>;
};

export function useData() {
  return useContext(DataContext);
}

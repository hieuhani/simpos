import React, { createContext, useContext, useEffect } from 'react';
import { db } from '../../services/clients';
import { AuthUserMeta, useAuth } from '../AuthProvider';
import { getLoadModelsMap, getModelNames } from './dataLoader';

export interface DataContextState {}

const initialState: DataContextState = {};
const DataContext = createContext<DataContextState>(initialState);

export const DataProvider: React.FunctionComponent = ({ children }) => {
  const auth = useAuth();

  const initializeData = async (userMeta: AuthUserMeta) => {
    // check xem tinh hinh data tren local nhu nao, da du het chua
    const currentKeys = await db.keys();
    const loadModelsMap = getLoadModelsMap();
    const requiredKeys = getModelNames();
    const missingKeys = requiredKeys.filter((x) => !currentKeys.includes(x));

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
    // call api de lay ve
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

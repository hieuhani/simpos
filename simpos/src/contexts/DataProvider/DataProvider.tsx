import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionManager } from '../../apps/pos/components/SessionManager';
import {
  AuthUserMeta,
  DecimalPrecision,
  decimalPrecisionRepository,
  PosConfig,
  posConfigRepository,
  PosSession,
} from '../../services/db';
import {
  ProductPricelist,
  productPricelistRepository,
} from '../../services/db/product-pricelist';
import { useAuth } from '../AuthProvider';
import { getLoadModelsMap, getModelNames } from './dataLoader';

export interface DataContextState {
  posConfig: PosConfig;
  posSession: PosSession;
  pricelists: ProductPricelist[];
  defaultPriceList: ProductPricelist;
  decimalPrecisions: DecimalPrecision[];
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
    const posConfig = await posConfigRepository.findById(
      selectedSession.posConfigId,
    );
    if (!posConfig) {
      throw new Error('POS Config data error');
    }
    const pricelists = await productPricelistRepository.findByIds(
      posConfig.usePricelist
        ? posConfig.availablePricelistIds
        : [posConfig.pricelistId[0]],
    );
    if (pricelists.length === 0) {
      throw new Error('Product pricelist does not setup properly');
    }
    const defaultPriceList = pricelists.find(
      ({ id }) => id === posConfig.pricelistId[0],
    );

    if (!defaultPriceList) {
      throw new Error(
        'The application could not determine the default pricelist',
      );
    }

    const decimalPrecisions = await decimalPrecisionRepository.all();

    setData({
      posConfig,
      posSession: selectedSession,
      pricelists,
      defaultPriceList,
      decimalPrecisions,
    });
  };

  const node = data ? (
    children
  ) : (
    <SessionManager
      authUserMeta={auth.userMeta!}
      onSessionSelected={onSessionSelected}
    />
  );

  return (
    <DataContext.Provider value={data}>
      {!initializing && node}
    </DataContext.Provider>
  );
};

export function useData() {
  return useContext(DataContext)!;
}

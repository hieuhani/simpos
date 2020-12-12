import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { SessionManager } from '../../apps/pos/components/SessionManager';
import {
  AccountTax,
  accountTaxRepository,
  AuthUserMeta,
  DecimalPrecision,
  decimalPrecisionRepository,
  PosConfig,
  posConfigRepository,
  PosSession,
} from '../../services/db';
import { Company, companyRepository } from '../../services/db/company';
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
  taxes: AccountTax[];
  company: Company;
}

export type GlobalDataAction =
  | {
      type: 'INITIAL_LOAD';
      payload: DataContextState;
    }
  | {
      type: 'UPDATE_DATA';
      payload: Partial<DataContextState>;
    };

export type GlobalDataDispatch = (action: GlobalDataAction) => void;

const DataContext = createContext<DataContextState | undefined>(undefined);

const GlobalDataDispatchContext = React.createContext<
  GlobalDataDispatch | undefined
>(undefined);

function globalDataReducer(
  state: DataContextState | undefined,
  action: GlobalDataAction,
): DataContextState | undefined {
  switch (action.type) {
    case 'INITIAL_LOAD':
      return action.payload;
    case 'UPDATE_DATA':
      const currentState = state!;
      return {
        ...currentState,
        ...action.payload,
      };
    default:
      return state;
  }
}
const initialState: DataContextState | undefined = undefined;

export const DataProvider: React.FunctionComponent = ({ children }) => {
  const auth = useAuth();
  const [state, dispatch] = useReducer(globalDataReducer, initialState);

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
    const taxes = await accountTaxRepository.all();

    const company = await companyRepository.first();

    dispatch({
      type: 'INITIAL_LOAD',
      payload: {
        posConfig,
        posSession: selectedSession,
        pricelists,
        defaultPriceList,
        decimalPrecisions,
        taxes,
        company: company!,
      },
    });
  };

  const node = state ? (
    children
  ) : (
    <SessionManager
      authUserMeta={auth.userMeta!}
      onSessionSelected={onSessionSelected}
    />
  );

  return (
    <DataContext.Provider value={state}>
      <GlobalDataDispatchContext.Provider value={dispatch}>
        {!initializing && node}
      </GlobalDataDispatchContext.Provider>
    </DataContext.Provider>
  );
};

export function useData() {
  return useContext(DataContext)!;
}

export function useGlobalDataDispatch(): GlobalDataDispatch {
  const context = useContext(GlobalDataDispatchContext);
  if (!context) {
    throw new Error('useGlobalDataDispatch must be inside a DataProvider');
  }
  return context;
}

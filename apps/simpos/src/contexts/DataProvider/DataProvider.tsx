import keyBy from 'lodash.keyby';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { SessionManager } from '../../apps/pos/components/SessionManager';
import { authService } from '../../services/auth';
import {
  AccountTax,
  accountTaxRepository,
  AuthUserMeta,
  DecimalPrecision,
  decimalPrecisionRepository,
  PaymentMethod,
  paymentMethodRepository,
  PosConfig,
  posConfigRepository,
  PosSession,
  UOM,
  uomRepository,
} from '../../services/db';
import { Company, companyRepository } from '../../services/db/company';
import { Employee } from '../../services/db/employee';
import {
  ProductPricelist,
  productPricelistRepository,
} from '../../services/db/product-pricelist';
import {
  RestaurantPrinter,
  restaurantPrinterRepository,
} from '../../services/db/restaurant-printer';
import { userRepository } from '../../services/db/user';
import { useAuth } from '../AuthProvider';
import { syncData } from './dataLoader';
import { Loading } from '../../apps/pos/components/Loading';

export interface DataContextState {
  posConfig: PosConfig;
  posSession: PosSession;
  pricelists: ProductPricelist[];
  defaultPriceList: ProductPricelist;
  decimalPrecisions: DecimalPrecision[];
  taxes: AccountTax[];
  company: Company;
  uoms: UOM[];
  paymentMethods: PaymentMethod[];
  cashier?: Employee;
  printersDict: Record<string, RestaurantPrinter>;
  categoryPrinterIds: Record<string, number[]>;
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

const GlobalDataDispatchContext = createContext<GlobalDataDispatch | undefined>(
  undefined,
);

function globalDataReducer(
  state: DataContextState | undefined,
  action: GlobalDataAction,
): DataContextState | undefined {
  switch (action.type) {
    case 'INITIAL_LOAD':
      return action.payload;
    case 'UPDATE_DATA':
      if (!state) {
        throw new Error('You can only update data after initial load');
      }
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
const initialState: DataContextState | undefined = undefined;

export const DataProvider: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const auth = useAuth();
  const [state, dispatch] = useReducer(globalDataReducer, initialState);
  const [initializing, setInitializing] = useState(true);
  const initializeData = async (userMeta: AuthUserMeta) => {
    await syncData(userMeta);
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

    const { loginNumber } = await authService.refreshMetadata({
      config_id: posConfig.id,
    });

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
    const uoms = await uomRepository.all();
    const paymentMethods = await paymentMethodRepository.all();
    const printers = await restaurantPrinterRepository.all();

    const activePrinters = printers.filter(
      (printer) => ~posConfig.printerIds.indexOf(printer.id),
    );
    const printersDict = keyBy(activePrinters, 'id');
    const categoryPrinterIdsMap: Record<string, Record<string, boolean>> = {};
    activePrinters.forEach((printer) => {
      printer.productCategoriesIds.forEach((categoryId) => {
        if (!categoryPrinterIdsMap[categoryId]) {
          categoryPrinterIdsMap[categoryId] = {};
        }
        categoryPrinterIdsMap[categoryId][printer.id] = true;
      });
    });

    const categoryPrinterIds = Object.keys(categoryPrinterIdsMap).reduce(
      (prev, current) => {
        return {
          ...prev,
          [current]: Object.keys(categoryPrinterIdsMap[current]).map((id) =>
            parseInt(id, 10),
          ),
        };
      },
      {},
    );

    let cashier: Employee | undefined;
    if (!posConfig.modulePosHr) {
      const user = await userRepository.findById(auth.userMeta!.uid);
      if (user) {
        cashier = {
          name: user.name,
          user,
        };
      }
    }

    dispatch({
      type: 'INITIAL_LOAD',
      payload: {
        posConfig,
        posSession: {
          ...selectedSession,
          loginNumber,
        },
        pricelists,
        defaultPriceList,
        decimalPrecisions,
        taxes,
        uoms,
        company: company!,
        paymentMethods,
        cashier,
        printersDict,
        categoryPrinterIds,
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
        {initializing ? <Loading /> : node}
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

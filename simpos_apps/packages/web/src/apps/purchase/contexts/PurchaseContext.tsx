import React, { useContext, useReducer } from 'react';
import { nanoid } from 'nanoid';

import { ProductProduct } from '../../../services/product';

export interface PurchaseLine {
  product: ProductProduct;
  quantity: number;
  productUom?: number;
  virtualId: string;
}

export interface PurchaseState {
  lines: PurchaseLine[];
  partnerId: number;
  pickingTypeId: number;
}

export type PurchaseDispatchAction =
  | {
      type: 'ADD_LINE';
      payload: ProductProduct;
    }
  | { type: 'REMOVE_LINE'; payload: string }
  | {
      type: 'UPDATE_LINE';
      payload: Pick<PurchaseLine, 'virtualId' | 'quantity' | 'productUom'>;
    }
  | {
      type: 'RESET';
    };

const initialState: PurchaseState = {
  lines: [],
  partnerId: 0,
  pickingTypeId: 0,
};

const PurchaseStateContext = React.createContext<PurchaseState>(initialState);

export type PurchaseManagerDispatch = (action: PurchaseDispatchAction) => void;

const PurchaseStateActionContext = React.createContext<
  PurchaseManagerDispatch | undefined
>(undefined);

export function purchaseReducer(
  state: PurchaseState,
  action: PurchaseDispatchAction,
): PurchaseState {
  switch (action.type) {
    case 'ADD_LINE':
      const currentLineIndex = state.lines.findIndex(
        (line) => line.product.id === action.payload.id,
      );
      if (!!~currentLineIndex) {
        return {
          ...state,
          lines: state.lines.map((line, index) => {
            if (index === currentLineIndex) {
              return {
                ...line,
                quantity: line.quantity + 1,
              };
            }
            return line;
          }),
        };
      }
      return {
        ...state,
        lines: [
          ...state.lines,
          {
            virtualId: nanoid(),
            product: action.payload,
            quantity: 1, // Default quantity
            productUom: action.payload.uomPoId[0] || 1, // 1: Unit
          },
        ],
      };
    case 'REMOVE_LINE':
      return {
        ...state,
        lines: state.lines.filter((line) => line.virtualId !== action.payload),
      };
    case 'UPDATE_LINE':
      return {
        ...state,
        lines: state.lines.map((line) => {
          if (line.virtualId === action.payload.virtualId) {
            return {
              ...line,
              ...action.payload,
            };
          }
          return line;
        }),
      };

    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const PurchaseManager: React.FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(purchaseReducer, initialState);
  return (
    <PurchaseStateContext.Provider value={state}>
      <PurchaseStateActionContext.Provider value={dispatch}>
        {children}
      </PurchaseStateActionContext.Provider>
    </PurchaseStateContext.Provider>
  );
};

export function usePurchaseState(): PurchaseState {
  const context = useContext(PurchaseStateContext);
  if (!context) {
    throw new Error('usePurchaseState must be inside a PurchaseManager');
  }
  return context;
}

export function usePurchaseDispatch(): PurchaseManagerDispatch {
  const context = useContext(PurchaseStateActionContext);
  if (!context) {
    throw new Error('usePurchaseDispatch must be inside a PurchaseManager');
  }
  return context;
}

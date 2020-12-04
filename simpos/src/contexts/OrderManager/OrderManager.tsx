import React, { useContext, useEffect, useReducer } from 'react';
import { Order, orderRepository } from '../../services/db/order';

export interface OrderManagerState {
  activeOrderId: string;
  orders: Order[];
}

export type OrderManagerAction = {
  type: 'INITIAL_LOAD';
  payload: Pick<OrderManagerState, 'activeOrderId' | 'orders'>;
};

export type OrderManagerDispatch = (action: OrderManagerAction) => void;

const initialState: OrderManagerState = {
  orders: [],
  activeOrderId: '',
};

const OrderManagerStateContext = React.createContext<OrderManagerState>(
  initialState,
);

const OrderManagerDispatchContext = React.createContext<
  OrderManagerDispatch | undefined
>(undefined);

export function orderManagerReducer(
  state: OrderManagerState,
  action: OrderManagerAction,
): OrderManagerState {
  switch (action.type) {
    case 'INITIAL_LOAD':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export const OrderManager: React.FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(orderManagerReducer, initialState);

  const initilizeOrderManager = async () => {
    const currentOrders = await orderRepository.all();
    if (currentOrders.length > 0) {
      dispatch({
        type: 'INITIAL_LOAD',
        payload: {
          activeOrderId: currentOrders[0].id,
          orders: currentOrders,
        },
      });
    }
    // inti
  };
  useEffect(() => {
    initilizeOrderManager();
  }, []);
  return (
    <OrderManagerStateContext.Provider value={state}>
      <OrderManagerDispatchContext.Provider value={dispatch}>
        {children}
      </OrderManagerDispatchContext.Provider>
    </OrderManagerStateContext.Provider>
  );
};

export function useOrderManagerState(): OrderManagerState {
  const context = useContext(OrderManagerStateContext);
  if (!context) {
    throw new Error('useOrderManagerState must be inside a OrderManager');
  }
  return context;
}

export function useOrderManagerDispatch(): OrderManagerDispatch {
  const context = useContext(OrderManagerDispatchContext);
  if (!context) {
    throw new Error('useOrderManagerDispatch must be inside a OrderManager');
  }
  return context;
}

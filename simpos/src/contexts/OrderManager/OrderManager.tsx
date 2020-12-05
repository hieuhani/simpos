import React, { useContext, useEffect, useReducer } from 'react';
import { Order, orderRepository } from '../../services/db/order';
import { useData, useGlobalDataDispatch } from '../DataProvider';

export interface OrderManagerState {
  activeOrderId: string;
  orders: Order[];
}

export type OrderManagerDispatchAction =
  | {
      type: 'INITIAL_LOAD';
      payload: Pick<OrderManagerState, 'activeOrderId' | 'orders'>;
    }
  | {
      type: 'NEW_ORDER';
      payload: Order;
    }
  | {
      type: 'SELECT_ORDER';
      payload: Order;
    }
  | {
      type: 'DELETE_ORDER';
      payload: Order;
    };

export type OrderManagerDispatch = (action: OrderManagerDispatchAction) => void;
export interface OrderManagerAction {
  addNewOrder: () => Promise<Order>;
  selectOrder: (order: Order) => Promise<Order>;
  deleteOrder: (order: Order) => Promise<Order>;
}
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

const OrderManagerActionContext = React.createContext<
  OrderManagerAction | undefined
>(undefined);

export function orderManagerReducer(
  state: OrderManagerState,
  action: OrderManagerDispatchAction,
): OrderManagerState {
  switch (action.type) {
    case 'INITIAL_LOAD':
      return {
        ...state,
        ...action.payload,
      };
    case 'NEW_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
        activeOrderId: action.payload.id,
      };
    case 'SELECT_ORDER':
      return {
        ...state,
        activeOrderId: action.payload.id,
      };
    case 'DELETE_ORDER':
      const updatedOrders = state.orders.filter(
        (order) => order.id !== action.payload.id,
      );
      let activeOrderId = state.activeOrderId;
      if (
        state.activeOrderId === action.payload.id &&
        updatedOrders.length > 0
      ) {
        activeOrderId = updatedOrders[0].id;
      }
      return {
        ...state,
        orders: updatedOrders,
        activeOrderId,
      };
    default:
      return state;
  }
}

export const OrderManager: React.FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(orderManagerReducer, initialState);
  const globalDataDispatch = useGlobalDataDispatch();
  const data = useData();
  const addNewOrder = async (): Promise<Order> => {
    const newOrder = await orderRepository.addNewOrder({
      posSession: data.posSession,
      defaultPriceList: data.defaultPriceList,
    });
    dispatch({ type: 'NEW_ORDER', payload: newOrder });
    globalDataDispatch({
      type: 'UPDATE_DATA',
      payload: {
        posSession: {
          ...data.posSession,
          sequenceNumber: newOrder.sequenceNumber,
        },
      },
    });
    return newOrder;
  };

  const selectOrder = async (order: Order): Promise<Order> => {
    dispatch({ type: 'SELECT_ORDER', payload: order });
    return order;
  };

  const deleteOrder = async (order: Order): Promise<Order> => {
    await orderRepository.delete(order.id);
    const deletingLastOrder = state.orders.length === 1;
    dispatch({ type: 'DELETE_ORDER', payload: order });
    if (deletingLastOrder) {
      await addNewOrder();
    }
    return order;
  };

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
    } else {
      await addNewOrder();
    }
  };
  useEffect(() => {
    initilizeOrderManager();
  }, []);
  return (
    <OrderManagerStateContext.Provider value={state}>
      <OrderManagerActionContext.Provider
        value={{
          addNewOrder,
          selectOrder,
          deleteOrder,
        }}
      >
        {children}
      </OrderManagerActionContext.Provider>
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

export function useOrderManagerAction(): OrderManagerAction {
  const context = useContext(OrderManagerActionContext);
  if (!context) {
    throw new Error('useOrderManagerAction must be inside a OrderManager');
  }
  return context;
}

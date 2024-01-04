import { Outlet, createBrowserRouter } from 'react-router-dom';
import Login from './apps/auth/Login';
import Pos from './apps/pos';
import { OrderManager } from './contexts/OrderManager';
import { DataProvider } from './contexts/DataProvider';
import { Home } from './apps/home/Home';
import SessionScreen from './apps/pos/SessionScreen';
import ReportScreen from './apps/pos/ReportScreen';
import Purchase from './apps/purchase';
import PurchaseReport from './apps/purchase/PurchaseReport';
import Inventory from './apps/inventory';
import OrderScreen from './apps/pos/OrderScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/pos',
    element: (
      <DataProvider>
        <OrderManager>
          <Outlet />
        </OrderManager>
      </DataProvider>
    ),
    children: [
      {
        path: '',
        element: <Pos />,
      },
      {
        path: 'session',
        element: <SessionScreen />,
      },
      {
        path: 'report',
        element: <ReportScreen />,
      },
      {
        path: 'orders/:orderId',
        element: <OrderScreen />,
      },
    ],
  },
  {
    path: '/purchase',
    element: <Outlet />,
    children: [
      {
        path: '',
        element: <Purchase />,
      },
      {
        path: 'report',
        element: <PurchaseReport />,
      },
    ],
  },
  {
    path: '/inventory',
    element: <Outlet />,
    children: [
      {
        path: '',
        element: <Inventory />,
      },
      {
        path: 'report',
        element: <Inventory />,
      },
    ],
  },
]);

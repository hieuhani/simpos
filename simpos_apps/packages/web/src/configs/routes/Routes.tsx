import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { RequireLogin } from '../../components/PrivateRoute';
import { DataProvider } from '../../contexts/DataProvider';
import { OrderManager } from '../../contexts/OrderManager';

const POS = lazy(() => import('../../apps/pos'));
const CustomerScreen = lazy(() => import('../../apps/pos/CustomerScreen'));
const SessionScreen = lazy(() => import('../../apps/pos/SessionScreen'));
const PosReportScreen = lazy(() => import('../../apps/pos/ReportScreen'));
const PosOrderScreen = lazy(() => import('../../apps/pos/OrderScreen'));

const Login = lazy(() => import('../../apps/auth/Login'));
const Purchase = lazy(() => import('../../apps/purchase'));
const NewPurchase = lazy(() => import('../../apps/purchase/NewPurchase'));
const PurchaseDetails = lazy(
  () => import('../../apps/purchase/PurchaseDetails'),
);

const PurchaseReport = lazy(() => import('../../apps/purchase/PurchaseReport'));
const StockPickingDetails = lazy(
  () => import('../../apps/inventory/StockPickingDetails'),
);

const Inventory = lazy(() => import('../../apps/inventory'));

export const Routes: React.FunctionComponent = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Redirect exact from="/" to="purchase" />
        <Route path="/login" component={Login} />
        <RequireLogin>
          <DataProvider>
            <OrderManager>
              <Route path="/pos" exact component={POS} />
              <Route path="/pos/customer_screen" component={CustomerScreen} />
              <Route path="/pos/session" component={SessionScreen} />
              <Route path="/pos/report" component={PosReportScreen} />
              <Route path="/pos/orders/:orderId" component={PosOrderScreen} />
            </OrderManager>
          </DataProvider>
          <Route path="/purchase" exact component={Purchase} />

          <Switch>
            <Route path="/purchase/new" component={NewPurchase} />
            <Route path="/purchase/report" component={PurchaseReport} />

            <Route
              path="/purchase/:purchaseOrderId"
              component={PurchaseDetails}
            />
          </Switch>
          <Route path="/inventory" exact component={Inventory} />

          <Switch>
            <Route
              path="/inventory/stock_picking/:stockPickingId"
              component={StockPickingDetails}
            />
          </Switch>
        </RequireLogin>
      </Switch>
    </Suspense>
  </Router>
);

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

const Login = lazy(() => import('../../apps/auth/Login'));
const Purchase = lazy(() => import('../../apps/purchase'));
const NewPurchase = lazy(() => import('../../apps/purchase/NewPurchase'));
const PurchaseDetails = lazy(
  () => import('../../apps/purchase/PurchaseDetails'),
);
const Inventory = lazy(() => import('../../apps/inventory'));

export const Routes: React.FunctionComponent = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Redirect exact from="/" to="pos" />
        <Route path="/login" component={Login} />
        <RequireLogin>
          <DataProvider>
            <OrderManager>
              <Route path="/pos" exact component={POS} />
              <Route path="/pos/customer_screen" component={CustomerScreen} />
              <Route path="/pos/session" component={SessionScreen} />
              <Route path="/pos/report" component={PosReportScreen} />
            </OrderManager>
          </DataProvider>
          <Route path="/purchase" exact component={Purchase} />

          <Route path="/purchase/new" component={NewPurchase} />
          <Route
            path="/purchase/:purchaseOrderId"
            exact
            component={PurchaseDetails}
          />
          <Route path="/inventory" component={Inventory} />
        </RequireLogin>
      </Switch>
    </Suspense>
  </Router>
);

import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation,
} from 'react-router-dom';
import { RequireLogin } from '../../components/PrivateRoute';
import { DataProvider } from '../../contexts/DataProvider';
import { OrderManager } from '../../contexts/OrderManager';
import { usePreference } from '../../contexts/PreferenceProvider';

const POS = lazy(() => import('../../apps/pos'));
const MobilePOS = lazy(() => import('../../apps/pos/mobile/Pos'));
const CustomerScreen = lazy(() => import('../../apps/pos/CustomerScreen'));
const SessionScreen = lazy(() => import('../../apps/pos/SessionScreen'));
const PosReportScreen = lazy(() => import('../../apps/pos/ReportScreen'));
const PosOrderScreen = lazy(() => import('../../apps/pos/OrderScreen'));
const CartScreen = lazy(() => import('../../apps/pos/Cart'));
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

const InPosRoute: React.FunctionComponent = ({ children }) => {
  const location = useLocation();
  const inPosRoute = location.pathname.startsWith('/pos');
  if (!inPosRoute) {
    return null;
  }
  return <>{children}</>;
};

export const Routes: React.FunctionComponent = () => {
  const { isMobile } = usePreference();
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Redirect exact from="/" to="pos" />
          <Route path="/login" component={Login} />
          <RequireLogin>
            <InPosRoute>
              <DataProvider>
                <OrderManager>
                  <Route
                    path="/pos"
                    exact
                    component={isMobile ? MobilePOS : POS}
                  />

                  <Route path="/pos/cart" component={CartScreen} />
                  <Route
                    path="/pos/customer_screen"
                    component={CustomerScreen}
                  />
                  <Route path="/pos/session" component={SessionScreen} />
                  <Route path="/pos/report" component={PosReportScreen} />
                  <Route
                    path="/pos/orders/:orderId"
                    component={PosOrderScreen}
                  />
                </OrderManager>
              </DataProvider>
            </InPosRoute>

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
};

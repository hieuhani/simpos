import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { PrivateRoute } from '../../components/PrivateRoute';
import { DataProvider } from '../../contexts/DataProvider';
import { OrderManager } from '../../contexts/OrderManager';

const POS = lazy(() => import('../../apps/pos'));
const Login = lazy(() => import('../../apps/auth/Login'));

const Purchase = lazy(() => import('../../apps/purchase'));

export const Routes: React.FunctionComponent = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Redirect exact from="/" to="pos" />
        <Route path="/login" component={Login} />
        <DataProvider>
          <OrderManager>
            <PrivateRoute path="/pos">
              <POS />
            </PrivateRoute>
          </OrderManager>
          <PrivateRoute path="/purchase">
            <Purchase />
          </PrivateRoute>
        </DataProvider>
      </Switch>
    </Suspense>
  </Router>
);

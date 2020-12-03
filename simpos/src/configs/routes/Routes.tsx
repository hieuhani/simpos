import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { PrivateRoute } from '../../components/PrivateRoute';
import { DataProvider } from '../../contexts/DataProvider';

const POS = lazy(() => import('../../apps/pos'));
const Login = lazy(() => import('../../apps/auth/Login'));

export const Routes: React.FunctionComponent = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Redirect exact from="/" to="pos" />
        <Route path="/login" component={Login} />
        <DataProvider>
          <PrivateRoute path="/pos">
            <POS />
          </PrivateRoute>
        </DataProvider>
      </Switch>
    </Suspense>
  </Router>
);

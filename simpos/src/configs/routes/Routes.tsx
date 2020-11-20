import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { Login } from '../../apps/auth/Login';

const POS = lazy(() => import('../../apps/pos'));

export const Routes: React.FunctionComponent = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Redirect exact from="/" to="pos" />
        <Route path="/login" component={Login} />
        <Route path="/pos" component={POS} />
      </Switch>
    </Suspense>
  </Router>
);

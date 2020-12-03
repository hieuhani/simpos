import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';

export interface PrivateRouteProps extends RouteProps {}
export const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = ({
  children,
  ...rest
}) => {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

export const PrivateRoute: React.FunctionComponent = ({
  children,
  ...rest
}) => {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.userMeta ? (
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

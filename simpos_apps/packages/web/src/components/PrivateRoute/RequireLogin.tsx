import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';

export const RequireLogin: React.FunctionComponent = ({ children }) => {
  const auth = useAuth();
  if (auth.isLoggedIn) {
    return <>{children}</>;
  }
  return (
    <Redirect
      to={{
        pathname: '/login',
      }}
    />
  );
};

import React, { createContext, useContext, useState } from 'react';

export interface AuthUser {
  id: string;
}

export interface AuthContextState {
  signIn: (cb: any) => void | Promise<void>;
  signOut: (cb: any) => void | Promise<void>;
  user?: AuthUser;
  isLoggedIn: boolean;
}

const initialState: AuthContextState = {
  signIn: () => {
    throw new Error('unimplemented signIn method');
  },
  signOut: () => {
    throw new Error('unimplemented signOut method');
  },
  user: undefined,
  isLoggedIn: false,
};

const AuthContext = createContext<AuthContextState>(initialState);

export const AuthProvider: React.FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<AuthUser | undefined>();

  const signIn = () => {
    console.log('signIn');
  };
  const signOut = () => {
    console.log('signUp');
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

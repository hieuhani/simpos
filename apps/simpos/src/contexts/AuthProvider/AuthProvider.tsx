import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { authService } from '../../services/auth';
import { updateSimApiToken } from '../../services/clients';
import { AuthUserMeta } from '../../services/db';

export interface AuthContextState {
  signIn: (authUserMeta: AuthUserMeta) => void | Promise<void>;
  signOut: (cb?: any) => void | Promise<void>;
  userMeta?: AuthUserMeta;
  isLoggedIn: boolean;
}

const initialState: AuthContextState = {
  signIn: () => {
    console.error('unimplemented signIn method');
  },
  signOut: () => {
    console.error('unimplemented signOut method');
  },
  userMeta: undefined,
  isLoggedIn: false,
};

const AuthContext = createContext<AuthContextState>(initialState);

export const AuthProvider: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [userMeta, setUserMeta] = useState<AuthUserMeta | undefined>();
  const [authChecking, setAuthChecking] = useState(true);
  const signIn = async (authUserMeta: AuthUserMeta) => {
    await authService.saveAuthMeta(authUserMeta);
    setUserMeta(authUserMeta);
    window.location.href = '/';
  };
  const signOut = async () => {
    await authService.clearLogin();
    window.location.href = '/login';
  };

  const getCurrentAuthMeta = async () => {
    const authMeta = await authService.getAuthMeta();
    if (authMeta) {
      const meta = authMeta as AuthUserMeta;
      setUserMeta(meta);
      updateSimApiToken(meta);
    }
    setAuthChecking(false);
  };
  useEffect(() => {
    getCurrentAuthMeta();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        userMeta,
        isLoggedIn: !!userMeta,
      }}
    >
      {!authChecking && children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

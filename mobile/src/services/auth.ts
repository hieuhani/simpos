import { simApi } from "./clients";
import { LocalStorage } from "./clients/local-storage";

const AUTH_META_KEY = "auth_meta";

export interface AuthUserContext {
  lang: string;
  tz: string;
}

export interface AuthUserMeta {
  uid: number;
  accessToken: string;
  name: string;
  dbName: string;
  username: string;
  userContext: AuthUserContext;
}

export interface LoginParams {
  login: string;
  password: string;
}

export const authService = {
  login: (params: LoginParams) => {
    return simApi.post("/exchange_token", {
      params,
    });
  },
  saveAuthMeta: async (authMeta: AuthUserMeta) => {
    await LocalStorage.setItem(AUTH_META_KEY, authMeta);
  },
  getAuthMeta: async () => LocalStorage.getItem<AuthUserMeta>(AUTH_META_KEY),
};

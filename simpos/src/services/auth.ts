import { simApi } from './clients';
import { authUserMeta, AuthUserMeta } from './db/authUserMeta';

export interface LoginParams {
  login: string;
  password: string;
}

export const authService = {
  login: (params: LoginParams) => {
    return simApi.post('/exchange_token', {
      params,
    });
  },
  saveAuthMeta: async (authMeta: AuthUserMeta) => {
    await authUserMeta.create(authMeta);
  },
  getAuthMeta: async () => authUserMeta.first(),
  clearLogin: async () => authUserMeta.clear(),
};

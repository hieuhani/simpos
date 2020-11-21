import { db, simApi } from './clients';

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
  saveAuthMeta: async (authMeta: object) => {
    await db.setItem('authMeta', authMeta);
  },
  getAuthMeta: async () => db.getItem('authMeta'),
};

import { simApi } from './clients';
import { AuthUserContext, authUserMeta, AuthUserMeta } from './db/authUserMeta';

export interface LoginParams {
  login: string;
  password: string;
}
export interface PosMetadataParams {
  config_id?: number;
}

export interface SessionInfo {
  userContext: AuthUserContext;
}
export interface ServerMetadata {
  loginNumber: number;
  sessionInfo: SessionInfo;
}

export const authService = {
  login: (params: LoginParams) => {
    return simApi.post(
      '/exchange_token',
      {
        params,
      },
    );
  },
  saveAuthMeta: async (authMeta: AuthUserMeta) => {
    await authUserMeta.create(authMeta);
  },
  getAuthMeta: async () => authUserMeta.first(),
  clearLogin: async () => authUserMeta.clear(),

  refreshMetadata: async (
    params: PosMetadataParams,
  ): Promise<ServerMetadata> => {
    const data: ServerMetadata = await simApi.post('/pos_metadata', {
      params,
    });

    await authUserMeta.update({
      userContext: data.sessionInfo.userContext,
    });
    return data;
  },
};

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
    // const data: ServerMetadata = await simApi.post('/pos_metadata', {
    //   params,
    // });

    // await authUserMeta.update({
    //   userContext: data.sessionInfo.userContext,
    // });
    // console.log("data", data)
    // return data;
    return [{
      "sessionInfo": {
        "uid": null,
        "isSystem": false,
        "isAdmin": false,
        "userContext": {
          "allowedCompanyIds": [
            1
          ]
        },
        "db": "chateraise",
        "serverVersion": "13.0-20221010",
        "serverVersionInfo": [
          13,
          0,
          0,
          "final",
          0,
          ""
        ],
        "name": "Jun",
        "username": "info@tranvanphuong.com",
        "partnerDisplayName": "Jun",
        "companyId": null,
        "partnerId": null,
        "webBaseUrl": "https://pos-demo.wintax.vn",
        "maxFileUploadSize": 134217728,
        "userCompanies": {
          "currentCompany": [
            1,
            "Gio Family"
          ],
          "allowedCompanies": [
            [
              1,
              "Gio Family"
            ]
          ]
        },
        "currencies": {
          "1": {
            "symbol": "€",
            "position": "after",
            "digits": [
              69,
              2
            ]
          },
          "2": {
            "symbol": "$",
            "position": "before",
            "digits": [
              69,
              2
            ]
          },
          "23": {
            "symbol": "₫",
            "position": "after",
            "digits": [
              69,
              0
            ]
          }
        },
        "showEffect": "True",
        "displaySwitchCompanyMenu": false,
        "cacheHashes": {
          "loadMenus": "7293db36dc7acb5894d32c21d558e455ed6bf510",
          "qweb": "1e1478a1ea3ab007999c5f03be412902dbc9a2cc",
          "translations": "05071fb879321bf01f941f60fab1f126f565cdad"
        },
        "maxTimeBetweenKeysInMs": 500,
        "outOfOfficeMessage": false,
        "odoobotInitialized": true
      },
      "loginNumber": 719
    }];
  },
};

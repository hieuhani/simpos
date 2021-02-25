import axios from 'axios';
import get from 'lodash.get';
import camelcaseKeys from 'camelcase-keys';
import { AuthUserMeta } from '../db';

const defaultProtocol = 'https';
const defaultUrl = 'localhost';

export const getBaseApiUrl = (): string => {
  let baseUrl = process.env.REACT_APP_BASE_API_URL || defaultUrl;
  if (baseUrl.startsWith('http')) {
    return baseUrl;
  }
  return `${defaultProtocol}://${baseUrl}`;
};

export const buildTenantBaseApiUrl = (tenant: string) => {
  const url = new URL(getBaseApiUrl());
  return `${url.protocol}//${tenant}.${url.host}${url.pathname}`;
};

export const simApi = axios.create({
  baseURL: getBaseApiUrl(),
});

simApi.interceptors.response.use(
  async function (response) {
    if (response.data.error) {
      throw new Error(
        get(response, 'data.error.data.message', 'Request error'),
      );
    }

    return camelcaseKeys(get(response, 'data.result', {}), {
      deep: true,
    });
  },
  function (error) {
    if (error.response?.data?.includes('odoo.http.SessionExpiredException')) {
      throw new Error('Unauthorized error');
    }
    throw new Error('Uncaught error');
  },
);

export const updateSimApiToken = (meta: AuthUserMeta) => {
  if (!meta.accessToken) {
    console.warn('token is blank or undefined');
  }
  simApi.defaults.baseURL = buildTenantBaseApiUrl(meta.dbName);
  simApi.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${meta.accessToken}`;
};

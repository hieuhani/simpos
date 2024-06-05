import axios from 'axios';
import get from 'lodash.get';
import camelcaseKeys from 'camelcase-keys';
import { AuthUserMeta } from '../db';

export const simApi = axios.create({
  baseURL: 'https://pos-demo.wintax.vn',
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
  simApi.defaults.headers.common['Authorization'] =
    `Bearer ${meta.accessToken}`;
};

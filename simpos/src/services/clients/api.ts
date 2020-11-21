import axios from 'axios';
import get from 'lodash.get';
import camelcaseKeys from 'camelcase-keys';

export const simApi = axios.create({
  baseURL: 'http://localhost:3000',
});

simApi.interceptors.response.use(
  function (response) {
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
    if (error.response?.data.includes('odoo.http.SessionExpiredException')) {
      throw new Error('Unauthorized error');
    }
    throw new Error('Uncaught error');
  },
);

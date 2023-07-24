import { dataService } from './data';

export const posConfigService = {
  createSession(configId: number) {
    return dataService.call('pos.config', 'open_session_cb', [[configId]], {});
  },
};

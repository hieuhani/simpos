import { dataService } from './data';

export const orderService = {
  createOrders(args: any[]) {
    return dataService.call('pos.order', 'create_from_ui', args, {});
  },
};

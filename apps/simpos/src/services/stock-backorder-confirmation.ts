import { dataService } from './data';

export const stockBackorderConfirmationService = {
  cancelBackorder(id: number) {
    return dataService.call(
      'stock.backorder.confirmation',
      'process_cancel_backorder',
      [[id]],
      {},
    );
  },
  processBackorder(id: number) {
    return dataService.call(
      'stock.backorder.confirmation',
      'process',
      [[id]],
      {},
    );
  },
};

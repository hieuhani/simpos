import { dataService } from './data';
import { RemotePosPayment } from './order';

export const posPaymentService = {
  getPayments(lineIds: number[]): Promise<RemotePosPayment[]> {
    return dataService.call(
      'pos.payment',
      'read',
      [lineIds, ['currency_id', 'payment_date', 'payment_method_id', 'amount']],
      {},
    );
  },
};

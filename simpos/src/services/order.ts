import { dataService } from './data';

export interface RemotePosOrder {
  id: number;
  cashier: string;
  amountTotal: number;
  dateOrder: string;
  name: string;
  partnerId?: [number, string];
  posReference: string;
  state: 'draft' | 'cancel' | 'paid' | 'done' | 'invoiced';
}

export interface RemotePaymentGroup {
  amount: number;
  paymentMethodId: [number, string];
  paymentMethodIdCount: number;
}

export interface RemotePosPayment {
  id: number;
  amount: number;
  currencyId: [number, string];
  paymentDate: string;
  paymentMethodId: [number, string];
  posOrderId: [number, string];
}

export const orderService = {
  createOrders(args: any[]) {
    return dataService.call('pos.order', 'create_from_ui', args, {});
  },
  getSessionOrders(sessionId: number) {
    return dataService.searchRead({
      model: 'pos.order',
      fields: [
        'state',
        'name',
        'date_order',
        'pos_reference',
        'partner_id',
        'cashier',
        'amount_total',
      ],
      domain: [['session_id', 'in', [sessionId]]],
      limit: 200,
    });
  },
  getSessionPaymentGroups(sessionId: number) {
    return dataService.call('pos.payment', 'web_read_group', [], {
      domain: [['session_id', '=', sessionId]],
      fields: [
        'currency_id',
        'payment_date',
        'payment_method_id',
        'pos_order_id',
        'amount',
      ],
      groupby: ['payment_method_id'],
      lazy: true,
      limit: 80,
    });
  },
  getSessionPayments(sessionId: number, paymentMethodId: number) {
    return dataService.searchRead({
      model: 'pos.payment',
      fields: [
        'amount',
        'pos_order_id',
        'payment_method_id',
        'payment_date',
        'currency_id',
      ],
      domain: [
        '&',
        ['payment_method_id', '=', [paymentMethodId]],
        ['session_id', '=', [sessionId]],
      ],
      limit: 200,
    });
  },
};

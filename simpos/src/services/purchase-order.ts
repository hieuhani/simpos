import { dataService } from './data';

export const purchaseOrderService = {
  getPurchaseOrders(domain: Array<Array<any> | string> = []) {
    return dataService.searchRead({
      model: 'purchase.order',
      fields: [
        'message_unread',
        'partner_ref',
        'name',
        'date_order',
        'date_approve',
        'partner_id',
        'company_id',
        'date_planned',
        'user_id',
        'origin',
        'amount_untaxed',
        'amount_total',
        'currency_id',
        'state',
        'invoice_status',
      ],
      domain,
      limit: 200,
    });
  },
};

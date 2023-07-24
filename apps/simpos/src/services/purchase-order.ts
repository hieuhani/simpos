import { dataService } from './data';
import { PurchaseOrder } from './db';

export interface DefaultPurchaseOrder {
  companyId: number;
  currencyId: number;
  dateOrder: string;
  invoiceCount: number;
  invoiceStatus: string;
  name: string;
  pickingCount: number;
  pickingTypeId: number;
  state: string;
  userId: number;
}

interface PurchaseOrderLine {
  productId: number;
  name: string;
  datePlanned: string;
  productQty: number;
  priceUnit: number;
  productUom: number;
}

export interface PurchaseOrderPayload {
  currencyId: number;
  dateOrder: string;
  companyId: number;
  pickingTypeId: number;
  userId: number;
  partnerId: number;
  lines: PurchaseOrderLine[];
}

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
  defaultGet(): Promise<DefaultPurchaseOrder> {
    return dataService.call(
      'purchase.order',
      'default_get',
      [
        [
          'state',
          'invoice_count',
          'invoice_ids',
          'picking_count',
          'picking_ids',
          'name',
          'partner_id',
          'partner_ref',
          'currency_id',
          'is_shipped',
          'date_order',
          'date_approve',
          'origin',
          'company_id',
          'order_line',
          'amount_untaxed',
          'amount_tax',
          'amount_total',
          'notes',
          'date_planned',
          'picking_type_id',
          'dest_address_id',
          'default_location_dest_id_usage',
          'incoterm_id',
          'user_id',
          'invoice_status',
          'payment_term_id',
          'fiscal_position_id',
          'message_follower_ids',
          'activity_ids',
          'message_ids',
          'message_attachment_count',
        ],
      ],
      {},
    );
  },
  confirmPurchaseOrder(purchaseOrderId: number) {
    return dataService.call(
      'purchase.order',
      'button_confirm',
      [[purchaseOrderId]],
      {},
    );
  },
  cancelPurchaseOrder(purchaseOrderId: number) {
    return dataService.call(
      'purchase.order',
      'button_cancel',
      [[purchaseOrderId]],
      {},
    );
  },
  findByName(name: string) {
    return dataService
      .searchRead({
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
        domain: [['name', '=', name]],
        limit: 1,
      })
      .then((entities: any) => {
        if (Array.isArray(entities) && entities.length > 0) {
          return entities[0];
        }
        return null;
      });
  },
  lockPurchaseOrder(purchaseOrderId: number) {
    return dataService.call(
      'purchase.order',
      'button_done',
      [[purchaseOrderId]],
      {},
    );
  },
  getPicking(purchaseOrderId: number) {
    return dataService.callButton(
      'purchase.order',
      'action_view_picking',
      [[purchaseOrderId]],
      {},
    );
  },
  create(payload: PurchaseOrderPayload) {
    return dataService.call(
      'purchase.order',
      'create',
      [
        {
          currency_id: payload.currencyId,
          date_order: payload.dateOrder,
          company_id: payload.companyId,
          picking_type_id: payload.pickingTypeId,
          user_id: payload.userId,
          partner_id: payload.partnerId,
          partner_ref: false,
          origin: false,
          order_line: payload.lines.map((line, index) => [
            0,
            `virtual_${index}`,
            {
              display_type: false,
              sequence: 10,
              state: false,
              product_id: line.productId,
              name: line.name,
              date_planned: line.datePlanned,
              account_analytic_id: false,
              product_qty: line.productQty,
              qty_received_manual: 0,
              product_uom: line.productUom,
              price_unit: line.priceUnit,
              taxes_id: [[6, false, [1]]],
            },
          ]),
          notes: false,
          date_planned: false,
          dest_address_id: false,
          incoterm_id: false,
          payment_term_id: false,
          fiscal_position_id: false,
          message_attachment_count: 0,
        },
      ],
      {},
    );
  },
  getPurchaseOrder(purchaseOrderId: number): Promise<PurchaseOrder | null> {
    return dataService
      .call(
        'purchase.order',
        'read',
        [
          [purchaseOrderId],
          [
            'state',
            'invoice_count',
            'invoice_ids',
            'picking_count',
            'picking_ids',
            'name',
            'partner_id',
            'partner_ref',
            'currency_id',
            'is_shipped',
            'date_order',
            'date_approve',
            'origin',
            'company_id',
            'order_line',
            'amount_untaxed',
            'amount_tax',
            'amount_total',
            'notes',
            'date_planned',
            'picking_type_id',
            'dest_address_id',
            'default_location_dest_id_usage',
            'incoterm_id',
            'user_id',
            'invoice_status',
            'payment_term_id',
            'fiscal_position_id',
            'message_follower_ids',
            'activity_ids',
            'message_ids',
            'message_attachment_count',
            'display_name',
          ],
        ],
        {},
      )
      .then((entities: any) => {
        if (Array.isArray(entities) && entities.length > 0) {
          return entities[0];
        }
        return null;
      });
  },
};

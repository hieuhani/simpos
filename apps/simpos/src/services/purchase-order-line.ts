import { dataService } from './data';

export const purchaseOrderLineService = {
  getPurhcaseOrderLines(lineIds: number[]) {
    return dataService.call(
      'purchase.order.line',
      'read',
      [
        lineIds,
        [
          'display_type',
          'currency_id',
          'state',
          'product_type',
          'product_uom_category_id',
          'invoice_lines',
          'sequence',
          'product_id',
          'name',
          'date_planned',
          'move_dest_ids',
          'account_analytic_id',
          'analytic_tag_ids',
          'product_qty',
          'qty_received_manual',
          'qty_received_method',
          'qty_received',
          'qty_invoiced',
          'product_uom',
          'price_unit',
          'taxes_id',
          'price_subtotal',
        ],
      ],
      {},
    );
  },
};

export interface PurchaseOrderLine {
  id: number;
  currencyId: [number, string];
  datePlanned: string;
  displayType: false;
  invoiceLines: [];
  moveDestIds: [];
  name: string;
  priceSubtotal: number;
  priceUnit: number;
  productId: [number, string];
  productQty: number;
  productUom: [number, string];
  productUomCategoryId: [number, string];
  qtyInvoiced: number;
  qtyReceived: number;
  qtyReceivedManual: number;
  qtyReceivedMethod: 'stock_moves' | 'manual';
  sequence: number;
  state: 'draft' | 'sent' | 'to approve' | 'purchase' | 'done' | 'cancel';
}

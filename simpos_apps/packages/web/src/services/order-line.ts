import { dataService } from './data';

export interface RemotePosOrderLine {
  id: number;
  productId: [number, string];
  priceUnit: number;
  qty: number;
  priceSubtotalIncl: number;
}

export const orderLineService = {
  getOrderLines(lineIds: number[]): Promise<RemotePosOrderLine[]> {
    return dataService.call(
      'pos.order.line',
      'read',
      [
        lineIds,
        [
          'product_id',
          'pack_lot_ids',
          'qty',
          'product_uom_id',
          'price_unit',
          'discount',
          'tax_ids_after_fiscal_position',
          'tax_ids',
          'price_subtotal',
          'price_subtotal_incl',
        ],
      ],
      {},
    );
  },
};

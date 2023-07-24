import { dataService } from './data';

export interface StockMove {
  id: number;
  companyId: [number, string];
  dateExpected: string;
  descriptionPicking: string;
  name: string;
  warehouseId: [number, string];
  productId: [number, string];
  quantityDone: number;
  productUomQty: number;
  locationId: [number, string];
  productUom: [number, string];
  state: string;
  moveLineNosuggestIds: number[];
}

export const stockMoveService = {
  getStockMovesByIds(moveIds: number[]) {
    return dataService.read({
      model: 'stock.move',
      ids: moveIds,
      fields: [
        'company_id',
        'name',
        'state',
        'picking_type_id',
        'location_id',
        'location_dest_id',
        'scrapped',
        'picking_code',
        'product_type',
        'show_details_visible',
        'show_reserved_availability',
        'show_operations',
        'additional',
        'has_move_lines',
        'is_locked',
        'product_uom_category_id',
        'has_tracking',
        'display_assign_serial',
        'product_id',
        'description_picking',
        'date_expected',
        'is_initial_demand_editable',
        'is_quantity_done_editable',
        'product_uom_qty',
        'reserved_availability',
        'quantity_done',
        'product_uom',
        'move_line_nosuggest_ids',
      ],
    });
  },
  write(moveId: number, data: unknown) {
    return dataService.call('stock.move', 'write', [moveId, data], {});
  },
};

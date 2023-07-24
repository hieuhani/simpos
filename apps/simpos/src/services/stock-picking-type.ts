import { dataService } from './data';

export interface StockPickingType {
  id: number;
  barcode: string;
  code: string;
  name: string;
  displayName: string;
  warehouseId: [number, string];
}

export const stockPickingTypeService = {
  getStockPickingTypes(domain: Array<Array<any> | string> = []) {
    return dataService.searchRead({
      model: 'stock.picking.type',
      fields: [],
      domain,
      limit: 200,
    });
  },
  getIncommingStockPickingTypes(): Promise<StockPickingType[]> {
    return this.getStockPickingTypes([['code', '=', 'incoming']]);
  },
};

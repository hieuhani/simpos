import { dataService } from './data';

export interface ProductProduct {
  id: number;
  defaultCode: string;
  barcode?: string;
  name: string;
  lstPrice: number;
  qtyAvailable: number;
}

export const productService = {
  getProducts(domain: Array<Array<any> | string> = []) {
    return dataService.searchRead({
      model: 'product.product',
      fields: [
        'default_code',
        'barcode',
        'name',
        'product_template_attribute_value_ids',
        'lst_price',
        'standard_price',
        'categ_id',
        'type',
        'price',
        'qty_available',
        'purchase_ok',
        'pos_categ_id',
      ],
      domain,
      limit: 200,
    });
  },
};

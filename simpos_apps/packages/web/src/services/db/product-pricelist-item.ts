import { db } from './db';

export interface ProductPricelistItem {
  id: number;
  productId: [number, string];
  computePrice: 'fixed';
  fixedPrice: number
}

export const productPricelistItemRepository = {
  db: db.table<ProductPricelistItem>('product.pricelist.item'),
};

import { db } from './db';

export interface ProductPricelistItem {
  id: number;
}

export const productPricelistItemRepository = {
  db: db.table<ProductPricelistItem>('product.pricelist.item'),
};

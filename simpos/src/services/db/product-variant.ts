import { db } from './db';

export interface ProductVariant {
  id: number;
  name: string;
  lstPrice: number;
}

export const productVariantRepository = {
  db: db.table<ProductVariant>('product.product'),
};

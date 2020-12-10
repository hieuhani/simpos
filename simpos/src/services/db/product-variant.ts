import { db } from './db';

export interface ProductVariant {
  id: number;
  defaultCode: string;
  displayName: string;
  lstPrice: number;
  taxesId: number[];
}

export const productVariantRepository = {
  db: db.table<ProductVariant>('product.product'),
};

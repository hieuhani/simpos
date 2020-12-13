import { db } from './db';

export interface ProductVariant {
  id: number;
  defaultCode: string;
  displayName: string;
  name: string;
  lstPrice: number;
  taxesId: number[];
  uomId: [number, string];
  tracking: 'lot' | 'none' | 'serial';
}

export const productVariantRepository = {
  db: db.table<ProductVariant>('product.product'),
  async findById(id: number): Promise<ProductVariant | undefined> {
    return this.db.get(id);
  },
};

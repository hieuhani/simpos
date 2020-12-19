import { SizedImages } from '../../types';
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
  images?: SizedImages;
}

export const productVariantRepository = {
  db: db.table<ProductVariant>('product.product'),
  async all(): Promise<ProductVariant[]> {
    return this.db.toArray();
  },
  async findById(id: number): Promise<ProductVariant | undefined> {
    return this.db.get(id);
  },
  update(id: number, order: Partial<ProductVariant>): Promise<number> {
    return this.db.update(id, order);
  },
};

import { db } from './db';

export interface Product {
  id: number;
  name: string;
  sequence: number;
  barcode: string;
  defaultCode: string;
  description: string;
  lstPrice: number;
  productVariantIds: number[];
  posCategoryId: number;
}

export const productRepository = {
  db: db.table<Product>('product.template'),

  async all(): Promise<Product[]> {
    return this.db.toArray();
  },

  async findProducts(categoryId?: number, keyword = ''): Promise<Product[]> {
    if (categoryId) {
      return this.db.where('posCategoryId').equals(categoryId).toArray();
    }
    return this.db.toArray();
  },
};

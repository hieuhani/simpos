import { db } from './db';
import {
  ProductPricelistItem,
  productPricelistItemRepository,
} from './product-pricelist-item';

export interface ProductPricelist {
  id: number;
  name: string;
  displayName: string;
  discountPolicy: 'with_discount' | 'without_discount';
  items: ProductPricelistItem[];
}

export const productPricelistRepository = {
  db: db.table<ProductPricelist>('product.pricelist'),
  async findByIds(ids: number[]): Promise<ProductPricelist[]> {
    const pricelists = await this.db.where('id').anyOf(ids).toArray();
    return this.enrichProductPricelist(pricelists);
  },
  async enrichProductPricelist(
    productPricelists: ProductPricelist[],
  ): Promise<ProductPricelist[]> {
    return Promise.all(
      productPricelists.map((productPricelist) =>
        productPricelistItemRepository.db
          .where('pricelistId')
          .equals(productPricelist.id)
          .toArray()
          .then((items) => ({
            ...productPricelist,
            items,
          })),
      ),
    );
  },
};

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

  async findById(id: number): Promise<ProductPricelist | undefined> {
    const pricelist = await this.db.get(id);
    if (!pricelist) {
      return undefined;
    }

    const pricelistItems = await productPricelistItemRepository.db
      .where('pricelistIdInt')
      .equals(pricelist.id)
      .toArray();

    return {
      ...pricelist,
      items: pricelistItems,
    };
  },

  async findByIds(ids: number[]): Promise<ProductPricelist[]> {
    const pricelists = await this.db.where('id').anyOf(ids).toArray();
    return this.enrichProductPricelists(pricelists);
  },
  async enrichProductPricelists(
    productPricelists: ProductPricelist[],
  ): Promise<ProductPricelist[]> {
    return Promise.all(
      productPricelists.map((productPricelist) =>
        productPricelistItemRepository.db
          .where('pricelistIdInt')
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

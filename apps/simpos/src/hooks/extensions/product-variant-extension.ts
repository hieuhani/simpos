import { DataContextState } from '../../contexts/DataProvider';
import { ProductVariant } from '../../services/db';
import { ProductPricelist } from '../../services/db/product-pricelist';

export class ProductVariantExtension {
  constructor(
    private readonly productVariant: ProductVariant,
    private readonly globalData: DataContextState,
  ) {}

  getPrice(pricelist: ProductPricelist, quantity: number) {}
}

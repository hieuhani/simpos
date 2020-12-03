import { useData } from '../contexts/DataProvider';
import { ProductVariant } from '../services/db';
import { ProductPricelist } from '../services/db/product-pricelist';

interface ProductVariantExtensions {
  getPrice: (pricelist?: ProductPricelist, quantity?: number) => number;
}
export function useProductVariantExtensions(
  productVariant: ProductVariant,
): ProductVariantExtensions {
  const data = useData();
  return {
    getPrice(_pricelist = data?.defaultPriceList, _quantity = 1) {
      // TODO: hopefully we are growth enough to return to update this function
      // to simplify this phase, we don't care about product category
      // we assume that we always use the default pricelist
      return productVariant.lstPrice;
    },
  };
}

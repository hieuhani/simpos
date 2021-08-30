import { DataContextState } from "../../contexts/DataProvider";
import { AccountTax, ProductVariant } from "../../services/db";
import { computeAll } from "./tax";

export function getPrice(productVariant: ProductVariant,  quantity = 1, data: DataContextState): number {
  const pricelist = data.defaultPriceList
  // TODO: hopefully we are growth enough to return to update this function
  // to simplify this phase, we don't care about product category
  // we assume that we always use the default pricelist
  if (pricelist) {
    const pricelistItems = pricelist.items.filter(
      (item) => item.productId[0] === productVariant.id,
    );
    const price =
      pricelistItems[0] &&
      pricelistItems[0].computePrice === 'fixed' &&
      pricelistItems[0].fixedPrice;

    if (price) {
      if (data.posConfig.ifaceTaxIncluded === 'total') {
        const { taxesId } = productVariant;
        let productTaxes: AccountTax[] = [];

        taxesId.forEach((taxId) => {
          const tax = data.taxes.find(({ id }) => id === taxId);

          if (tax) {
            productTaxes.push.apply(productTaxes, [tax]);
          }
        });
        const allTaxes = computeAll(
          productTaxes,
          price,
          quantity,
          data.posConfig.currency.rounding,
          true,
          data,
        );
        return allTaxes.totalIncluded;
      } else {
        return price;
      }
    }
  }

  return productVariant.lstPrice;
}

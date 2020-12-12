import keyBy from 'lodash.keyby';
import { useMemo } from 'react';
import uniqBy from 'lodash.uniqby';
import { useData } from '../contexts/DataProvider';
import { AccountTax, DecimalPrecision, OrderLine } from '../services/db';
import { DictionaryOf } from '../types';
import { roundDecimals, roundPrecision } from '../utils';

interface OrderLineExtensions {
  getUnitDisplayPrice: () => number;
  getUnitPrice: () => number;
  getLstPrice: () => number;
  getDisplayPrice: () => number;
  getPriceWithoutTax: () => number;
}

interface TaxValue {
  id: number;
  name: string;
  amount: number;
  base: number;
}

interface ComputedTax {
  taxes: TaxValue[];
  totalExcluded: number;
  totalIncluded: number;
}

interface AllPrice {
  priceWithTax: number;
  priceWithoutTax: number;
  priceWithTaxBeforeDiscount: number;
  tax: number;
  taxDetails: Record<number, number>;
}

export function useOrderLineExtensions(
  orderLine: OrderLine,
): OrderLineExtensions {
  const data = useData();
  const decimalPrecisionsDict = useMemo<DictionaryOf<DecimalPrecision>>(
    () => keyBy(data.decimalPrecisions, 'name'),
    [data.decimalPrecisions],
  );

  function getUnitPrice(): number {
    const digits = decimalPrecisionsDict['Product Price']?.digits || 2;
    return parseFloat(
      roundDecimals(orderLine.priceUnit || 0, digits).toFixed(digits),
    );
  }

  function getUnitDisplayPrice() {
    if (data.posConfig.ifaceTaxIncluded === 'total') {
    }
    return getUnitPrice();
  }

  function getLstPrice(): number {
    return orderLine.productVariant!.lstPrice;
  }

  function getBasePrice(): number {
    const rounding = data.posConfig.currency.rounding;
    return roundPrecision(
      getUnitPrice() * orderLine.qty * (1 - orderLine.discount / 100),
      rounding,
    );
  }

  function mapTaxFiscalPosition(tax: AccountTax): AccountTax[] {
    // TODO: check fiscal position
    return [tax];
  }

  function computeAmount(
    tax: AccountTax,
    baseAmount: number,
    quantity: number,
    priceExclude?: boolean,
  ): number {
    const priceInclude =
      priceExclude === undefined ? tax.priceInclude : !priceExclude;

    if (tax.amountType === 'fixed') {
      const sign_base_amount = Math.sign(baseAmount) || 1;
      // Since base amount has been computed with quantity
      // we take the abs of quantity
      // Same logic as bb72dea98de4dae8f59e397f232a0636411d37ce
      return tax.amount * sign_base_amount * Math.abs(quantity);
    }
    if (tax.amountType === 'percent' && !priceInclude) {
      return (baseAmount * tax.amount) / 100;
    }
    if (tax.amountType === 'percent' && priceInclude) {
      return baseAmount - baseAmount / (1 + tax.amount / 100);
    }
    if (tax.amountType === 'division' && !priceInclude) {
      return baseAmount / (1 - tax.amount / 100) - baseAmount;
    }
    if (tax.amountType === 'division' && priceInclude) {
      return baseAmount - baseAmount * (tax.amount / 100);
    }
    return 0;
  }

  function computeAll(
    computingTaxes: AccountTax[],
    priceUnit: number,
    quantity: number,
    currencyRounding: number,
    handlePriceInclude = true,
  ): ComputedTax {
    // 1) Flatten the taxes.
    const collectTaxes = (taxes: AccountTax[]): AccountTax[] => {
      const collectTaxesRecusively = (
        taxes: AccountTax[],
        allTaxes: AccountTax[],
      ): AccountTax[] => {
        taxes.sort((tax1: AccountTax, tax2: AccountTax) => {
          return tax1.sequence - tax2.sequence;
        });

        taxes.forEach((tax) => {
          if (tax.amountType === 'group') {
            allTaxes = collectTaxesRecusively(tax.childrenTaxIds, allTaxes);
          } else {
            allTaxes.push(tax);
          }
        });
        return allTaxes;
      };
      return collectTaxesRecusively(taxes, []);
    };
    const taxes = collectTaxes(computingTaxes);
    // 2) Avoid dealing with taxes mixing price_include=False && include_base_amount=True
    // with price_include=True

    let baseExcludedFlag = false; // price_include=False && include_base_amount=True
    let includedFlag = false; // price_include=True

    taxes.forEach((tax) => {
      if (tax.priceInclude) includedFlag = true;
      else if (tax.includeBaseAmount) baseExcludedFlag = true;
      if (baseExcludedFlag && includedFlag)
        throw new Error(
          'Unable to mix any taxes being price included with taxes affecting the base amount but not included in price.',
        );
    });
    // 3) Deal with the rounding methods

    const roundTax =
      data.company.taxCalculationRoundingMethod !== 'round_globally';
    const initialCurrencyRounding = currencyRounding;
    if (!roundTax) {
      currencyRounding = currencyRounding * 0.00001;
    }
    // 4) Iterate the taxes in the reversed sequence order to retrieve the initial base of the computation.
    const recomputeBase = (
      baseAmount: number,
      fixedAmount: number,
      percentAmount: number,
      divisionAmount: number,
    ) => {
      return (
        (((baseAmount - fixedAmount) / (1.0 + percentAmount / 100.0)) *
          (100 - divisionAmount)) /
        100
      );
    };

    let base = roundPrecision(priceUnit * quantity, initialCurrencyRounding);
    let sign = 1;
    if (base < 0) {
      base = -base;
      sign = -1;
    }

    const totalIncludedCheckpoints: Record<number, number> = {};
    let i = taxes.length - 1;
    let storeIncludedTaxTotal = true;

    let inclFixedAmount = 0.0;
    let inclPercentAmount = 0.0;
    let inclDivisionAmount = 0.0;

    const cachedTaxAmounts: Record<number, number> = {};

    if (handlePriceInclude) {
      taxes.reverse().forEach((tax) => {
        if (tax.includeBaseAmount) {
          base = recomputeBase(
            base,
            inclFixedAmount,
            inclPercentAmount,
            inclDivisionAmount,
          );
          inclFixedAmount = 0.0;
          inclPercentAmount = 0.0;
          inclDivisionAmount = 0.0;
          storeIncludedTaxTotal = true;
        }
        if (tax.priceInclude) {
          if (tax.amountType === 'percent') inclPercentAmount += tax.amount;
          else if (tax.amountType === 'division')
            inclDivisionAmount += tax.amount;
          else if (tax.amountType === 'fixed')
            inclFixedAmount += quantity * tax.amount;
          else {
            const taxAmount = computeAmount(tax, base, quantity);
            inclFixedAmount += taxAmount;
            cachedTaxAmounts[i] = taxAmount;
          }
          if (storeIncludedTaxTotal) {
            totalIncludedCheckpoints[i] = base;
            storeIncludedTaxTotal = false;
          }
        }
        i -= 1;
      });
    }

    const totalExcluded = roundPrecision(
      recomputeBase(
        base,
        inclFixedAmount,
        inclPercentAmount,
        inclDivisionAmount,
      ),
      initialCurrencyRounding,
    );
    let totalIncluded = totalExcluded;

    // 5) Iterate the taxes in the sequence order to fill missing base/amount values.

    base = totalExcluded;
    const taxesVals: TaxValue[] = [];
    i = 0;
    let cumulatedTaxIncludedAmount = 0;

    taxes.reverse().forEach((tax) => {
      let taxAmount;
      if (tax.priceInclude && totalIncludedCheckpoints[i] !== undefined) {
        taxAmount =
          totalIncludedCheckpoints[i] - (base + cumulatedTaxIncludedAmount);
        cumulatedTaxIncludedAmount = 0;
      } else taxAmount = computeAmount(tax, base, quantity, true);

      taxAmount = roundPrecision(taxAmount, currencyRounding);

      if (tax.priceInclude && totalIncludedCheckpoints[i] === undefined)
        cumulatedTaxIncludedAmount += taxAmount;

      taxesVals.push({
        id: tax.id,
        name: tax.name,
        amount: sign * taxAmount,
        base: sign * roundPrecision(base, currencyRounding),
      });

      if (tax.includeBaseAmount) base += taxAmount;

      totalIncluded += taxAmount;
      i += 1;
    });

    return {
      taxes: taxesVals,
      totalExcluded:
        sign * roundPrecision(totalExcluded, data.posConfig.currency.rounding),
      totalIncluded:
        sign * roundPrecision(totalIncluded, data.posConfig.currency.rounding),
    };
  }

  function getAllPrices(): AllPrice {
    const priceUnit = getUnitPrice() * (1.0 - orderLine.discount / 100.0);
    let taxTotal = 0;
    const { taxesId } = orderLine.productVariant!;
    const { taxes } = data;
    const taxDetails: Record<number, number> = {};

    let productTaxes: AccountTax[] = [];

    taxesId.forEach((taxId) => {
      const tax = taxes.find(({ id }) => id === taxId);

      if (tax) {
        productTaxes.push.apply(productTaxes, mapTaxFiscalPosition(tax));
      }
    });
    productTaxes = uniqBy(productTaxes, 'id');
    const allTaxes = computeAll(
      productTaxes,
      priceUnit,
      orderLine.qty,
      data.posConfig.currency.rounding,
    );
    const allTaxesBeforeDiscount = computeAll(
      productTaxes,
      getUnitPrice(),
      orderLine.qty,
      data.posConfig.currency.rounding,
    );

    allTaxesBeforeDiscount.taxes.forEach((tax) => {
      taxTotal += tax.amount;
      taxDetails[tax.id] = tax.amount;
    });
    return {
      priceWithTax: allTaxes.totalIncluded,
      priceWithoutTax: allTaxes.totalExcluded,
      priceWithTaxBeforeDiscount: allTaxesBeforeDiscount.totalIncluded,
      tax: taxTotal,
      taxDetails: taxDetails,
    };
  }

  function getPriceWithTax(): number {
    return getAllPrices().priceWithTax;
  }

  function getDisplayPrice(): number {
    if (data.posConfig.ifaceTaxIncluded === 'total') {
      return getPriceWithTax();
    }
    return getBasePrice();
  }

  function getPriceWithoutTax(): number {
    return getAllPrices().priceWithoutTax;
  }

  return {
    getUnitDisplayPrice,
    getUnitPrice,
    getLstPrice,
    getDisplayPrice,
    getPriceWithoutTax,
  };
}

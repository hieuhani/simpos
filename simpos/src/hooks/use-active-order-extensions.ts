import { useData } from '../contexts/DataProvider';
import { ActiveOrder } from '../contexts/OrderManager';

import { roundPrecision } from '../utils';
import { OrderLineExtension } from './extensions/order-line-extension';

interface OrderExtensions {
  getTotalWithTax: () => number;
  getTotalWithoutTax: () => number;
  getTotalTax: () => number;
  getTotalItems: () => number;
  getTotalDiscount: () => number;
}

export function useActiveOrderExtensions(
  activeOrder: ActiveOrder,
): OrderExtensions {
  const data = useData();

  function getTotalTax(): number {
    if (data.company.taxCalculationRoundingMethod === 'round_globally') {
      // As always, we need:
      // 1. For each tax, sum their amount across all order lines
      // 2. Round that result
      // 3. Sum all those rounded amounts
      const groupTaxes: Record<string, number> = {};
      activeOrder.orderLines.forEach((orderLine) => {
        const orderLineExt = new OrderLineExtension(orderLine, data);
        const taxDetails = orderLineExt.getTaxDetails();

        Object.keys(taxDetails).forEach((taxId) => {
          if (!(taxId in groupTaxes)) {
            groupTaxes[taxId] = 0;
          }
          groupTaxes[taxId] += taxDetails[taxId];
        });
      });

      let sum = 0;
      Object.keys(groupTaxes).forEach((taxId) => {
        const taxAmount = groupTaxes[groupTaxes[taxId]];
        sum += roundPrecision(taxAmount, data.posConfig.currency.rounding);
      });
      return sum;
    }

    return roundPrecision(
      activeOrder.orderLines.reduce((sum, orderLine) => {
        const orderLineExt = new OrderLineExtension(orderLine, data);
        return sum + orderLineExt.getTax();
      }, 0),
      data.posConfig.currency.rounding,
    );
  }

  function getTotalWithoutTax(): number {
    const total = activeOrder.orderLines.reduce((sum, orderLine) => {
      return sum + new OrderLineExtension(orderLine, data).getPriceWithoutTax();
    }, 0);
    return roundPrecision(total, data.posConfig.currency.rounding);
  }

  function getTotalWithTax(): number {
    return getTotalWithoutTax() + getTotalTax();
  }

  function getTotalItems(): number {
    return activeOrder.orderLines.reduce((total, orderLine) => {
      return total + orderLine.qty;
    }, 0);
  }

  function getTotalDiscount(): number {
    const displayDiscountPolicy = activeOrder.order.pricelist?.discountPolicy;
    const totalDiscount = activeOrder.orderLines.reduce((total, orderLine) => {
      const orderLineExtension = new OrderLineExtension(orderLine, data);

      total +=
        orderLineExtension.getUnitPrice() *
        (orderLineExtension.getDiscount() / 100) *
        orderLineExtension.getQuantity();
      if (displayDiscountPolicy === 'without_discount') {
        total +=
          (orderLineExtension.getLstPrice() -
            orderLineExtension.getUnitPrice()) *
          orderLineExtension.getQuantity();
      }
      return total;
    }, 0);
    return roundPrecision(totalDiscount, data.posConfig.currency.rounding);
  }

  return {
    getTotalWithTax,
    getTotalWithoutTax,
    getTotalTax,
    getTotalItems,
    getTotalDiscount,
  };
}

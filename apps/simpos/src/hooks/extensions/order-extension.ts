import { DataContextState } from '../../contexts/DataProvider';
import { ActiveOrder } from '../../contexts/OrderManager';
import { roundPrecision } from '../../utils';
import { OrderLineExtension } from './order-line-extension';

export class ActiveOrderExtension {
  constructor(
    private readonly activeOrder: ActiveOrder,
    private readonly globalData: DataContextState,
  ) {}

  getTotalTax(): number {
    if (
      this.globalData.company.taxCalculationRoundingMethod === 'round_globally'
    ) {
      // As always, we need:
      // 1. For each tax, sum their amount across all order lines
      // 2. Round that result
      // 3. Sum all those rounded amounts
      const groupTaxes: Record<string, number> = {};
      this.activeOrder.orderLines.forEach((orderLine) => {
        const orderLineExt = new OrderLineExtension(orderLine, this.globalData);
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
        sum += roundPrecision(
          taxAmount,
          this.globalData.posConfig.currency.rounding,
        );
      });
      return sum;
    }

    return roundPrecision(
      this.activeOrder.orderLines.reduce((sum, orderLine) => {
        const orderLineExt = new OrderLineExtension(orderLine, this.globalData);
        return sum + orderLineExt.getTax();
      }, 0),
      this.globalData.posConfig.currency.rounding,
    );
  }

  getTotalWithoutTax(): number {
    const total = this.activeOrder.orderLines.reduce((sum, orderLine) => {
      return (
        sum +
        new OrderLineExtension(orderLine, this.globalData).getPriceWithoutTax()
      );
    }, 0);
    return roundPrecision(total, this.globalData.posConfig.currency.rounding);
  }

  getTotalWithTax(): number {
    return this.getTotalWithoutTax() + this.getTotalTax();
  }

  getTotalItems(): number {
    return this.activeOrder.orderLines.reduce((total, orderLine) => {
      return total + orderLine.qty;
    }, 0);
  }

  getTotalDiscount(): number {
    const displayDiscountPolicy = this.activeOrder.order.pricelist
      ?.discountPolicy;
    const totalDiscount = this.activeOrder.orderLines.reduce(
      (total, orderLine) => {
        const orderLineExtension = new OrderLineExtension(
          orderLine,
          this.globalData,
        );

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
      },
      0,
    );
    return roundPrecision(
      totalDiscount,
      this.globalData.posConfig.currency.rounding,
    );
  }
}

import { useData } from '../contexts/DataProvider';
import { ActiveOrder } from '../contexts/OrderManager';
import { roundPrecision } from '../utils';

interface OrderExtensions {
  getTotalWithTax: () => number;
  getTotalWithoutTax: () => number;
  getTotalTax: () => number;
}
export function useActiveOrderExtensions(
  activeOrder: ActiveOrder,
): OrderExtensions {
  const data = useData();
  function getTotalTax(): number {
    return 0;
  }

  function getTotalWithoutTax(): number {
    const total = activeOrder.orderLines.reduce((sum, orderLine) => {
      return sum + 1;
    }, 0);
    return roundPrecision(total, data.posConfig.currency.rounding);
  }

  function getTotalWithTax(): number {
    return getTotalWithoutTax() + getTotalTax();
  }
  return {
    getTotalWithTax,
    getTotalWithoutTax,
    getTotalTax,
  };
}

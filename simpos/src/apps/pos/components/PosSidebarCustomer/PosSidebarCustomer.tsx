import { Box } from '@chakra-ui/react';
import React from 'react';
import { ActiveOrder } from '../../../../contexts/OrderManager';
import { useActiveOrderExtensions, useMoneyFormatter } from '../../../../hooks';
import { OrderPanel } from '../OrderPanel';
import { OrderSummary } from '../OrderSummary/OrderSummary';

export interface PosSidebarProps {
  activeOrder: ActiveOrder;
}

export const PosSidebarCustomer: React.FunctionComponent<PosSidebarProps> = ({
  activeOrder,
}) => {
  const {
    getTotalWithTax,
    getTotalItems,
    getTotalDiscount,
  } = useActiveOrderExtensions(activeOrder);
  const { formatCurrency } = useMoneyFormatter();
  return (
    <>
      <Box flex={1} overflowY="auto">
        <OrderPanel activeOrder={activeOrder} />
      </Box>
      <OrderSummary
        px={4}
        py={2}
        totalAmount={formatCurrency(getTotalWithTax())}
        totalItems={getTotalItems()}
        discount={formatCurrency(getTotalDiscount())}
      />
    </>
  );
};

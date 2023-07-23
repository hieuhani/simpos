import { Box, Stack } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { ActiveOrder } from '../../../../contexts/OrderManager';
import { useActiveOrderExtensions, useMoneyFormatter } from '../../../../hooks';
import { OrderLineRowView } from '../OrderPanel/OrderLineRowView';
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
  const orderLines = useMemo(() => {
    return activeOrder?.orderLines || [];
  }, [activeOrder?.orderLines]);
  return (
    <>
      <Box flex={1} overflowY="auto">
        <Box px="4">
          <Stack spacing={4}>
            {orderLines.map((orderLine) => (
              <OrderLineRowView key={orderLine.id} orderLine={orderLine} />
            ))}
          </Stack>
        </Box>
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

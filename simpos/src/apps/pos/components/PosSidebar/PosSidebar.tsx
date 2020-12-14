import { Stack, Box } from '@chakra-ui/react';
import React from 'react';
import { ActiveOrder } from '../../../../contexts/OrderManager';
import { useActiveOrderExtensions, useMoneyFormatter } from '../../../../hooks';
import {
  CustomerSelectAction,
  VibrationCardAction,
  TableNoAction,
} from '../OrderActions';
import { PaymentAction } from '../OrderActions/PaymentAction';
import { OrderPanel } from '../OrderPanel';
import { OrderSummary } from '../OrderSummary/OrderSummary';
import { SessionBar } from '../SessionBar';

export interface PosSidebarProps {
  activeOrder: ActiveOrder;
}

export const PosSidebar: React.FunctionComponent<PosSidebarProps> = ({
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
      <SessionBar px={4} py={2} />
      <Stack px={4} direction="row" spacing={2} mb={2}>
        <CustomerSelectAction />
        <VibrationCardAction />
        <TableNoAction />
      </Stack>

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

      <Box px={4} py={2}>
        <PaymentAction totalAmount={getTotalWithTax()} />
      </Box>
    </>
  );
};

import React, { useMemo } from 'react';
import { Box, Stack } from '@chakra-ui/react';
import { OrderLineRow } from './OrderLineRow';
import { ActiveOrder } from '../../../../contexts/OrderManager';

export interface OrderPanelProps {
  activeOrder: ActiveOrder;
}

export const OrderPanel: React.FunctionComponent<OrderPanelProps> = ({
  activeOrder,
}) => {
  const orderLines = useMemo(() => {
    return activeOrder?.orderLines || [];
  }, [activeOrder?.orderLines]);
  return (
    <Box px="4">
      <Stack spacing={4}>
        {orderLines.map((orderLine) => (
          <OrderLineRow key={orderLine.id} orderLine={orderLine} />
        ))}
      </Stack>
    </Box>
  );
};

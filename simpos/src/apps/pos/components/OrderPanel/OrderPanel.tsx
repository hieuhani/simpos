import React, { useMemo } from 'react';
import { Box, Stack } from '@chakra-ui/react';
import { OrderLineRow } from './OrderLineRow';
import { useOrderManagerState } from '../../../../contexts/OrderManager';

export const OrderPanel: React.FunctionComponent = () => {
  const { activeOrder } = useOrderManagerState();
  const orderLines = useMemo(() => {
    return activeOrder?.orderLines || [];
  }, [activeOrder?.orderLines]);
  return (
    <Box px="4">
      <Stack spacing={2}>
        {orderLines.map((orderLine) => (
          <OrderLineRow key={orderLine.id} orderLine={orderLine} />
        ))}
      </Stack>
    </Box>
  );
};

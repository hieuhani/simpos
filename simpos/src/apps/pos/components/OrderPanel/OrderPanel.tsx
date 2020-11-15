import React from 'react';
import { Box, Stack } from '@chakra-ui/react';
import { OrderLine } from './OrderLine';

export const OrderPanel: React.FunctionComponent = () => (
  <Box px="4">
    <Stack spacing={2}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <OrderLine key={i} />
      ))}
    </Stack>
  </Box>
);

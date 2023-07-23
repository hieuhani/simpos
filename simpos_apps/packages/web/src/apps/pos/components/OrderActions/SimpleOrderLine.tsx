import React from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';
import { OrderLine } from '../../../../services/db';

export interface OrderLineRowProps {
  orderLine: OrderLine;
}

export const SimpleOrderLine: React.FunctionComponent<OrderLineRowProps> = ({
  orderLine,
}) => {
  if (!orderLine.productVariant) {
    return null;
  }

  return (
    <Flex alignItems="center" py={4} w="full">
      <Box textAlign="left">
        <Heading fontSize="30px" fontWeight="medium">
          {orderLine.qty} x {orderLine.productVariant?.displayName}
        </Heading>
      </Box>
    </Flex>
  );
};

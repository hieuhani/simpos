import React from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';
import { OrderLine } from '../../../../services/db';
import { useMoneyFormatter, useOrderLineExtensions } from '../../../../hooks';

export interface OrderLineRowProps {
  orderLine: OrderLine;
}

export const SimpleOrderLine: React.FunctionComponent<OrderLineRowProps> = ({
  orderLine,
}) => {
  const { formatCurrency } = useMoneyFormatter();
  const { getDisplayPrice } = useOrderLineExtensions(orderLine);

  if (!orderLine.productVariant) {
    return null;
  }

  return (
    <Flex alignItems="center" py={4} w="full">
      <Box textAlign="left">
        <Heading size="sm" fontWeight="medium">
          {orderLine.qty} x {orderLine.productVariant?.displayName}
        </Heading>
      </Box>
      <Box ml="auto">
        <Heading size="sm">
          {formatCurrency(getDisplayPrice(), 'Product Price')}
        </Heading>
      </Box>
    </Flex>
  );
};

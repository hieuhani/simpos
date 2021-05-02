import React, { useEffect, useState } from 'react';
import { Box, Heading, Badge, Flex, Stack } from '@chakra-ui/react';

import { OrderLine } from '../../../../services/db';
import { useMoneyFormatter, useOrderLineExtensions } from '../../../../hooks';
import { ProductImageThumb } from '../ProductCard/ProductImageThumb';

export interface OrderLineRowViewProps {
  orderLine: OrderLine;
}

export const OrderLineRowView: React.FunctionComponent<OrderLineRowViewProps> = ({
  orderLine,
}) => {
  const { formatCurrency } = useMoneyFormatter();
  const { getUnitDisplayPrice, getDisplayPrice } = useOrderLineExtensions(
    orderLine,
  );

  if (!orderLine.productVariant) {
    return null;
  }

  return (
    <Flex
      alignItems="center"
      mt={1}
      py={4}
      px={4}
      w="full"
      rounded="md"
      boxShadow="sm"
      borderRadius="md"
      background="white"
    >
      <Box width="55px" position="relative">
        <ProductImageThumb variant={orderLine.productVariant} />
        <Badge
          position="absolute"
          top="-0.75rem"
          right="-0.75rem"
          backgroundColor="green.500"
          color="white"
          borderRadius="full"
          width={6}
          height={6}
          alignItems="center"
          justifyContent="center"
          display="flex"
        >
          {orderLine.qty}
        </Badge>
      </Box>
      <Box ml={4} textAlign="left">
        <Heading size="sm" fontWeight="medium" mb={1}>
          {orderLine.productVariant?.name}
        </Heading>
        <Stack direction="row">
          {orderLine.productVariant.defaultCode && (
            <Badge>{orderLine.productVariant.defaultCode}</Badge>
          )}
          <Badge>
            {formatCurrency(getUnitDisplayPrice(), 'Product Price')}
          </Badge>
        </Stack>
      </Box>
      <Box ml="auto">
        <Heading size="sm">
          {formatCurrency(getDisplayPrice(), 'Product Price')}
        </Heading>
      </Box>
    </Flex>
  );
};

import React from 'react';
import { Box, BoxProps, Heading, Grid, Text, Divider } from '@chakra-ui/react';

export interface OrderSummaryProps extends BoxProps {
  discount: string;
  totalItems: number;
  totalAmount: string;
}

export const OrderSummary: React.FunctionComponent<OrderSummaryProps> = ({
  discount,
  totalItems,
  totalAmount,
  ...boxProps
}) => {
  return (
    <Box {...boxProps}>
      <Grid templateColumns="1fr auto 1fr auto 2fr" gridGap={2}>
        <Box>
          <Text fontSize="sm" fontWeight="400">
            Discount
          </Text>
          <Heading size="md" color="brand.100">
            {discount}
          </Heading>
        </Box>
        <Divider orientation="vertical" />
        <Box>
          <Text fontSize="sm" fontWeight="400">
            Total items
          </Text>
          <Heading size="md" color="brand.100">
            {totalItems}
          </Heading>
        </Box>
        <Divider orientation="vertical" />
        <Box textAlign="right">
          <Text fontSize="sm" fontWeight="400">
            Total amount
          </Text>
          <Heading size="md" color="brand.100">
            {totalAmount}
          </Heading>
        </Box>
      </Grid>
    </Box>
  );
};

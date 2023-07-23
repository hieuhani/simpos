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
            Chiết khấu
          </Text>
          <Heading size="md">{discount}</Heading>
        </Box>
        <Divider orientation="vertical" />
        <Box>
          <Text fontSize="sm" fontWeight="400">
            Số sản phẩm
          </Text>
          <Heading size="md">{totalItems}</Heading>
        </Box>
        <Divider orientation="vertical" />
        <Box textAlign="right">
          <Text fontSize="sm" fontWeight="400">
            Tổng tiền
          </Text>
          <Heading size="md">{totalAmount}</Heading>
        </Box>
      </Grid>
    </Box>
  );
};

import React from 'react';
import { Box, BoxProps, Heading, Grid, Text, Divider } from '@chakra-ui/react';

export interface OrderSummaryProps extends BoxProps {}

export const OrderSummary: React.FunctionComponent<OrderSummaryProps> = ({
  ...boxProps
}) => (
  <Box {...boxProps}>
    <Grid templateColumns="1fr auto 1fr auto 2fr" gridGap={2}>
      <Box>
        <Text fontSize="sm" fontWeight="400">
          Chiet khau
        </Text>
        <Heading size="md">50,000d</Heading>
      </Box>
      <Divider orientation="vertical" />
      <Box>
        <Text fontSize="sm" fontWeight="400">
          So san pham
        </Text>
        <Heading size="md">13</Heading>
      </Box>
      <Divider orientation="vertical" />
      <Box textAlign="right">
        <Text fontSize="sm" fontWeight="400">
          Tong tien
        </Text>
        <Heading size="md">595,000d</Heading>
      </Box>
    </Grid>
  </Box>
);

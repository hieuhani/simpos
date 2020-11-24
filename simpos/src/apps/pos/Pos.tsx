import React from 'react';
import { Grid, Box, Flex, Stack } from '@chakra-ui/react';
import { NavigationBar } from './components/NavigationBar';
import { CategoryPanel } from './components/CategoryPanel';
import { SearchPanel } from './components/SearchPanel';
import { ProductCard } from './components/ProductCard';
import { SessionBar } from './components/SessionBar/SessionBar';
import { OrderPanel } from './components/OrderPanel';
import { OrderSummary } from './components/OrderSummary/OrderSummary';
import {
  VibrationCardAction,
  TableNoAction,
  CustomerSelectAction,
} from './components/OrderActions';
import { PaymentAction } from './components/OrderActions/PaymentAction';
import { SearchProductProvider } from '../../contexts/SearchProduct';

export const Pos: React.FunctionComponent = () => (
  <SearchProductProvider>
    <Grid templateColumns="2fr 1fr" h="100vh">
      <Flex overflow="hidden" flexDir="column">
        <NavigationBar />
        <CategoryPanel />
        <SearchPanel />
        <Box flex={1} overflowY="auto" px={4}>
          <Grid
            gap={2}
            templateColumns={[
              '1fr',
              '1fr',
              'repeat(2, 1fr)',
              'repeat(3, 1fr)',
              'repeat(4, 1fr)',
            ]}
          >
            {[
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17,
              18,
              19,
              20,
            ].map((i) => (
              <ProductCard key={i} />
            ))}
          </Grid>
        </Box>
      </Flex>
      <Flex overflow="hidden" bg="gray.50" flexDir="column">
        <SessionBar px={4} py={2} />
        <Stack px={4} direction="row" spacing={2} mb={2}>
          <CustomerSelectAction />
          <VibrationCardAction />
          <TableNoAction />
        </Stack>

        <Box flex={1} overflowY="auto">
          <OrderPanel />
        </Box>
        <OrderSummary px={4} py={2} />
        <Box px={4} py={2}>
          <PaymentAction />
        </Box>
      </Flex>
    </Grid>
  </SearchProductProvider>
);

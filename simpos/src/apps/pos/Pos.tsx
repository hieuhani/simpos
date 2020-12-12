import React from 'react';
import { Grid, Box, Flex } from '@chakra-ui/react';
import { NavigationBar } from './components/NavigationBar';
import { CategoryPanel } from './components/CategoryPanel';
import { SearchPanel } from './components/SearchPanel';
import { SearchProductProvider } from '../../contexts/SearchProduct';
import { ProductsGrid } from './components/ProductsGrid';
import { useOrderManagerState } from '../../contexts/OrderManager';
import { PosSidebar } from './components/PosSidebar';

export const Pos: React.FunctionComponent = () => {
  const { activeOrder } = useOrderManagerState();
  return (
    <SearchProductProvider>
      <Grid templateColumns="2fr 1fr" h="100vh">
        <Flex overflow="hidden" flexDir="column">
          <NavigationBar />
          <CategoryPanel />
          <SearchPanel />
          <Box flex={1} overflowY="auto" px={4}>
            <ProductsGrid />
          </Box>
        </Flex>
        <Flex overflow="hidden" bg="gray.50" flexDir="column">
          {activeOrder && <PosSidebar activeOrder={activeOrder} />}
        </Flex>
      </Grid>
    </SearchProductProvider>
  );
};

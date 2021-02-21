import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { SearchProductProvider } from '../../../contexts/SearchProduct';
import { CategoryPanel } from '../components/CategoryPanel';
import { NavigationBar } from '../components/NavigationBar';
import { ProductsGrid } from '../components/ProductsGrid';
import { SearchPanel } from '../components/SearchPanel';
import { CartBottomAction } from './components/CartBottomAction';
import { useOrderManagerState } from '../../../contexts/OrderManager';

export const MobilePos: React.FunctionComponent = () => {
  const { activeOrder } = useOrderManagerState();
  return (
    <SearchProductProvider>
      <Flex overflow="hidden" flexDir="column" height="100vh">
        <NavigationBar />
        <CategoryPanel />
        <SearchPanel />
        <Box flex={1} overflowY="auto" px={4}>
          <ProductsGrid />
        </Box>
      </Flex>
      {activeOrder && activeOrder.orderLines.length > 0 && (
        <CartBottomAction activeOrder={activeOrder} />
      )}
    </SearchProductProvider>
  );
};
export default MobilePos;

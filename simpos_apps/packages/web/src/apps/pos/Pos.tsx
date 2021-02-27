import React, { useEffect } from 'react';
import { Grid, Box, Flex, useToast } from '@chakra-ui/react';
import { NavigationBar } from './components/NavigationBar';
import { CategoryPanel } from './components/CategoryPanel';
import { SearchPanel } from './components/SearchPanel';
import { SearchProductProvider } from '../../contexts/SearchProduct';
import { ProductsGrid } from './components/ProductsGrid';
import {
  useOrderManagerAction,
  useOrderManagerState,
} from '../../contexts/OrderManager';
import { PosSidebar } from './components/PosSidebar';
import { productVariantRepository } from '../../services/db';

export const Pos: React.FunctionComponent = () => {
  const { activeOrder } = useOrderManagerState();
  const toast = useToast();
  const { addProductVariantToCart } = useOrderManagerAction();

  useEffect(() => {
    const onBarcodeScanned = async (e: CustomEvent) => {
      if (e.detail.scanCode) {
        if (!activeOrder) {
          return toast({
            title: 'Error',
            description: 'Không tìm thấy đơn hàng hiện tại',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
        const productVariant = await productVariantRepository.findByBarcode(
          e.detail.scanCode,
        );

        if (!productVariant) {
          return toast({
            title: 'Error',
            description:
              'Sản phẩm không tồn tại hoặc chưa được cài đặt mã vạch',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
        await addProductVariantToCart(productVariant);
      }
    };
    (document as any).addEventListener('scan', onBarcodeScanned);
    return () => {
      (document as any).removeEventListener('scan', onBarcodeScanned);
    };
  }, [activeOrder]);
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

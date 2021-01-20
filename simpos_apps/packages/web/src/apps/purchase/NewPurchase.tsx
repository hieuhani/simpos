import { Flex, Grid } from '@chakra-ui/react';
import React from 'react';
import { NavigationBarGeneral } from '../pos/components/NavigationBar';
import { PurchaseSelectProduct } from './components/PurchaseSelectProduct';
import { PurchaseSidebar } from './components/PurchaseSidebar';
import { PurchaseManager } from './contexts/PurchaseContext';

const NewPurchase: React.FunctionComponent = () => {
  return (
    <PurchaseManager>
      <Grid templateColumns="1fr 1fr" h="100vh">
        <Flex overflow="hidden" flexDir="column">
          <NavigationBarGeneral />
          <PurchaseSelectProduct />
        </Flex>
        <Flex
          overflow="hidden"
          bg="gray.50"
          flexDir="column"
          borderTopLeftRadius="md"
        >
          <PurchaseSidebar />
        </Flex>
      </Grid>
    </PurchaseManager>
  );
};

export default NewPurchase;

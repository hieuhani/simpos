import { Flex, Grid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { orderChannel } from '../../channels';
import { ActiveOrder } from '../../contexts/OrderManager';
import { PosSidebarCustomer } from './components/PosSidebarCustomer';

export const CustomerScreen: React.FunctionComponent = () => {
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | undefined>();

  useEffect(() => {
    orderChannel.onmessage = (e) => {
      if (e.data.type === 'ACTIVE_ORDER_CHANGED') {
        setActiveOrder(e.data.payload);
      }
    };
    return () => {
      orderChannel.close();
    };
  }, []);
  return (
    <Grid
      templateColumns={['1fr 1fr', '1fr 1fr', '1fr 1fr', '2fr 1fr']}
      h="100vh"
    >
      <Flex overflow="hidden" flexDir="column">
        Hello
      </Flex>
      <Flex overflow="hidden" bg="gray.50" flexDir="column">
        {activeOrder && <PosSidebarCustomer activeOrder={activeOrder} />}
      </Flex>
    </Grid>
  );
};

export default CustomerScreen;

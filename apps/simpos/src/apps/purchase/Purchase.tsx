import React, { useEffect, useState } from 'react';
import { Box, Container, Flex, Heading, Link } from '@chakra-ui/react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { useQueryParams } from '../../hooks';
import { PurchaseOrder } from '../../services/db';

import { NavigationBarGeneral } from '../pos/components/NavigationBar';
import { purchaseOrderService } from '../../services/purchase-order';
import { PurchaseOrders } from './components/PurchaseOrders';

interface TabConfig {
  route: LinkProps['to'];
  title: string;
  domain: Array<Array<any> | string>;
}
const tabs: Record<string, TabConfig> = {
  all: {
    route: { pathname: '/purchase' },
    title: 'All',
    domain: [],
  },
  waiting: {
    route: { pathname: '/purchase', search: '?status=waiting' },
    title: 'Waiting to receive',
    domain: [['state', 'in', ['purchase']]],
  },
  received: {
    route: { pathname: '/purchase', search: '?status=received' },
    title: 'Received',
    domain: [['state', '=', 'done']],
  },
  cancelled: {
    route: { pathname: '/purchase', search: '?status=cancelled' },
    title: 'Cancelled',
    domain: [['state', '=', 'cancel']],
  },
};

export const Purchase: React.FunctionComponent = () => {
  const queryParams = useQueryParams();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const getPurchaseOrders = async (status: string | null) => {
    setPurchaseOrders([]);
    const poList = await purchaseOrderService.getPurchaseOrders(
      tabs[status || 'all'].domain,
    );
    setPurchaseOrders(poList);
  };
  useEffect(() => {
    getPurchaseOrders(queryParams.get('status'));
  }, [queryParams]);

  return (
    <>
      <NavigationBarGeneral />
      <Box height="calc(100vh - 112px)" overflowY="auto">
        <Container maxW="6xl" pt={4}>
          <Heading mb={4}>Purchase orders</Heading>
          <Flex>
            {Object.keys(tabs).map((tabKey) => (
              <Link key={tabKey} to={tabs[tabKey].route} as={RouterLink}>
                <Box
                  borderRadius="full"
                  py={2}
                  px={4}
                  fontWeight="600"
                  {...(tabKey === (queryParams.get('status') || 'all')
                    ? {
                        color: 'green.700',
                        backgroundColor: 'green.100',
                      }
                    : {
                        color: 'gray.600',
                      })}
                >
                  {tabs[tabKey].title}
                </Box>
              </Link>
            ))}
          </Flex>
          <PurchaseOrders
            view={queryParams.get('status') || undefined}
            purchaseOrders={purchaseOrders}
          />
        </Container>
      </Box>
    </>
  );
};

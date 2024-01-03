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
    title: 'Tất cả',
    domain: [],
  },
  waiting: {
    route: { pathname: '/purchase', search: '?status=waiting' },
    title: 'Chờ nhận hàng',
    domain: [['state', 'in', ['purchase']]],
  },
  received: {
    route: { pathname: '/purchase', search: '?status=received' },
    title: 'Đã nhận hàng',
    domain: [['state', '=', 'done']],
  },
  cancelled: {
    route: { pathname: '/purchase', search: '?status=cancelled' },
    title: 'Đã huỷ',
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
          <Heading mb={4}>Danh sách đơn mua</Heading>
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
                        color: 'pink.700',
                        backgroundColor: 'pink.100',
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

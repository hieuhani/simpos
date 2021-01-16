import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useQueryParams } from '../../hooks';
import { PurchaseOrder } from '../../services/db';

import { NavigationBarGeneral } from '../pos/components/NavigationBar';
import { purchaseOrderService } from '../../services/purchase-order';
import { PurchaseOrders } from './components/PurchaseOrders';

export const Purchase: React.FunctionComponent = () => {
  const queryParams = useQueryParams();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const getPurchaseOrders = async (status: string | null) => {
    setPurchaseOrders([]);
    if (status === 'waiting') {
      const poList = await purchaseOrderService.getPurchaseOrders([
        ['state', 'in', ['purchase', 'done']],
        ['invoice_status', '=', 'to invoice'],
      ]);
      setPurchaseOrders(poList);
    } else if (status === 'received') {
      const poList = await purchaseOrderService.getPurchaseOrders([
        ['state', 'in', ['purchase', 'done']],
        ['invoice_status', '=', 'invoiced'],
      ]);
      setPurchaseOrders(poList);
    } else {
      const poList = await purchaseOrderService.getPurchaseOrders();
      setPurchaseOrders(poList);
    }
  };
  useEffect(() => {
    getPurchaseOrders(queryParams.get('status'));
  }, [queryParams]);

  return (
    <>
      <NavigationBarGeneral />
      <Container maxW="6xl" pt={4}>
        <Flex>
          <Link to="/purchase" as={RouterLink}>
            <Box
              backgroundColor="pink.100"
              borderRadius="full"
              py={2}
              px={4}
              color="pink.700"
              fontWeight="600"
            >
              Mua hàng
            </Box>
          </Link>
          <Link
            to={{ pathname: '/purchase', search: '?status=waiting' }}
            as={RouterLink}
          >
            <Box py={2} px={4} color="gray.600" fontWeight="600">
              Chờ nhận hàng
            </Box>
          </Link>
          <Link
            to={{ pathname: '/purchase', search: '?status=received' }}
            as={RouterLink}
          >
            <Box py={2} px={4} color="gray.600" fontWeight="600">
              Đã nhận hàng
            </Box>
          </Link>
        </Flex>
        <PurchaseOrders purchaseOrders={purchaseOrders} />
      </Container>
      <Box position="fixed" bottom="0" left="0" right="0">
        <Container maxW="6xl" py={2}>
          <Button
            as={RouterLink}
            to="/purchase/new"
            colorScheme="pink"
            w="full"
          >
            Mua hàng
          </Button>
        </Container>
      </Box>
    </>
  );
};

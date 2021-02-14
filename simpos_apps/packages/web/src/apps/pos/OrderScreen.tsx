import {
  Box,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import {
  orderService,
  RemotePosOrder,
  RemotePosPayment,
} from '../../services/order';
import {
  orderLineService,
  RemotePosOrderLine,
} from '../../services/order-line';
import { posPaymentService } from '../../services/pos-payment';
import { NavigationBarGeneral } from '../pos/components/NavigationBar';
import { OrderDetails } from './components/OrderDetails';

interface OrderRoute {
  orderId: string;
}

const Order: React.FunctionComponent = () => {
  const params = useParams<OrderRoute>();

  const [order, setOrder] = useState<RemotePosOrder | null>(null);
  const [posOrderLines, setPosOrderLines] = useState<RemotePosOrderLine[]>([]);
  const [posPayments, setPosPayments] = useState<RemotePosPayment[]>([]);
  const getOrder = async (orderId: string) => {
    const remoteOrder = await orderService.getOrder(parseInt(orderId, 10));
    if (remoteOrder) {
      if (remoteOrder.lines.length > 0) {
        const serverOrderLines = await orderLineService.getOrderLines(
          remoteOrder.lines,
        );

        setPosOrderLines(serverOrderLines);
      }
      if (remoteOrder.paymentIds.length > 0) {
        const serverPayments = await posPaymentService.getPayments(
          remoteOrder.paymentIds,
        );

        setPosPayments(serverPayments);
      }
    }

    setOrder(remoteOrder);
  };
  useEffect(() => {
    getOrder(params.orderId);
  }, [params.orderId]);

  if (!order) {
    return null;
  }
  return (
    <>
      <NavigationBarGeneral />
      <Box height="calc(100vh - 112px)" overflowY="auto">
        <Container maxW="6xl" pt={4}>
          <Breadcrumb mb={4}>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/pos/session">
                Phiên bán hàng
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">Đơn hàng</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">{order.posReference}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <OrderDetails
            order={order}
            orderLines={posOrderLines}
            payments={posPayments}
          />
        </Container>
      </Box>
    </>
  );
};

export default Order;

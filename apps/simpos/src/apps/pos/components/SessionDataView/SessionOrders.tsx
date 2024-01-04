import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import { useMoneyFormatter } from '../../../../hooks';
import { orderService, RemotePosOrder } from '../../../../services/order';

export interface SessionOrdersProps {
  sessionId: number;
}
export const SessionOrders: React.FunctionComponent<SessionOrdersProps> = ({
  sessionId,
}) => {
  const [orders, setOrders] = useState<RemotePosOrder[]>([]);
  const { formatCurrency } = useMoneyFormatter();

  useEffect(() => {
    const getSessionOrders = async () => {
      const posOrders = await orderService.getSessionOrders(sessionId);
      setOrders(posOrders);
    };
    getSessionOrders();
  }, [sessionId]);
  return (
    <Table variant="striped" colorScheme="pink">
      <Thead>
        <Tr>
          <Th>Order No</Th>
          <Th>Receipt No</Th>
          <Th>Time</Th>
          <Th>Customer</Th>
          <Th>Cashier</Th>
          <Th>Total</Th>
        </Tr>
      </Thead>
      <Tbody>
        {orders.map((order) => (
          <Tr key={order.id}>
            <Td>{order.name}</Td>
            <Td>{order.posReference}</Td>
            <Td>{order.dateOrder}</Td>
            <Td>{order.partnerId && order.partnerId[1]}</Td>
            <Td>{order.cashier}</Td>
            <Td>{formatCurrency(order.amountTotal)}</Td>
            <Td>
              <Button
                as={RouterLink}
                to={`/pos/orders/${order.id}`}
                colorScheme="pink"
                w="full"
              >
                Details
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

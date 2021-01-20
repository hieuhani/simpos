import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { PurchaseOrder } from '../../../../services/db';

export interface PurchaseOrdersProps {
  purchaseOrders: PurchaseOrder[];
  view?: string;
}
export const PurchaseOrders: React.FunctionComponent<PurchaseOrdersProps> = ({
  purchaseOrders,
}) => {
  return (
    <Table variant="striped" colorScheme="pink">
      <Thead>
        <Tr>
          <Th>Mã phiếu mua</Th>
          <Th>Ngày tạo</Th>
          <Th>Trạng thái</Th>
          <Th>Invoice status</Th>
          <Th>Người tạo</Th>
          <Th>Tổng</Th>
          <Th />
        </Tr>
      </Thead>
      <Tbody>
        {purchaseOrders.map((purchaseOrder) => (
          <Tr key={purchaseOrder.id}>
            <Td>{purchaseOrder.name}</Td>
            <Td>{purchaseOrder.dateOrder}</Td>
            <Td>{purchaseOrder.state}</Td>

            <Td>{purchaseOrder.invoiceStatus}</Td>
            <Td>{purchaseOrder.userId && purchaseOrder.userId[1]}</Td>
            <Td>{purchaseOrder.amountTotal}</Td>
            <Td>
              <Button
                as={RouterLink}
                to={`/purchase/${purchaseOrder.id}`}
                colorScheme="pink"
                w="full"
              >
                Chi tiết
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

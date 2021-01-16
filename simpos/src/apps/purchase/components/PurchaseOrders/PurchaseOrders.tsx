import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import React from 'react';
import { PurchaseOrder } from '../../../../services/db';

export interface PurchaseOrdersProps {
  purchaseOrders: PurchaseOrder[];
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
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { PurchaseOrder } from '../../../../services/db';
import { formatMoney } from '../../../../utils';

const purchaseOrderStateMap = {
  draft: 'Waiting for RFQ',
  sent: 'RFQ Sent',
  'to approve': 'Need to approve',
  purchase: 'Order placed',
  done: 'Done',
  cancel: 'Cancelled',
};
export interface PurchaseOrdersProps {
  purchaseOrders: PurchaseOrder[];
  view?: string;
}
export const PurchaseOrders: React.FunctionComponent<PurchaseOrdersProps> = ({
  purchaseOrders,
}) => {
  return (
    <Table variant="striped" colorScheme="green">
      <Thead>
        <Tr>
          <Th>Order code</Th>
          <Th>Created at</Th>
          <Th>Status</Th>
          <Th>Creator</Th>
          <Th>Amount</Th>
          <Th />
        </Tr>
      </Thead>
      <Tbody>
        {purchaseOrders.map((purchaseOrder) => (
          <Tr key={purchaseOrder.id}>
            <Td>{purchaseOrder.name}</Td>
            <Td>{purchaseOrder.dateOrder}</Td>
            <Td>{purchaseOrderStateMap[purchaseOrder.state]}</Td>

            <Td>{purchaseOrder.userId && purchaseOrder.userId[1]}</Td>
            <Td>{formatMoney(purchaseOrder.amountTotal)}</Td>
            <Td>
              <Button
                as={RouterLink}
                to={`/purchase/${purchaseOrder.id}`}
                colorScheme="green"
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

import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { PurchaseOrderLine } from '../../../../services/purchase-order-line';
import { formatMoney } from '../../../../utils';

export interface PurchaseOrderLinesProps {
  purchaseOrderLines: PurchaseOrderLine[];
}
export const PurchaseOrderLines: React.FunctionComponent<PurchaseOrderLinesProps> = ({
  purchaseOrderLines,
}) => {
  return (
    <Box mt={4} backgroundColor="gray.100" borderRadius="md">
      <Table variant="striped" colorScheme="pink">
        <Thead>
          <Tr>
            <Th>Sản phẩm</Th>
            <Th>Miêu tả</Th>
            <Th>Số lượng</Th>
            <Th>Đơn vị mua</Th>
            <Th>Giá niêm yết</Th>
            <Th>Giá trị</Th>
            <Th>Đã nhận</Th>
          </Tr>
        </Thead>
        <Tbody>
          {purchaseOrderLines.map((line) => (
            <Tr key={line.id}>
              <Td>{line.name}</Td>
              <Td>{line.productId && line.productId[1]}</Td>
              <Td>{line.productQty}</Td>
              <Td>{line.productUom[1]}</Td>
              <Td>{formatMoney(line.priceUnit)}</Td>
              <Td>{formatMoney(line.priceSubtotal)}</Td>

              <Td>{line.qtyReceived}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

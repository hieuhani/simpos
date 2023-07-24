import { Table, Thead, Tr, Td } from '@chakra-ui/react';
import React from 'react';

export interface OrderReceiptSummaryMobileProps {
  fields: HeaderField[];
}

export interface HeaderField {
  name: string;
  value: string;
}

export const OrderReceiptSummaryMobile: React.FunctionComponent<OrderReceiptSummaryMobileProps> = ({
  fields,
}) => {
  return (
    <Table>
      <Thead>
        {fields.map((col, index) => (
          <Tr key={index}>
            <Td py={1} px="0" borderBottom="0" fontWeight="medium">
              {col.name}
            </Td>
            <Td py={1} px="0" borderBottom="0">
              {col.value}
            </Td>
          </Tr>
        ))}
      </Thead>
    </Table>
  );
};

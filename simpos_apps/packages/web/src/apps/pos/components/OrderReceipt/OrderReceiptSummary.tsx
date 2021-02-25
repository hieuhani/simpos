import { Table, Thead, Tr, Td } from '@chakra-ui/react';
import chunk from 'lodash.chunk';
import React from 'react';

export interface OrderReceiptSummaryProps {
  fields: HeaderField[];
}

export interface HeaderField {
  name: string;
  value: string;
}

export const OrderReceiptSummary: React.FunctionComponent<OrderReceiptSummaryProps> = ({
  fields,
}) => {
  const chunkHeaderFields = chunk(fields, 2);
  return (
    <Table>
      <Thead>
        {chunkHeaderFields.map((cols, index) => (
          <Tr key={index}>
            {cols.map((col) => {
              return (
                <React.Fragment key={col.name}>
                  <Td py={1} px="0" borderBottom="0" fontWeight="medium">
                    {col.name}
                  </Td>
                  <Td py={1} px="0" borderBottom="0">
                    {col.value}
                  </Td>
                </React.Fragment>
              );
            })}
          </Tr>
        ))}
      </Thead>
    </Table>
  );
};

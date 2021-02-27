import { Tr, Td as CTd } from '@chakra-ui/react';
import React from 'react';
import styled from '@emotion/styled';

import { useMoneyFormatter, useOrderLineExtensions } from '../../../../hooks';
import { OrderLine } from '../../../../services/db';

export interface OrderReceiptRowProps {
  orderLine: OrderLine;
}

const Td = styled(CTd)`
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0.2rem;
`;
export const OrderReceiptRow: React.FunctionComponent<OrderReceiptRowProps> = ({
  orderLine,
}) => {
  const { getUnitDisplayPrice, getDisplayPrice } = useOrderLineExtensions(
    orderLine,
  );
  const { formatCurrencyNoSymbol } = useMoneyFormatter();
  return (
    <React.Fragment key={orderLine.id}>
      <Tr>
        <Td paddingBottom="0" borderBottom="0" paddingTop="0.2rem" colSpan={5}>
          {orderLine.productVariant?.name}
        </Td>
      </Tr>
      <Tr>
        <Td paddingTop="0">{orderLine.productVariant?.defaultCode}</Td>
        <Td paddingTop="0" isNumeric>
          {formatCurrencyNoSymbol(getUnitDisplayPrice(), 'Product Price')}
        </Td>
        <Td paddingTop="0" isNumeric>
          {orderLine.qty}
        </Td>
        <Td paddingTop="0" isNumeric>
          {formatCurrencyNoSymbol(getDisplayPrice(), 'Product Price')}
        </Td>
      </Tr>
    </React.Fragment>
  );
};

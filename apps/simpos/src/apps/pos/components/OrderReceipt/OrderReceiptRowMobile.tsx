import { Tr, Td as CTd } from '@chakra-ui/react';
import React from 'react';
import styled from '@emotion/styled';

import { useMoneyFormatter, useOrderLineExtensions } from '../../../../hooks';
import { OrderLine } from '../../../../services/db';

export interface OrderReceiptRowMobileProps {
  orderLine: OrderLine;
}

const Td = styled(CTd)`
  padding-left: 0;
  padding-right: 0;
`;
export const OrderReceiptRowMobile: React.FunctionComponent<OrderReceiptRowMobileProps> = ({
  orderLine,
}) => {
  const { getUnitDisplayPrice, getDisplayPrice } = useOrderLineExtensions(
    orderLine,
  );
  const { formatCurrencyNoSymbol } = useMoneyFormatter();
  return (
    <React.Fragment key={orderLine.id}>
      <Tr>
        <Td paddingBottom="0" borderBottom="0" paddingTop="1px" colSpan={5}>
          {orderLine.productVariant?.name}
        </Td>
      </Tr>
      <Tr>
        <Td paddingTop="0" pb="1px">
          {orderLine.productVariant?.defaultCode}
        </Td>
        <Td paddingTop="0" pb="1px" isNumeric>
          {formatCurrencyNoSymbol(getUnitDisplayPrice(), 'Product Price')}
        </Td>
        <Td paddingTop="0" pb="1px" isNumeric>
          {orderLine.qty}
        </Td>
        <Td paddingTop="0" pb="1px" isNumeric>
          {formatCurrencyNoSymbol(getDisplayPrice(), 'Product Price')}
        </Td>
      </Tr>
    </React.Fragment>
  );
};

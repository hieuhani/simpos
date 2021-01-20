import { Button, Divider, Flex, Heading } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { IconCheckCircle } from '../../../../components/icons';
import { useActiveOrderExtensions, useMoneyFormatter } from '../../../../hooks';
import { ActiveOrder } from '../../../../contexts/OrderManager';

export interface OrderCompleteProps {
  activeOrder: ActiveOrder;
  onComplete: () => void;
}

const OrderSummaryTable = styled.table`
  width: 100%;
  margin-bottom: 2rem;
  tr > td:first-of-type {
    text-align: right;
  }
  tr > td:nth-of-type(2) {
    width: 1rem;
  }
`;

const OrderSummaryValue = styled.span`
  font-weight: 700;
`;

export const OrderComplete: React.FunctionComponent<OrderCompleteProps> = ({
  activeOrder,
  onComplete,
}) => {
  const { formatCurrency } = useMoneyFormatter();
  const { getTotalWithTax } = useActiveOrderExtensions(activeOrder);

  const orderDetails = useMemo<Record<string, string>>(() => {
    return {
      'Mã đơn hàng': activeOrder.order.id,
      'Thời gian': dayjs().format('HH:mm DD/MM/YYYY'),
      'Giá trị đơn hàng': formatCurrency(getTotalWithTax()),
    };
  }, [activeOrder, formatCurrency, getTotalWithTax]);

  return (
    <Flex py={4} flexDirection="column" alignItems="center">
      <Flex direction="column" alignItems="center" mb={4}>
        <IconCheckCircle size={100} color="#48BB78" />
        <Heading size="md" mt={4}>
          Thanh toán thành công
        </Heading>
      </Flex>
      <Divider mb={4} />
      <OrderSummaryTable>
        <tbody>
          {Object.keys(orderDetails).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td />
              <td>
                <OrderSummaryValue>{orderDetails[key]}</OrderSummaryValue>
              </td>
            </tr>
          ))}
        </tbody>
      </OrderSummaryTable>

      <Button colorScheme="blue" onClick={onComplete}>
        Tiếp tục bán hàng
      </Button>
    </Flex>
  );
};

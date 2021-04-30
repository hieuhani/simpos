import {
  Box,
  Th as CTh,
  Table,
  Thead,
  Tr,
  Tbody,
  Tfoot,
  Td,
  Text,
  Button,
} from '@chakra-ui/react';
import React, { useMemo, useRef } from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import { useData } from '../../../../contexts/DataProvider';
import { RemotePosOrder, RemotePosPayment } from '../../../../services/order';
import { RemotePosOrderLine } from '../../../../services/order-line';
import {
  HeaderField,
  OrderReceiptFooter,
  OrderReceiptHeader,
  OrderReceiptSummary,
} from '../OrderReceipt';
import { formatMoney } from '../../../../utils';

export interface OrderDetailsProps {
  order: RemotePosOrder;
  orderLines: RemotePosOrderLine[];
  payments: RemotePosPayment[];
}

const Container = styled(Box)`
  @media print {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    z-index: 1;
    overflow-x: hidden;
    height: auto !important;
    width: 100% !important;

    th,
    td {
      border-color: #000;
    }

    tr.semi-border td {
      border-color: #888;
    }
  }
`;

const Th = styled(CTh)`
  padding-left: 0;
  padding-right: 0;
`;

const py = {
  pt: '0.5rem',
  pb: '0.5rem',
};

export const OrderDetails: React.FunctionComponent<OrderDetailsProps> = ({
  order,
  orderLines,
  payments,
}) => {
  const ref = useRef(null);
  const { company } = useData();
  const printReceipt = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // @ts-ignore
    if (typeof simpos !== 'undefined') {
      if (ref.current) {
        html2canvas(ref.current!).then((canvas) => {
          const image = canvas
            .toDataURL('image/jpeg')
            .replace('data:image/jpeg;base64,', '');
          // @ts-ignore
          simpos.printReceipt(image);
        });
      }
    } else {
      try {
        window.print();
      } catch (e) {
        console.error(e);
      }
    }
  };
  const headerFields = useMemo<HeaderField[]>(() => {
    const fields = [
      {
        name: 'Thời gian',
        value: dayjs(order.dateOrder).format('HH:mm DD/MM/YYYY'),
      },
    ];
    if (order.partnerId) {
      fields.unshift({
        name: 'Khách hàng',
        value: order.partnerId[1],
      });
    }
    if (order.employeeId) {
      fields.push({
        name: 'Nhân viên',
        value: order.employeeId[1],
      });
    }

    return fields;
  }, [order]);

  const creditPayments = useMemo(
    () => payments.filter((payment) => payment.amount >= 0),
    [payments],
  );
  const debitPayments = useMemo(
    () => payments.filter((payment) => payment.amount < 0),
    [payments],
  );
  return (
    <>
      <Box w="400px" border="1px solid" borderColor="gray.400" p={2} mb={4}>
        <Container ref={ref}>
          <OrderReceiptHeader company={company} />
          <Text textAlign="center" fontSize="lg" fontWeight="bold">
            In lại
          </Text>
          <OrderReceiptSummary fields={headerFields} />
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Sản phẩm</Th>
                <Th {...py} isNumeric>
                  Đơn giá
                </Th>
                <Th {...py} isNumeric>
                  SL
                </Th>
                <Th {...py} isNumeric>
                  T.Tiền
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {orderLines.map((orderLine) => (
                <React.Fragment key={orderLine.id}>
                  <Tr>
                    <Td
                      px={0}
                      paddingBottom="0"
                      borderBottom="0"
                      paddingTop="0.5rem"
                      colSpan={5}
                    >
                      {orderLine.productId[1]}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td px={0} paddingTop="0" />
                    <Td px={0} paddingTop="0" isNumeric>
                      {formatMoney(orderLine.priceUnit, false)}
                    </Td>
                    <Td px={0} paddingTop="0" isNumeric>
                      {orderLine.qty}
                    </Td>
                    <Td px={0} paddingTop="0" isNumeric>
                      {formatMoney(orderLine.priceSubtotalIncl, false)}
                    </Td>
                  </Tr>
                </React.Fragment>
              ))}
            </Tbody>
            <Tfoot>
              <Tr textTransform="uppercase" fontWeight="medium">
                <Td px={0} {...py} pl="0" pr="0" colSpan={2}>
                  Tổng tiền
                </Td>
                <Td px={0} {...py} pl="0" pr="0" colSpan={2} isNumeric>
                  {formatMoney(order.amountTotal, false)}
                </Td>
              </Tr>
              <Tr textTransform="uppercase" fontWeight="medium">
                <Td px={0} {...py} colSpan={4} borderBottom="0" pl="0" pr="0">
                  Tiền khách trả
                </Td>
              </Tr>

              {creditPayments.map((payment) => (
                <Tr key={payment.id}>
                  <Td colSpan={2} pt={0} pb="0.5rem" paddingLeft="0.75rem">
                    {payment.paymentMethodId[1]}
                  </Td>
                  <Td colSpan={2} isNumeric pt={0} pb="0.5rem" pl={0} pr={0}>
                    {formatMoney(payment.amount, false)}
                  </Td>
                </Tr>
              ))}
              {debitPayments.map((payment) => (
                <Tr
                  textTransform="uppercase"
                  fontWeight="medium"
                  key={payment.id}
                >
                  <Td {...py} colSpan={2} pl="0" pr="0">
                    Tiền trả lại
                  </Td>
                  <Td {...py} colSpan={2} isNumeric pr={0}>
                    {formatMoney(payment.amount * -1, false)}
                  </Td>
                </Tr>
              ))}
            </Tfoot>
          </Table>
          <OrderReceiptFooter company={company} />
        </Container>
      </Box>
      <Button w="400px" colorScheme="yellow" onClick={printReceipt}>
        In lại phiếu
      </Button>
    </>
  );
};

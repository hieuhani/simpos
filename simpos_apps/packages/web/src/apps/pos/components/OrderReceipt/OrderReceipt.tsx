import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th as CTh,
  Thead,
  Tr,
} from '@chakra-ui/react';
import JsBarcode from 'jsbarcode';
import React, { useEffect, useMemo, useRef } from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import { useData } from '../../../../contexts/DataProvider';
import { ActiveOrder } from '../../../../contexts/OrderManager';
import { useActiveOrderExtensions, useMoneyFormatter } from '../../../../hooks';
import { OrderReceiptRow } from './OrderReceiptRow';
import { OrderReceiptHeader } from './OrderReceiptHeader';
import { HeaderField, OrderReceiptSummary } from './OrderReceiptSummary';
import { OrderReceiptFooter } from './OrderReceiptFooter';

export interface OrderReceiptProps {
  activeOrder: ActiveOrder;
}

const Th = styled(CTh)`
  padding-left: 0;
  padding-right: 0;
  padding-top: 0.1rem;
  padding-bottom: 0.2rem;
  text-transform: inherit;
  font-size: 1rem;
`;

const py = {
  pt: '0.1rem',
  pb: '0.1rem',
};

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

export const OrderReceipt: React.FunctionComponent<OrderReceiptProps> = ({
  activeOrder,
}) => {
  const ref = useRef(null);
  const barcodeRef = useRef(null);
  const { company, paymentMethods, cashier } = useData();

  const { formatCurrencyNoSymbol } = useMoneyFormatter();
  const { getTotalWithTax } = useActiveOrderExtensions(activeOrder);

  const payments = useMemo<Record<string, number>>(() => {
    if (activeOrder.context) {
      const paymentMethod = paymentMethods.find(
        (method) => method.id === activeOrder.context?.selectedPaymentMethod,
      );
      if (paymentMethod) {
        return {
          [paymentMethod.name]: activeOrder.context.amount,
        };
      }
    }
    return {};
  }, [activeOrder, paymentMethods]);

  const change = useMemo(() => {
    const total = getTotalWithTax();
    const amount = activeOrder.context?.amount || 0;
    return amount - total;
  }, [getTotalWithTax, activeOrder]);

  const headerFields = useMemo<HeaderField[]>(() => {
    const fields = [
      {
        name: 'Thời gian',
        value: dayjs(activeOrder.order.creationDate).format('HH:mm DD/MM/YYYY'),
      },
    ];
    if (activeOrder.order.partner?.name) {
      fields.unshift({
        name: 'Khách hàng',
        value: activeOrder.order.partner.name,
      });
    }
    if (cashier?.name) {
      fields.push({
        name: 'Nhân viên',
        value: cashier.name,
      });
    }

    if (activeOrder.order.vibrationCardNo) {
      fields.push({
        name: 'Thẻ rung',
        value: activeOrder.order.vibrationCardNo,
      });
    }

    if (activeOrder.order.tableNo) {
      fields.push({
        name: 'Thẻ bàn',
        value: activeOrder.order.tableNo,
      });
    }
    fields.push({ name: 'Số HĐ', value: activeOrder.order.id });
    return fields;
  }, [activeOrder, cashier]);

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
  useEffect(() => {
    if (barcodeRef.current && activeOrder) {
      JsBarcode(barcodeRef.current, activeOrder.order.id, {
        width: 1,
        height: 40,
        displayValue: false,
      });
    }
    printReceipt();
  }, [activeOrder]);
  return (
    <Container w="480px" ref={ref} fontSize="1rem">
      <OrderReceiptHeader company={company} />
      <OrderReceiptSummary fields={headerFields} />
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Sản phẩm</Th>
            <Th isNumeric>Đơn giá</Th>
            <Th isNumeric>SL</Th>
            <Th isNumeric>T.Tiền</Th>
          </Tr>
        </Thead>
        <Tbody>
          {activeOrder.orderLines.map((orderLine) => (
            <OrderReceiptRow orderLine={orderLine} key={orderLine.id} />
          ))}
        </Tbody>
        <Tfoot>
          <Tr textTransform="uppercase" fontWeight="medium">
            <Td {...py} pl="0" pr="0" colSpan={2} borderBottom="0">
              Tổng tiền
            </Td>
            <Td {...py} pl="0" pr="0" colSpan={2} isNumeric borderBottom="0">
              {formatCurrencyNoSymbol(getTotalWithTax())}
            </Td>
          </Tr>
          <Tr textTransform="uppercase" fontWeight="medium">
            <Td {...py} colSpan={4} borderBottom="0" pl="0" pr="0">
              Tiền khách trả
            </Td>
          </Tr>
          {Object.keys(payments).map((method) => {
            return (
              <Tr key={method}>
                <Td
                  colSpan={2}
                  pt={0}
                  pb="0.1rem"
                  paddingLeft="1rem"
                  borderBottom="0"
                >
                  {method}
                </Td>
                <Td
                  colSpan={2}
                  isNumeric
                  pt={0}
                  pb="0.1rem"
                  pl={0}
                  pr={0}
                  borderBottom="0"
                >
                  {formatCurrencyNoSymbol(payments[method])}
                </Td>
              </Tr>
            );
          })}
          <Tr textTransform="uppercase" fontWeight="medium">
            <Td {...py} colSpan={2} pl="0" pr="0" borderBottom="0">
              Tiền trả lại
            </Td>
            <Td {...py} colSpan={2} isNumeric pr={0} borderBottom="0">
              {formatCurrencyNoSymbol(change)}
            </Td>
          </Tr>
        </Tfoot>
      </Table>
      <OrderReceiptFooter company={company} />
      <Flex justifyContent="center">
        <svg ref={barcodeRef} />
      </Flex>
    </Container>
  );
};

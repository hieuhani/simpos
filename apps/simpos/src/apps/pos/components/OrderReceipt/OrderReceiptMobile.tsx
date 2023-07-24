import {
  Box,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th as CTh,
  Thead,
  Tr,
  Text,
  Image,
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useRef } from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import { useData } from '../../../../contexts/DataProvider';
import { ActiveOrder } from '../../../../contexts/OrderManager';
import { useActiveOrderExtensions, useMoneyFormatter } from '../../../../hooks';
import { HeaderField } from './OrderReceiptSummary';
import { OrderReceiptRowMobile } from './OrderReceiptRowMobile';
import { OrderReceiptSummaryMobile } from './OrderReceiptSummaryMobile';

export interface OrderReceiptMobileProps {
  activeOrder: ActiveOrder;
}

const Th = styled(CTh)`
  padding-left: 0;
  padding-right: 0;
  font-size: 11px;
  font-family: monospace;
`;

const py = {
  pt: 0,
  pb: 0,
};

const bb = {
  borderBottom: '1px solid',
  borderColor: '#000',
};

const bt = {
  borderTop: '1px solid',
  borderColor: '#000',
};
export const OrderReceiptMobile: React.FunctionComponent<OrderReceiptMobileProps> = ({
  activeOrder,
}) => {
  const ref = useRef(null);
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
    return fields;
  }, [activeOrder, cashier]);

  const printReceipt = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (ref.current) {
      html2canvas(ref.current!).then((canvas) => {
        const image = canvas
          .toDataURL('image/jpeg')
          .replace('data:image/jpeg;base64,', '');
        // @ts-ignore
        if (typeof simpos !== 'undefined') {
          // @ts-ignore
          simpos.printReceipt(image);
        }
      });
    }
  };
  useEffect(() => {
    printReceipt();
  }, []);

  return (
    <Box
      width="48mm"
      ref={ref}
      fontSize="10px"
      fontFamily="monospace"
      overflow="hidden"
    >
      <Box width="40mm" margin="0 auto .2rem auto">
        {company.logo && (
          <Image src={`data:image/png;base64,${company.logo}`} />
        )}
      </Box>
      <Box textAlign="center" mb={1}>
        <Text>{company.street}</Text>
      </Box>
      <Text
        textTransform="uppercase"
        fontWeight="medium"
        textAlign="center"
        mb={1}
        fontSize="12px"
      >
        Phiếu thanh toán
      </Text>
      <OrderReceiptSummaryMobile fields={headerFields} />
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th {...py} {...bb}>
              S.Phẩm
            </Th>
            <Th {...py} {...bb} isNumeric>
              Đ.Giá
            </Th>
            <Th {...py} {...bb} isNumeric>
              SL
            </Th>
            <Th {...py} {...bb} isNumeric>
              T.Tiền
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {activeOrder.orderLines.map((orderLine) => (
            <OrderReceiptRowMobile orderLine={orderLine} key={orderLine.id} />
          ))}
        </Tbody>
        <Tfoot>
          <Tr textTransform="uppercase" fontWeight="medium">
            <Td {...py} {...bt} pl="0" pr="0" colSpan={2}>
              Tổng tiền
            </Td>
            <Td {...py} {...bt} pl="0" pr="0" colSpan={2} isNumeric>
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
                <Td colSpan={2} {...py} pl="0.2rem">
                  {method}
                </Td>
                <Td colSpan={2} isNumeric {...py} pl={0} pr={0}>
                  {formatCurrencyNoSymbol(payments[method])}
                </Td>
              </Tr>
            );
          })}
          <Tr textTransform="uppercase" fontWeight="medium">
            <Td {...py} colSpan={2} pl="0" pr="0">
              Tiền trả lại
            </Td>
            <Td {...py} colSpan={2} isNumeric pr={0}>
              {formatCurrencyNoSymbol(change)}
            </Td>
          </Tr>
        </Tfoot>
      </Table>
      <Box textAlign="center" mb={2}>
        <Text mt={2} textTransform="uppercase" fontWeight="medium">
          Cảm ơn quý khách và hẹn gặp lại!
        </Text>
        <Text>Hotline: {company.phone}</Text>
      </Box>
    </Box>
  );
};

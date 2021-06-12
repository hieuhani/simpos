import React, { useCallback, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Box, Text, Button, Flex } from '@chakra-ui/react';
import { useOrderManagerState } from '../../../../contexts/OrderManager';
import { IconConciergeBell } from '../../../../components/icons/output/IconConciergeBell';
import { useData } from '../../../../contexts/DataProvider';
import dayjs from 'dayjs';
import { SimpleOrderLine } from './SimpleOrderLine';

export const KitchenPrintAction: React.FunctionComponent = () => {
  const { activeOrder } = useOrderManagerState();
  const { categoryPrinterIds, printersDict } = useData();
  const ref = useRef(null);
  const kitchenOrderLines = useMemo(() => {
    if (!activeOrder || (activeOrder && activeOrder.orderLines.length === 0)) {
      return [];
    }

    return activeOrder.orderLines.filter((orderLine) => {
      if (!orderLine.productVariant?.posCategId) {
        return false;
      }

      return categoryPrinterIds[orderLine.productVariant?.posCategId[0]];
    });
  }, [activeOrder, categoryPrinterIds]);

  const printId = Object.keys(printersDict)[0];
  const printer = printersDict[printId];
  const printerIp = (() => {
    if (printer && printer.printerType === 'network_printer') {
      return printer.networkPrinterIp;
    }
  })();
  const footer = useMemo(() => {
    const tags = [];
    if (activeOrder?.order.tableNo) {
      tags.push(`Bàn: ${activeOrder.order.tableNo}`);
    }
    if (activeOrder?.order.vibrationCardNo) {
      tags.push(`Thẻ: ${activeOrder.order.vibrationCardNo}`);
    }
    return tags.join(' - ');
  }, [activeOrder]);
  const printKitchenOrder = useCallback(() => {
    if (ref.current && kitchenOrderLines.length > 0) {
      html2canvas(ref.current!).then((canvas) => {
        const image = canvas
          .toDataURL('image/jpeg')
          .replace('data:image/jpeg;base64,', '');
        // @ts-ignore
        if (typeof simpos !== 'undefined') {
          if (printerIp) {
            // @ts-ignore
            simpos.printRestaurantOrder(printerIp + 'SIMPOS' + image);
          } else {
            // @ts-ignore
            simpos.printReceipt(image);
          }
        }
      });
    }
  }, [kitchenOrderLines]);
  if (!activeOrder || kitchenOrderLines.length === 0) {
    return null;
  }
  return (
    <>
      <Box
        width="100px"
        height="66px"
        as={Button}
        backgroundColor="brand.500"
        color="brand.100"
        borderRadius="md"
        d="flex"
        flexDirection="column"
        p={2}
        alignItems="center"
        onClick={printKitchenOrder}
      >
        <Flex h="33px" alignItems="center" justifyContent="center">
          {activeOrder?.order.tableNo ? (
            <Box
              backgroundColor="brand.100"
              color="white"
              w="28px"
              h="28px"
              lineHeight="28px"
              borderRadius="14px"
            >
              {activeOrder.order.tableNo}
            </Box>
          ) : (
            <IconConciergeBell size="20" />
          )}
        </Flex>
        <Text fontSize="sm">In bếp</Text>
      </Box>
      <Box
        position="fixed"
        right="0"
        top="0"
        width="480px"
        backgroundColor="white"
        zIndex="-1"
        p={4}
        fontFamily="monospace"
        ref={ref}
      >
        <Box textAlign="center" mb={4}>
          <Box fontSize="30px">{activeOrder.order.id}</Box>
          <Box fontSize="30px">{dayjs().format('HH:mm')}</Box>
        </Box>
        <Box mb={4}>
          {kitchenOrderLines.map((line) => (
            <SimpleOrderLine key={line.id} orderLine={line} />
          ))}
        </Box>
        {footer && (
          <Box textAlign="center">
            <Box fontSize="20px">{footer}</Box>
          </Box>
        )}
      </Box>
    </>
  );
};

import { Button, Divider, Flex, Heading, Box, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';

import { IconCheckCircle } from '../../../../components/icons';
import { ActiveOrder } from '../../../../contexts/OrderManager';
import { usePreference } from '../../../../contexts/PreferenceProvider';
import { OrderReceipt } from '../OrderReceipt';
import { OrderReceiptMobile } from '../OrderReceipt/OrderReceiptMobile';
export interface OrderCompleteProps {
  activeOrder: ActiveOrder;
  onComplete: () => void;
}

export const OrderComplete: React.FunctionComponent<OrderCompleteProps> = ({
  activeOrder,
  onComplete,
}) => {
  const [printKey, setPrintKey] = useState(Math.random())
  const { isMobile } = usePreference();
  const reprint = () => {
    setPrintKey(Math.random())
  }
  return (
    <Flex
      py={4}
      pt={6}
      flexDirection="column"
      alignItems="center"
      position="relative"
    >
      <Box
        position="absolute"
        top="0.5rem"
        left="0"
        right="0"
        backgroundColor="white"
      >
        <Flex direction="column" alignItems="center" mb={4}>
          <IconCheckCircle size={50} color="#48BB78" />
          <Heading size="sm" mt={2}>
            Thanh toán thành công
          </Heading>
        </Flex>
        <Divider mb={4} />
      </Box>

      {isMobile ? (
        <OrderReceiptMobile key={printKey} activeOrder={activeOrder} />
      ) : (
        <OrderReceipt key={printKey} activeOrder={activeOrder} />
      )}
       <Stack direction="row">
        <Button colorScheme="yellow" onClick={reprint}>
            In hóa đơn
          </Button>
          <Button colorScheme="green" onClick={onComplete}>
            Tiếp tục bán hàng
          </Button>
       </Stack>
    </Flex>
  );
};

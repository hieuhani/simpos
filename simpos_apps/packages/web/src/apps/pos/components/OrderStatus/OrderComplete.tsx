import { Button, Divider, Flex, Heading, Box } from '@chakra-ui/react';
import React from 'react';

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
  const { isMobile } = usePreference();
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
        <OrderReceiptMobile activeOrder={activeOrder} />
      ) : (
        <OrderReceipt activeOrder={activeOrder} />
      )}

      <Button colorScheme="green" onClick={onComplete}>
        Tiếp tục bán hàng
      </Button>
    </Flex>
  );
};

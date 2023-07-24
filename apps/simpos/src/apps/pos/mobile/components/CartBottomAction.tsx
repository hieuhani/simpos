import { Box, Button, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { ActiveOrder } from '../../../../contexts/OrderManager';
import { useActiveOrderExtensions, useMoneyFormatter } from '../../../../hooks';

export interface CartBottomActionProps {
  activeOrder: ActiveOrder;
}

export const CartBottomAction: React.FunctionComponent<CartBottomActionProps> = ({
  activeOrder,
}) => {
  const { getTotalWithTax, getTotalItems } = useActiveOrderExtensions(
    activeOrder,
  );
  const { formatCurrency } = useMoneyFormatter();

  return (
    <Flex
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      backgroundColor="white"
      paddingBottom="env(safe-area-inset-bottom)"
      minHeight="60px"
      px={4}
      boxShadow="rgb(44 51 73 / 60%) 0px 0.5rem 1rem 0px"
      alignItems="center"
    >
      <Box>
        <Text fontWeight="medium" fontSize="lg">
          {formatCurrency(getTotalWithTax())}
        </Text>
        <Text>{getTotalItems()} sản phẩm</Text>
      </Box>
      <Button
        ml="auto"
        backgroundColor="brand.100"
        color="white"
        as={RouterLink}
        to="/pos/cart"
      >
        Xem giỏ hàng
      </Button>
    </Flex>
  );
};

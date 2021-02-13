import { Stack, Box, Flex, Heading } from '@chakra-ui/react';
import React from 'react';
import { IconShoppingCart } from '../../../../components/icons';
import { ActiveOrder } from '../../../../contexts/OrderManager';
import { useActiveOrderExtensions, useMoneyFormatter } from '../../../../hooks';
import {
  CustomerSelectAction,
  VibrationCardAction,
  TableNoAction,
} from '../OrderActions';
import { PaymentAction } from '../OrderActions/PaymentAction';
import { OrderPanel } from '../OrderPanel';
import { OrderSummary } from '../OrderSummary/OrderSummary';
import { SessionBar } from '../SessionBar';

export interface PosSidebarProps {
  activeOrder: ActiveOrder;
}

export const PosSidebar: React.FunctionComponent<PosSidebarProps> = ({
  activeOrder,
}) => {
  const {
    getTotalWithTax,
    getTotalItems,
    getTotalDiscount,
  } = useActiveOrderExtensions(activeOrder);
  const { formatCurrency } = useMoneyFormatter();
  return (
    <>
      <SessionBar px={4} py={2} />
      <Stack px={4} direction="row" spacing={2} mb={2}>
        <CustomerSelectAction />
        <VibrationCardAction />
        <TableNoAction />
      </Stack>
      {activeOrder.orderLines.length === 0 ? (
        <Flex
          flex={1}
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          color="brand.400"
        >
          <IconShoppingCart size="5rem" />
          <Heading mt={2} fontSize="1.2rem" fontWeight="medium">
            Chưa có sản phẩm nào trong giỏ hàng
          </Heading>
        </Flex>
      ) : (
        <Box flex={1} overflowY="auto">
          <OrderPanel activeOrder={activeOrder} />
        </Box>
      )}

      <OrderSummary
        px={4}
        py={2}
        totalAmount={formatCurrency(getTotalWithTax())}
        totalItems={getTotalItems()}
        discount={formatCurrency(getTotalDiscount())}
      />

      <Box px={4} py={2}>
        <PaymentAction
          totalAmount={getTotalWithTax()}
          disabled={activeOrder.orderLines.length === 0}
        />
      </Box>
    </>
  );
};

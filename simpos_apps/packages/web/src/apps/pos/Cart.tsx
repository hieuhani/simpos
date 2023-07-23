import { Stack, Box, Flex, Heading, Button } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { IconHome } from '../../components/icons/output/IconHome';
import { ActiveOrder, useOrderManagerState } from '../../contexts/OrderManager';
import { useActiveOrderExtensions, useMoneyFormatter } from '../../hooks';
import { EmptyCart } from './components/Cart/EmptyCart/EmptyCart';
import { OrderLineRowSimple } from './components/Cart/OrderLineRowSimple';
import {
  CustomerSelectAction,
  VibrationCardAction,
  TableNoAction,
} from './components/OrderActions';
import { KitchenPrintAction } from './components/OrderActions/KitchenPrintAction';
import { PaymentAction } from './components/OrderActions/PaymentAction';
import { OrderSummary } from './components/OrderSummary/OrderSummary';

interface CartProps {
  activeOrder: ActiveOrder;
}

export const Cart: React.FunctionComponent<CartProps> = ({ activeOrder }) => {
  const { formatCurrency } = useMoneyFormatter();
  const {
    getTotalWithTax,
    getTotalItems,
    getTotalDiscount,
  } = useActiveOrderExtensions(activeOrder);

  return (
    <Flex height="100vh" flexDirection="column">
      <Flex px={4} py={4} alignItems="center">
        <Heading fontSize="2xl" mr="auto">
          Giỏ hàng
        </Heading>
        <Button backgroundColor="transparent" as={RouterLink} to="/pos">
          <IconHome size="20" />
        </Button>
      </Flex>
      <Stack px={4} direction="row" spacing={2} mb={2}>
        <CustomerSelectAction />
        <KitchenPrintAction />
        <VibrationCardAction />
        <TableNoAction />
      </Stack>
      {activeOrder.orderLines.length === 0 ? (
        <EmptyCart />
      ) : (
        <Box flex={1} overflowY="auto">
          <Box px="4">
            <Stack spacing={4}>
              {activeOrder.orderLines.map((orderLine) => (
                <OrderLineRowSimple key={orderLine.id} orderLine={orderLine} />
              ))}
            </Stack>
          </Box>
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
    </Flex>
  );
};

const CartWithActiveOrder: React.FunctionComponent = () => {
  const { activeOrder } = useOrderManagerState();
  if (!activeOrder) {
    return <EmptyCart />;
  }
  return <Cart activeOrder={activeOrder} />;
};

export default CartWithActiveOrder;

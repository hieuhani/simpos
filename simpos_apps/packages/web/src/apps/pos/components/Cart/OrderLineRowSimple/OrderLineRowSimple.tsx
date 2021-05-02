import React from 'react';
import { Box, Heading, Badge, Flex, Stack, Button } from '@chakra-ui/react';
import { useOrderManagerAction } from '../../../../../contexts/OrderManager';
import {
  useMoneyFormatter,
  useOrderLineExtensions,
} from '../../../../../hooks';
import { OrderLine } from '../../../../../services/db';
import { ProductImageThumb } from '../../ProductCard/ProductImageThumb';
import { Stepper } from '../../../../../components/Stepper';
import { IconTrashAlt } from '../../../../../components/icons';

export interface OrderLineRowSimpleProps {
  orderLine: OrderLine;
}

export const OrderLineRowSimple: React.FunctionComponent<OrderLineRowSimpleProps> = ({
  orderLine,
}) => {
  const { formatCurrency } = useMoneyFormatter();
  const { getUnitDisplayPrice, getDisplayPrice } = useOrderLineExtensions(
    orderLine,
  );
  const { updateOrderLine, deleteOrderLine } = useOrderManagerAction();
  if (!orderLine.productVariant) {
    return null;
  }

  const onChange = (value: number) => {
    if (value !== orderLine.qty) {
      if (value === 0) {
        deleteOrderLine(orderLine.id!);
      } else {
        updateOrderLine(orderLine.id!, {
          qty: value,
        });
      }
    }
  };

  const onDeleteOrderLine = () => {
    deleteOrderLine(orderLine.id!);
  };

  return (
    <Flex
      alignItems="center"
      mt={1}
      px={2}
      py={3}
      w="full"
      rounded="md"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
      background="white"
      flexWrap="wrap"
    >
      <Box width="55px" position="relative">
        <ProductImageThumb variant={orderLine.productVariant} />
        <Badge
          position="absolute"
          top="-0.75rem"
          right="-0.75rem"
          backgroundColor="green.500"
          color="white"
          borderRadius="full"
          width={6}
          height={6}
          alignItems="center"
          justifyContent="center"
          display="flex"
        >
          {orderLine.qty}
        </Badge>
      </Box>
      <Box ml={4} textAlign="left">
        <Heading size="sm" fontWeight="medium" mb={1}>
          {orderLine.productVariant?.name}
        </Heading>
        <Stack direction="row">
          {orderLine.productVariant.defaultCode && (
            <Badge>{orderLine.productVariant.defaultCode}</Badge>
          )}
          <Badge>{formatCurrency(getUnitDisplayPrice())}</Badge>
        </Stack>
      </Box>
      <Box ml="auto">
        <Heading size="sm">{formatCurrency(getDisplayPrice())}</Heading>
      </Box>
      <Flex
        flexBasis="100%"
        justifyContent="center"
        alignItems="center"
        mt={3}
        borderTop="1px solid"
        pt={3}
        borderColor="gray.200"
      >
        <Button mr="auto" size="sm" onClick={onDeleteOrderLine}>
          <IconTrashAlt size="16" />
        </Button>
        <Stepper value={orderLine.qty} onChange={onChange} />
      </Flex>
    </Flex>
  );
};

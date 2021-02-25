import React from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { IconTimes } from '../../../../components/icons';
import { Order } from '../../../../services/db';

export interface OrderTabProps {
  order: Order;
  active?: Boolean;
  onSelectOrder: () => void;
  onDeleteOrder: () => void;
}

export const OrderTab: React.FunctionComponent<OrderTabProps> = ({
  order,
  active,
  onSelectOrder,
  onDeleteOrder,
}) => (
  <Flex
    borderWidth="2px"
    borderColor={active ? 'brand.100' : 'gray.100'}
    backgroundColor={active ? 'brand.100' : 'transparent'}
    borderRadius="full"
    color={active ? 'white' : 'gray.800'}
    flexDirection="row"
  >
    <Box
      as="button"
      px="2"
      py="1"
      d="flex"
      alignItems="center"
      borderRight="2px solid"
      borderColor={active ? 'brand.200' : 'gray.100'}
      onClick={onSelectOrder}
    >
      <Text mr="2">#{order.sequenceNumber}</Text>
      <Text fontWeight="medium">
        {dayjs(order.creationDate).format('HH:mm')}
      </Text>
    </Box>
    <Box as="button" px="2" py="1" onClick={onDeleteOrder}>
      <IconTimes />
    </Box>
  </Flex>
);

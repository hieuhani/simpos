import React from 'react';
import { Flex } from '@chakra-ui/react';
import { IconPlus } from '../../../../components/icons';

export interface OrderTabAddProps {
  onClick: () => void;
}
export const OrderTabAdd: React.FunctionComponent<OrderTabAddProps> = ({
  onClick,
}) => (
  <Flex
    as="button"
    borderWidth="2px"
    borderColor="brand.500"
    borderRadius="full"
    px="3"
    alignItems="center"
    onClick={onClick}
  >
    <IconPlus color="#1FB886" />
  </Flex>
);

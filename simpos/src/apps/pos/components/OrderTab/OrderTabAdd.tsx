import React from 'react';
import { Flex, Icon } from '@chakra-ui/react';

export const OrderTabAdd: React.FunctionComponent = () => (
  <Flex
    as="button"
    borderWidth="2px"
    borderColor="gray.100"
    borderRadius="full"
    px="3"
    alignItems="center"
  >
    <Icon name="add" size="0.625rem" />
  </Flex>
);

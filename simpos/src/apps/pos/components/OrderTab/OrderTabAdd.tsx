import React from 'react';
import { Flex } from '@chakra-ui/react';
import { IconPlus } from '../../../../components/icons';

export const OrderTabAdd: React.FunctionComponent = () => (
  <Flex
    as="button"
    borderWidth="2px"
    borderColor="gray.100"
    borderRadius="full"
    px="3"
    alignItems="center"
  >
    <IconPlus />
  </Flex>
);

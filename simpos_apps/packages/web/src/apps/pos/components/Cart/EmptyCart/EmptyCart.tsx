import { Flex, Heading } from '@chakra-ui/react';
import React from 'react';
import { IconShoppingCart } from '../../../../../components/icons';

export const EmptyCart: React.FunctionComponent = () => (
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
);

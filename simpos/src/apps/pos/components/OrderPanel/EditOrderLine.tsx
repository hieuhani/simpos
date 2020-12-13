import { Flex, Box, Heading, Image } from '@chakra-ui/react';
import React from 'react';
import { ProductVariant } from '../../../../services/db';

export interface EditOrderLineProps {
  productVariant: ProductVariant;
  unitPrice: string;
}

export const EditOrderLine: React.FunctionComponent<EditOrderLineProps> = ({
  productVariant,
  unitPrice,
}) => {
  return (
    <Flex>
      <Box width="55px" position="relative">
        <Image
          borderRadius="md"
          src="https://images.foody.vn/res/g101/1002166/s120x120/bd77f2d7-36a3-43ef-953f-536f50001570.jpg"
          alt="Banh my"
        />
      </Box>
      <Box textAlign="left" ml={2} flex={1}>
        <Heading size="sm" fontWeight="medium">
          {productVariant.displayName}
        </Heading>

        <Flex alignItems="center" justifyContent="space-between" mt={2}>
          <Heading size="sm">{unitPrice}</Heading>
        </Flex>
      </Box>
    </Flex>
  );
};

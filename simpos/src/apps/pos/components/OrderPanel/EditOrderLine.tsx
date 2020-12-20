import { Flex, Box, Heading } from '@chakra-ui/react';
import React from 'react';
import { ProductVariant } from '../../../../services/db';
import { ProductImageThumb } from '../ProductCard/ProductImageThumb';

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
        <ProductImageThumb variant={productVariant} />
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

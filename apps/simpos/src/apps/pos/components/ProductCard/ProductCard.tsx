import React from 'react';
import { Badge, Box, Flex, Heading, Text } from '@chakra-ui/react';
import { Product } from '../../../../services/db';
import {
  useMoneyFormatter,
  useProductVariantExtensions,
} from '../../../../hooks';
import { ProductImageThumb } from './ProductImageThumb';

export interface ProductCardProps {
  product: Product;
  onClick: () => void;
}
export const ProductCard: React.FunctionComponent<ProductCardProps> = ({
  product,
  onClick,
}) => {
  const { getPrice } = useProductVariantExtensions(product.productVariants[0]);
  const price = getPrice();
  const { formatCurrency } = useMoneyFormatter();

  return (
    <Box
      as="button"
      display="flex"
      onClick={onClick}
      background="white"
      p={2}
      shadow="sm"
      borderRadius="sm"
    >
      <Box width="66px">
        <ProductImageThumb variant={product.productVariants[0]} />
      </Box>
      <Box textAlign="left" ml={2} flex={1}>
        <Heading size="sm" fontWeight="medium">
          {/* {product.defaultCode && <Badge mr={1}>{product.defaultCode}</Badge>} */}
          {product.name}
        </Heading>

        <Flex alignItems="center" justifyContent="space-between" mt={2}>
          <Heading size="sm" color="brand.100">
            {formatCurrency(price, 'Product Price')}
          </Heading>
          {product.productVariantIds.length > 1 && (
            <Text fontSize="sm">
              Có {product.productVariantIds.length} biến thể
            </Text>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

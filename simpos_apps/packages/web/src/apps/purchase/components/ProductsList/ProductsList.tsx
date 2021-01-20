import { Badge, Box, Grid, Heading, Stack, Text, Flex } from '@chakra-ui/react';
import React from 'react';
import { IconCartPlus } from '../../../../components/icons/output/IconCartPlus';
import { ProductProduct } from '../../../../services/product';
import { formatMoney } from '../../../../utils';

export interface ProductsListProps {
  products: ProductProduct[];
  onSelectProduct: (product: ProductProduct) => void;
}
export const ProductsList: React.FunctionComponent<ProductsListProps> = ({
  products,
  onSelectProduct,
}) => {
  return (
    <>
      {products.map((product) => (
        <Grid
          key={product.id}
          rounded="md"
          backgroundColor="gray.50"
          boxShadow="sm"
          borderRadius="md"
          alignItems="center"
          p={4}
          mb={4}
          templateColumns="2fr 1fr 1fr"
          w="full"
          as="button"
          textAlign="left"
          onClick={() => onSelectProduct(product)}
        >
          <Stack>
            {product.defaultCode && (
              <Badge alignSelf="flex-start">{product.defaultCode}</Badge>
            )}
            <Heading fontWeight="normal" fontSize="lg">
              {product.name}
            </Heading>
          </Stack>
          <Stack direction="row" mr="auto">
            <Box>
              <Text color="brand.100" fontWeight="medium">
                Giá bán
              </Text>
              <Text>{formatMoney(product.lstPrice)}</Text>
            </Box>
            <Box>
              <Text color="brand.100" fontWeight="medium">
                Số lượng tồn
              </Text>
              <Text>{product.qtyAvailable}</Text>
            </Box>
          </Stack>
          <Flex justifyContent="flex-end">
            <IconCartPlus size={26} />
          </Flex>
        </Grid>
      ))}
    </>
  );
};

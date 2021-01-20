import React from 'react';
import { Button, Heading, Box, Badge } from '@chakra-ui/react';
import { IconChevronRight } from '../../../../components/icons';
import { ProductVariant } from '../../../../services/db';
import { ProductImageThumb } from '../ProductCard/ProductImageThumb';

export interface ProductVariantLineProps {
  onSelect: () => void;
  variant: ProductVariant;
}

export const ProductVariantLine: React.FunctionComponent<ProductVariantLineProps> = ({
  onSelect,
  variant,
}) => {
  return (
    <Button
      display="flex"
      justifyContent="flex-start"
      flexDirection="row"
      alignItems="center"
      px={2}
      py={2}
      backgroundColor="white"
      onClick={onSelect}
      height="auto"
    >
      <Box width="48px" mr={2}>
        <ProductImageThumb variant={variant} />
      </Box>
      <Box textAlign="left">
        <Badge>{variant.defaultCode}</Badge>
        <Heading size="sm" fontWeight="medium">
          {variant.displayName}
        </Heading>
      </Box>
      <Box ml="auto">
        <IconChevronRight size="22" color="#666" />
      </Box>
    </Button>
  );
};

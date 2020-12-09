import React from 'react';
import { Stack } from '@chakra-ui/react';
import { ProductVariant } from '../../../../services/db';
import { ProductVariantLine } from './ProductVariantLine';

export interface ProductVariantSelectProps {
  variants: ProductVariant[];
  onSelectVariant: (variantId: number) => void;
}

export const ProductVariantSelect: React.FunctionComponent<ProductVariantSelectProps> = ({
  variants,
  onSelectVariant,
}) => {
  return (
    <Stack spacing={2} mb={4}>
      {variants.map((variant) => (
        <ProductVariantLine
          key={variant.id}
          onSelect={() => onSelectVariant(variant.id)}
          variant={variant}
        />
      ))}
    </Stack>
  );
};

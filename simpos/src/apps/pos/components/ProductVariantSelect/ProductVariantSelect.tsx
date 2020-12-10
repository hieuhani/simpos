import React from 'react';
import { Stack } from '@chakra-ui/react';
import { ProductVariant } from '../../../../services/db';
import { ProductVariantLine } from './ProductVariantLine';

export interface ProductVariantSelectProps {
  variants: ProductVariant[];
  onSelectVariant: (variant: ProductVariant) => void;
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
          onSelect={() => onSelectVariant(variant)}
          variant={variant}
        />
      ))}
    </Stack>
  );
};

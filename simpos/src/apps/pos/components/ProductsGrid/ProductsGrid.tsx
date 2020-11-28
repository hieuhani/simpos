import { Grid } from '@chakra-ui/react';
import React from 'react';
import { useSearchProductState } from '../../../../contexts/SearchProduct';
import { ProductCard } from '../ProductCard';

export const ProductsGrid: React.FunctionComponent = () => {
  const state = useSearchProductState();
  return (
    <Grid
      gap={2}
      templateColumns={[
        '1fr',
        '1fr',
        'repeat(2, 1fr)',
        'repeat(3, 1fr)',
        'repeat(4, 1fr)',
      ]}
    >
      {state.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Grid>
  );
};

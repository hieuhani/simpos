import {
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useOrderManagerAction } from '../../../../contexts/OrderManager';
import { useSearchProductState } from '../../../../contexts/SearchProduct';
import { Product, ProductVariant } from '../../../../services/db';
import { ProductCard } from '../ProductCard';
import { ProductVariantSelect } from '../ProductVariantSelect';

export const ProductsGrid: React.FunctionComponent = () => {
  const state = useSearchProductState();
  const { addProductVariantToCart } = useOrderManagerAction();
  const [selectingVariants, setSelectingVariants] = useState<ProductVariant[]>(
    [],
  );

  const onSelectVariant = async (variant: ProductVariant) => {
    await addProductVariantToCart(variant);
    setSelectingVariants([]);
  };

  const onSelectProduct = (product: Product) => {
    if (product.productVariantIds.length > 1) {
      setSelectingVariants(product.productVariants);
    } else {
      onSelectVariant(product.productVariants[0]);
    }
  };
  return (
    <>
      <Grid
        gap={1}
        background="gray.50"
        border="gray.50"
        borderWidth="1"
        templateColumns={[
          '1fr',
          '1fr',
          'repeat(2, 1fr)',
          'repeat(3, 1fr)',
          'repeat(4, 1fr)',
        ]}
      >
        {state.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onSelectProduct(product)}
          />
        ))}
      </Grid>
      <Modal
        isOpen={selectingVariants.length > 0}
        onClose={() => setSelectingVariants([])}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chọn biến thể</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectingVariants.length > 0 && (
              <ProductVariantSelect
                variants={selectingVariants}
                onSelectVariant={onSelectVariant}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

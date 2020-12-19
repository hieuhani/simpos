import React, { useMemo } from 'react';
import { Image } from '@chakra-ui/react';

import { ProductVariant } from '../../../../services/db';
import noImage from './noimage.svg';

export interface ProductImageThumbProps {
  variant?: ProductVariant;
}

export const ProductImageThumb: React.FunctionComponent<ProductImageThumbProps> = ({
  variant,
}) => {
  const productImage = useMemo(() => {
    if (!variant?.images) {
      return noImage;
    }

    return URL.createObjectURL(variant.images[128]);
  }, [variant]);

  return <Image borderRadius="md" src={productImage} alt={variant?.name} />;
};

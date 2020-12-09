import React from 'react';
import { Button, Heading, Box, Badge, Image } from '@chakra-ui/react';
import { IconChevronRight } from '../../../../components/icons';
import { ProductVariant } from '../../../../services/db';

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
        <Image
          borderRadius="md"
          src="https://images.foody.vn/res/g101/1002166/s120x120/bd77f2d7-36a3-43ef-953f-536f50001570.jpg"
          alt="Banh my"
        />
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

import {
  Box,
  Heading,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { IconSearch } from '../../../../components/icons';
import { useDebounce } from '../../../../hooks/use-debounce';
import { ProductProduct, productService } from '../../../../services/product';
import { usePurchaseDispatch } from '../../contexts/PurchaseContext';
import { ProductsList } from '../ProductsList';

export const PurchaseSelectProduct: React.FunctionComponent = () => {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 500);
  const [products, setProducts] = useState<ProductProduct[]>([]);
  const dispatch = usePurchaseDispatch();

  const findProducts = async (term: string) => {
    const foundProducts = await productService.getProducts([
      ['purchase_ok', '=', true],
      '|',
      ['default_code', 'ilike', term],
      ['name', 'ilike', term],
    ]);
    setProducts(foundProducts);
  };

  useEffect(() => {
    findProducts(debouncedKeyword);
  }, [debouncedKeyword]);

  const onSelectProduct = (product: ProductProduct) => {
    dispatch({
      type: 'ADD_LINE',
      payload: product,
    });
  };

  return (
    <Flex overflow="hidden" flexDir="column">
      <Flex px={4} alignItems="center" mb={4}>
        <Heading color="brand.100" size="md" mr="auto">
          Danh sách sản phẩm
        </Heading>
        <InputGroup size="md" width="250px" background="white">
          <Input
            pr="3rem"
            placeholder="Tìm kiếm"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <InputRightElement width="3rem">
            <IconSearch size="20" color="gray" />
          </InputRightElement>
        </InputGroup>
      </Flex>
      <Box flex={1} overflowY="auto" px={4}>
        <ProductsList products={products} onSelectProduct={onSelectProduct} />
      </Box>
    </Flex>
  );
};

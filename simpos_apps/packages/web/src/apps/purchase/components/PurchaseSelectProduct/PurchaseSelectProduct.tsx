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
import { PosCategory } from '../../../../services/db';
import { ProductProduct, productService } from '../../../../services/product';
import { usePurchaseDispatch } from '../../contexts/PurchaseContext';
import { CategoryPanel } from '../CategoryPanel';
import { ProductsList } from '../ProductsList';

export const PurchaseSelectProduct: React.FunctionComponent = () => {
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState(0);
  const debouncedKeyword = useDebounce(keyword, 500);
  const [products, setProducts] = useState<ProductProduct[]>([]);
  const dispatch = usePurchaseDispatch();

  const findProducts = async (term: string, cid?: number) => {
    const foundProducts = await productService.getProducts(
      cid
        ? [
            '&',
            ['pos_categ_id', 'child_of', cid],
            ['type', '=', 'product'],
            ['purchase_ok', '=', true],
            '|',
            ['default_code', 'ilike', term],
            ['name', 'ilike', term],
          ]
        : [
            '&',
            ['purchase_ok', '=', true],
            ['type', '=', 'product'],
            '|',
            ['default_code', 'ilike', term],
            ['name', 'ilike', term],
          ],
    );
    setProducts(foundProducts);
  };

  const onClickCategory = (category: PosCategory) => {
    setCategoryId(category.id);
    findProducts(debouncedKeyword, category.id);
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
      <CategoryPanel
        categoryId={categoryId}
        onClickCategory={onClickCategory}
      />
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

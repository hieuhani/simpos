import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import React from 'react';
import { IconSearch } from '../../../../components/icons/output/IconSearch';
import {
  useSearchProductDispatch,
  useSearchProductState,
} from '../../../../contexts/SearchProduct';

export const SearchPanel: React.FunctionComponent = () => {
  const state = useSearchProductState();
  const dispatch = useSearchProductDispatch();
  return (
    <Flex align="center" px={4} mb={2}>
      <Box mr="auto">
        <Heading size="md">Danh sách sản phẩm</Heading>
      </Box>
      <InputGroup size="md" width="250px">
        <Input
          pr="3rem"
          placeholder="Tìm kiếm"
          value={state.keyword}
          onChange={(event) =>
            dispatch({ type: 'KEYWORD_CHANGED', payload: event.target.value })
          }
        />
        <InputRightElement width="3rem">
          <IconSearch size="20" color="gray" />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

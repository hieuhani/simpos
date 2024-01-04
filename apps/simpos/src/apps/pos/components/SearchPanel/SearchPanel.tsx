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
import { usePreference } from '../../../../contexts/PreferenceProvider';
import {
  useSearchProductDispatch,
  useSearchProductState,
} from '../../../../contexts/SearchProduct';

export const SearchPanel: React.FunctionComponent = () => {
  const state = useSearchProductState();
  const dispatch = useSearchProductDispatch();
  const { isMobile } = usePreference();
  return (
    <Flex align="center" px={4} py={2} background="gray.50">
      {!isMobile && (
        <Box mr="auto">
          <Heading size="md" color="brand.100">
            Danh sách sản phẩm
          </Heading>
        </Box>
      )}

      <InputGroup
        size="md"
        width={isMobile ? 'full' : '250px'}
        background="white"
        borderRadius="md"
      >
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

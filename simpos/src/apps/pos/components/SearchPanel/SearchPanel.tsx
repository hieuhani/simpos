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

export const SearchPanel: React.FunctionComponent = () => (
  <Flex align="center" px={2} mb={2}>
    <Box mr="auto">
      <Heading size="md">Danh sach san pham</Heading>
    </Box>
    <InputGroup size="md" width="250px">
      <Input pr="3rem" placeholder="Tim kiem" />
      <InputRightElement width="3rem">
        <IconSearch size="20" color="gray" />
      </InputRightElement>
    </InputGroup>
  </Flex>
);

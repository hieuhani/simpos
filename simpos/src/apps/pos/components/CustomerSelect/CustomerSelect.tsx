import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from '@chakra-ui/react';
import { IconSearch } from '../../../../components/icons';
import { CustomerRow } from './CustomerRow';
import { IconCheckCircle } from '../../../../components/icons/output/IconCheckCircle';

export const CustomerSelect: React.FunctionComponent = () => (
  <Box>
    <InputGroup size="md" mb={2}>
      <Input pr="3rem" placeholder="Tim kiem" />
      <InputRightElement width="3rem">
        <IconSearch size="20" color="gray" />
      </InputRightElement>
    </InputGroup>
    <Stack spacing={2}>
      {[1, 2, 3, 4, 5].map((i) => (
        <CustomerRow key={i} />
      ))}
      <Flex justifyContent="space-between">
        <Box>Pagination</Box>
        <Text>Tim thay 10 ket qua</Text>
      </Flex>
    </Stack>
    <Divider my={2} />
    <Flex alignItems="center" py={1}>
      <Avatar name="Anh Kien" src="https://bit.ly/dan-abramov" />
      <Box ml={2}>
        <Heading size="sm" fontWeight="medium">
          Anh Kien
        </Heading>
        <Text fontWeight="400" fontSize="sm">
          0973658655 - 126/528 Hoan Kiem
        </Text>
      </Box>
    </Flex>
    <HStack ml="auto">
      <Button>Chon</Button>
      <Button>Bo chon</Button>
    </HStack>
  </Box>
);

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
import { IconEdit, IconSearch } from '../../../../components/icons';
import { CustomerRow } from './CustomerRow';

export const CustomerSelect: React.FunctionComponent = () => (
  <Box>
    <HStack mb={2}>
      <InputGroup size="md">
        <Input pr="3rem" placeholder="Tim kiem" />
        <InputRightElement width="3rem">
          <IconSearch size="20" color="gray" />
        </InputRightElement>
      </InputGroup>
      <Button colorScheme="blue">Them</Button>
    </HStack>
    <Stack spacing={2}>
      {[1, 2, 3, 4, 5].map((i) => (
        <CustomerRow key={i} />
      ))}
      <Flex justifyContent="space-between" py={2}>
        <Box>Pagination</Box>
        <Text>Tim thay 10 ket qua</Text>
      </Flex>
    </Stack>
    <Box shadow="sm" backgroundColor="gray.50" borderRadius="md" mb={4} p={2}>
      <Flex alignItems="center" mb={3}>
        <Avatar name="Anh Kien" src="https://bit.ly/dan-abramov" />
        <Box ml={2}>
          <Heading size="sm" fontWeight="medium">
            Anh Kien
          </Heading>
          <Text fontWeight="400" fontSize="sm">
            0973658655 - 126/528 Hoan Kiem
          </Text>
        </Box>
        <Box ml="auto">
          <IconEdit />
        </Box>
      </Flex>
      <Divider mb={3} />
      <HStack justify="flex-end">
        <Button colorScheme="red" variant="outline">
          Bo chon
        </Button>
        <Button colorScheme="red">Chon</Button>
      </HStack>
    </Box>
  </Box>
);

import React, { useEffect, useState } from 'react';
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
import { Partner, partnerRepository } from '../../../../services/db';

export const CustomerSelect: React.FunctionComponent = () => {
  const [partners, setPartners] = useState<Partner[]>([]);

  const fetchPartners = async () => {
    const foundPartners = await partnerRepository.findPartners();
    setPartners(foundPartners);
  };
  useEffect(() => {
    fetchPartners();
  }, []);
  return (
    <Box>
      <HStack mb={2}>
        <InputGroup size="md">
          <Input pr="3rem" placeholder="Tìm kiếm" />
          <InputRightElement width="3rem">
            <IconSearch size="20" color="gray" />
          </InputRightElement>
        </InputGroup>
        <Button colorScheme="blue">Thêm</Button>
      </HStack>
      <Stack spacing={2}>
        {partners.map((partner) => (
          <CustomerRow key={partner.id} />
        ))}
        <Flex justifyContent="space-between" py={2}>
          <Box>Pagination</Box>
          <Text>Tìm thấy {partners.length} kết quả</Text>
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
};

import React from 'react';
import { Badge, Box, Flex, Heading, Image, Text } from '@chakra-ui/core';

export const ProductCard: React.FunctionComponent = () => (
  <Box as="button" display="flex" mb={2}>
    <Box size="66px">
      <Image
        borderRadius="md"
        src="https://images.foody.vn/res/g101/1002166/s120x120/bd77f2d7-36a3-43ef-953f-536f50001570.jpg"
        alt="Banh my"
      />
    </Box>
    <Box textAlign="left" ml={2}>
      <Heading size="sm" fontWeight="medium">
        <Badge mr={2}>B002</Badge>Banh my pate xuc xich
      </Heading>

      <Flex alignItems="center" justifyContent="space-between" mt={2}>
        <Heading size="sm">120,000d</Heading>
        <Text fontSize="sm">Co 2 bien the</Text>
      </Flex>
    </Box>
  </Box>
);

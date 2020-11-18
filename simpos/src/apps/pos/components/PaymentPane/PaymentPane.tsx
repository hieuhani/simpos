import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { NumberPad } from '../NumberPad/NumberPad';

export const PaymentPane: React.FunctionComponent = () => (
  <Box>
    <Box
      borderRadius="md"
      border="1px solid"
      borderColor="gray.200"
      px={4}
      py={2}
      mb={4}
    >
      <Text fontSize="2xl" color="gray.600">
        120,000
      </Text>
    </Box>
    <NumberPad />
  </Box>
);

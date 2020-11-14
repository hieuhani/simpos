import React from 'react';
import { Button, Heading, Text, Box } from '@chakra-ui/core';

export const CustomerPanel: React.FunctionComponent = () => (
  <Box px={2}>
    <Button
      p={2}
      size="lg"
      w="full"
      display="flex"
      textAlign="left"
      alignItems="flex-start"
      flexDirection="column"
    >
      <Heading size="md">Anh Kien</Heading>
      <Text fontSize="sm" fontWeight="400">
        Khach quay tro lai (14 don hang)
      </Text>
    </Button>
  </Box>
);

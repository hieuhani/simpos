import React from 'react';
import { Avatar, Box, Button, Heading, Text } from '@chakra-ui/react';
import { IconCheckCircle } from '../../../../components/icons/output/IconCheckCircle';

export const CustomerRow: React.FunctionComponent = () => (
  <Button
    display="flex"
    justifyContent="flex-start"
    textAlign="left"
    alignItems="center"
    p={2}
    h="4rem"
    backgroundColor="white"
  >
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
      <IconCheckCircle color="green" />
    </Box>
  </Button>
);

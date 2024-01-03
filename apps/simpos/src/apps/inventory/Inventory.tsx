import React from 'react';
import { NavigationBarGeneral } from '../pos/components/NavigationBar';
import { Box, Container, Heading } from '@chakra-ui/react';

export const Inventory: React.FunctionComponent = () => (
  <>
    <NavigationBarGeneral />
    <Box height="calc(100vh - 112px)" overflowY="auto">
      <Container maxW="6xl" pt={4}>
        <Heading mb={4}>Inventory</Heading>
      </Container>
    </Box>
  </>
);

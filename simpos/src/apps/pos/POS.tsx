import React from 'react';
import { Grid, Box } from '@chakra-ui/core';
import { NavigationBar } from './components/NavigationBar';

export const POS: React.FunctionComponent = () => (
  <Grid templateColumns="2fr 1fr" h="100vh">
    <Box overflow="hidden">
      <NavigationBar />
      Main
    </Box>
    <Box bg="gray.50">DKM</Box>
  </Grid>
);

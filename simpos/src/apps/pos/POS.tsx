import React from 'react';
import { Grid, Box, Flex } from '@chakra-ui/core';
import { NavigationBar } from './components/NavigationBar';
import { CategoryPanel } from './components/CategoryPanel';
import { SearchPanel } from './components/SearchPanel';
import { ProductCard } from './components/ProductCard';
import { SessionBar } from './components/SessionBar/SessionBar';
import { CustomerPanel } from './components/CustomerPanel';

export const POS: React.FunctionComponent = () => (
  <Grid templateColumns="2fr 1fr" h="100vh">
    <Flex overflow="hidden" flexDir="column">
      <NavigationBar />
      <CategoryPanel />
      <SearchPanel />
      <Box flex={1} overflowY="auto" px={2}>
        <Grid
          gap={2}
          templateColumns={[
            '1fr',
            '1fr',
            'repeat(2, 1fr)',
            'repeat(3, 1fr)',
            'repeat(4, 1fr)',
          ]}
        >
          {[
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
          ].map((i) => (
            <ProductCard key={i} />
          ))}
        </Grid>
      </Box>
    </Flex>
    <Box bg="gray.50">
      <SessionBar />
      <CustomerPanel />
    </Box>
  </Grid>
);

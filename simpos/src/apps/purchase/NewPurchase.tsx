import { Flex, Grid } from '@chakra-ui/react';
import React from 'react';
import { NavigationBarGeneral } from '../pos/components/NavigationBar';

const NewPurchase: React.FunctionComponent = () => {
  return (
    <>
      <NavigationBarGeneral />
      <Grid templateColumns="1fr 1fr" h="100vh">
        <Flex overflow="hidden" flexDir="column">
          xxx
        </Flex>
        <Flex overflow="hidden" bg="gray.50" flexDir="column">
          XXX
        </Flex>
      </Grid>
    </>
  );
};

export default NewPurchase;

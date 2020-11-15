import { Box, Button, HStack } from '@chakra-ui/react';
import React from 'react';
import { IconMinus } from '../icons/output/IconMinus';
import { IconPlus } from '../icons/output/IconPlus';

export const Stepper: React.FunctionComponent = () => (
  <HStack>
    <Button ml="auto" size="sm">
      <IconMinus size="20" />
    </Button>
    <Box w="30px" textAlign="center">
      12
    </Box>
    <Button ml="auto" size="sm">
      <IconPlus size="20" />
    </Button>
  </HStack>
);

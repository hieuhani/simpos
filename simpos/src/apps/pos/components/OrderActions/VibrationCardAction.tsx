import React from 'react';

import {
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  Button,
  Portal,
  Flex,
} from '@chakra-ui/react';
import { IconFlag } from '../../../../components/icons';

export const VibrationCardAction: React.FunctionComponent = () => (
  <Popover>
    <PopoverTrigger>
      <Box
        width="100px"
        height="66px"
        as={Button}
        backgroundColor="gray.200"
        borderRadius="md"
        d="flex"
        flexDirection="column"
        p={2}
        alignItems="center"
      >
        <Flex h="33px" alignItems="center" justifyContent="center">
          <IconFlag size="20" />
        </Flex>
        <Text fontSize="sm">So ban</Text>
      </Box>
    </PopoverTrigger>
    <Portal>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Chon so the rung</PopoverHeader>
        <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
      </PopoverContent>
    </Portal>
  </Popover>
);

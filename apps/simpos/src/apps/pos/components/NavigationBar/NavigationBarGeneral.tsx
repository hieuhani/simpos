import React from 'react';
import {
  Flex,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
} from '@chakra-ui/react';

import { IconBars } from '../../../../components/icons';

import { DrawerNavigation } from '../../../../components/DrawerNavigation';

export const NavigationBarGeneral: React.FunctionComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef: any = React.useRef();
  return (
    <>
      <Flex align="center" px={4} py={2}>
        <Button ref={btnRef} onClick={onOpen}>
          <IconBars size="20" color="#1FB886" />
        </Button>
      </Flex>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay>
          <DrawerNavigation />
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

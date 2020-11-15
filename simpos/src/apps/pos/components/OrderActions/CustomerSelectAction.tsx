import React from 'react';
import {
  Box,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Button,
  ModalFooter,
} from '@chakra-ui/react';
import { IconSmile } from '../../../../components/icons/output/IconSmile';
import { CustomerSelect } from '../CustomerSelect';

export const CustomerSelectAction: React.FunctionComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        as="button"
        backgroundColor="gray.200"
        p={2}
        w="full"
        height="66px"
        display="flex"
        textAlign="left"
        alignItems="center"
        borderRadius="md"
        _focus={{
          outline: 'none',
          boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)',
        }}
        onClick={onOpen}
      >
        <IconSmile size="34" />
        <Box ml={2}>
          <Heading size="md" fontWeight="medium">
            Anh Kien
          </Heading>
          <Text fontSize="sm" fontWeight="400">
            Khach quay tro lai (14 don hang)
          </Text>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lua chon khach hang</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CustomerSelect />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

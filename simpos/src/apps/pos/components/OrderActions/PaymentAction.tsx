import React from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import { MakePayment } from '../MakePayment';

export const PaymentAction: React.FunctionComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button width="full" colorScheme="blue" onClick={onOpen}>
        Thanh toán
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thanh toan 595.000d</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MakePayment />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

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
import { useMoneyFormatter } from '../../../../hooks';

export interface PaymentActionProps {
  totalAmount: number;
}

export const PaymentAction: React.FunctionComponent<PaymentActionProps> = ({
  totalAmount,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { formatCurrency } = useMoneyFormatter();

  return (
    <>
      <Button width="full" colorScheme="blue" onClick={onOpen}>
        Thanh toán
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thanh toán {formatCurrency(totalAmount)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MakePayment totalAmount={totalAmount} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

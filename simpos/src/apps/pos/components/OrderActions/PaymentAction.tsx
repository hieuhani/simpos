import React, { useState } from 'react';
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
import { OrderComplete } from '../OrderStatus';
import { ActiveOrder } from '../../../../contexts/OrderManager';

export interface PaymentActionProps {
  totalAmount: number;
}

export const PaymentAction: React.FunctionComponent<PaymentActionProps> = ({
  totalAmount,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paidOrder, setPaidOrder] = useState<ActiveOrder | undefined>();
  const { formatCurrency } = useMoneyFormatter();

  const onPaid = (order: ActiveOrder) => {
    setPaidOrder(order);
  };

  return (
    <>
      <Button
        width="full"
        color="white"
        background="brand.100"
        onClick={onOpen}
      >
        Thanh toán
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        {paidOrder ? (
          <ModalContent>
            <ModalBody>
              <OrderComplete activeOrder={paidOrder} onComplete={onClose} />
            </ModalBody>
          </ModalContent>
        ) : (
          <ModalContent>
            <ModalHeader>Thanh toán {formatCurrency(totalAmount)}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <MakePayment totalAmount={totalAmount} onPaid={onPaid} />
            </ModalBody>
          </ModalContent>
        )}
      </Modal>
    </>
  );
};

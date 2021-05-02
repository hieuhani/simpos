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
  disabled: boolean;
}

export const PaymentAction: React.FunctionComponent<PaymentActionProps> = ({
  totalAmount,
  disabled,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paidOrder, setPaidOrder] = useState<ActiveOrder | undefined>();
  const { formatCurrency } = useMoneyFormatter();

  const onPaid = (order: ActiveOrder) => {
    setPaidOrder(order);
  };

  const onComplete = () => {
    onClose();
    setPaidOrder(undefined);
  };

  return (
    <>
      <Button
        width="full"
        color="white"
        background="brand.100"
        onClick={onOpen}
        disabled={disabled}
      >
        Thanh toán
      </Button>
      <Modal isOpen={isOpen} onClose={onComplete} size="lg">
        <ModalOverlay />
        {paidOrder ? (
          <ModalContent>
            <ModalBody>
              <OrderComplete activeOrder={paidOrder} onComplete={onComplete} />
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

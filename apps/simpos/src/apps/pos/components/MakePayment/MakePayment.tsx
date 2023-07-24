import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { PaymentMethods } from '../PaymentMethods';
import { PaymentPane } from '../PaymentPane';
import {
  ActiveOrder,
  useOrderManagerAction,
} from '../../../../contexts/OrderManager';

export interface MakePaymentProps {
  totalAmount: number;
  onPaid: (order: ActiveOrder) => void;
}

export const MakePayment: React.FunctionComponent<MakePaymentProps> = ({
  totalAmount,
  onPaid,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    number | null
  >(null);
  const toast = useToast();
  const { payOrder } = useOrderManagerAction();
  const onSelectPaymentMethod = (id: number) => {
    setSelectedPaymentMethod(id);
  };

  const onSubmitPayment = async (amount: number) => {
    try {
      const order = await payOrder(amount, selectedPaymentMethod!);
      onPaid({
        ...order,
        context: {
          amount,
          selectedPaymentMethod: selectedPaymentMethod!,
        },
      });
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error',
        description: 'Payment error',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box mb={4}>
      {selectedPaymentMethod ? (
        <>
          <PaymentPane
            paymentValue={totalAmount}
            onSubmitPayment={onSubmitPayment}
          />
          <Button
            mt={4}
            py={2}
            w="full"
            variant="link"
            onClick={() => setSelectedPaymentMethod(null)}
          >
            Chọn phương thức khác
          </Button>
        </>
      ) : (
        <PaymentMethods onSelect={onSelectPaymentMethod} />
      )}
    </Box>
  );
};

import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { PaymentMethods } from '../PaymentMethods';
import { PaymentPane } from '../PaymentPane';
import { useOrderManagerAction } from '../../../../contexts/OrderManager';

export interface MakePaymentProps {
  totalAmount: number;
}

export const MakePayment: React.FunctionComponent<MakePaymentProps> = ({
  totalAmount,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    number | null
  >(null);
  const { payOrder } = useOrderManagerAction();
  const onSelectPaymentMethod = (id: number) => {
    setSelectedPaymentMethod(id);
  };

  const onSubmitPayment = async (amount: number) => {
    await payOrder(amount, selectedPaymentMethod!);
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

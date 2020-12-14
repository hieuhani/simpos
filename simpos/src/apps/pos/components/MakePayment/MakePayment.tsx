import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { PaymentMethods } from '../PaymentMethods';
import { PaymentPane } from '../PaymentPane';

export interface MakePaymentProps {
  totalAmount: number;
}

export const MakePayment: React.FunctionComponent<MakePaymentProps> = ({
  totalAmount,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    number | null
  >(null);
  const onSelectPaymentMethod = (id: number) => {
    setSelectedPaymentMethod(id);
  };

  return (
    <Box mb={4}>
      {selectedPaymentMethod ? (
        <>
          <PaymentPane paymentValue={totalAmount} />
          <Button mt={4} py={2} w="full" variant="link">
            Chọn phương thức khác
          </Button>
        </>
      ) : (
        <PaymentMethods onSelect={onSelectPaymentMethod} />
      )}
    </Box>
  );
};

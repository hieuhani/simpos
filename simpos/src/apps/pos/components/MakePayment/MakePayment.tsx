import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { PaymentMethods } from '../PaymentMethods';
import { PaymentPane } from '../PaymentPane';

export const MakePayment: React.FunctionComponent = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    number | null
  >(null);
  const onSelectPaymentMethod = (id: number) => {
    setSelectedPaymentMethod(id);
  };

  const view = selectedPaymentMethod ? (
    <PaymentPane />
  ) : (
    <PaymentMethods onSelect={onSelectPaymentMethod} />
  );

  return (
    <Box>
      {view}
      <Box h={4} />
    </Box>
  );
};

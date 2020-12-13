import React from 'react';
import { Button, Heading } from '@chakra-ui/react';
import { IconCreditCard, IconMoneyBill } from '../../../../components/icons';
import { PaymentMethod } from '../../../../services/db';

export interface PaymentMethodProps {
  onSelect: () => void;
  paymentMethod: PaymentMethod;
}

export const PaymentMethodControl: React.FunctionComponent<PaymentMethodProps> = ({
  onSelect,
  paymentMethod,
}) => {
  const icon =
    paymentMethod.id === 1 ? (
      <IconMoneyBill size="44" />
    ) : (
      <IconCreditCard size="40" />
    );
  return (
    <Button
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      p={2}
      h="auto"
      backgroundColor="white"
      onClick={onSelect}
    >
      {icon}
      <Heading size="md" fontWeight="medium">
        {paymentMethod.name}
      </Heading>
    </Button>
  );
};

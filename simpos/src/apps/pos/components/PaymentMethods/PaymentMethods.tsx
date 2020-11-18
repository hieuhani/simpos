import React from 'react';
import { Stack } from '@chakra-ui/react';
import { PaymentMethod } from './PaymentMethod';

export interface PaymentMethodsProps {
  onSelect: (id: number) => void;
}

export const PaymentMethods: React.FunctionComponent<PaymentMethodsProps> = ({
  onSelect,
}) => (
  <Stack spacing={2}>
    {[1, 2].map((i) => (
      <PaymentMethod key={i} onSelect={() => onSelect(i)} />
    ))}
  </Stack>
);

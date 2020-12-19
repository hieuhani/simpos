import React from 'react';
import { Grid } from '@chakra-ui/react';
import { PaymentMethodControl } from './PaymentMethodControl';
import { useData } from '../../../../contexts/DataProvider';

export interface PaymentMethodsProps {
  onSelect: (id: number) => void;
}

export const PaymentMethods: React.FunctionComponent<PaymentMethodsProps> = ({
  onSelect,
}) => {
  const data = useData();

  return (
    <Grid gridGap={4} templateColumns="1fr 1fr">
      {data.paymentMethods.map((paymentMethod) => (
        <PaymentMethodControl
          key={paymentMethod.id}
          paymentMethod={paymentMethod}
          onSelect={() => onSelect(paymentMethod.id)}
        />
      ))}
    </Grid>
  );
};

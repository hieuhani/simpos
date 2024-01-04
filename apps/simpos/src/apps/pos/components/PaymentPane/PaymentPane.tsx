import React, { useMemo, useState } from 'react';
import { Alert, Box, Button, HStack, Text } from '@chakra-ui/react';
import {
  NumberPad,
  NumberPadType,
  NumberPadValue,
} from '../NumberPad/NumberPad';
import { useMoneyFormatter } from '../../../../hooks';

const denominations = [
  1000, 2000, 5000, 10000, 20000, 50000, 100000, 150000, 200000, 300000, 400000,
  500000,
];

export interface PaymentPaneProps {
  paymentValue: number;
  onSubmitPayment: (value: number) => void;
}

export const PaymentPane: React.FunctionComponent<PaymentPaneProps> = ({
  paymentValue,
  onSubmitPayment,
}) => {
  const [value, setValue] = useState(0);
  const recommendedValues = useMemo(() => {
    return [
      paymentValue,
      ...denominations.filter((denomination, i) => denomination > paymentValue),
    ].filter((_, i) => i < 5);
  }, [paymentValue]);
  const { formatCurrencyNoSymbol, formatCurrency } = useMoneyFormatter();
  const handlePadClick = (padValue: NumberPadValue, type: NumberPadType) => {
    switch (type) {
      case 'number': {
        if (value === 0) {
          setValue(Number(padValue));
        } else {
          const currentValue = String(value);
          setValue(Number(currentValue + padValue));
        }
        break;
      }
      case 'action': {
        if (padValue === 'BACKSPACE') {
          const currentValue = String(value);
          if (currentValue.length === 1) {
            setValue(0);
          } else {
            setValue(Number(currentValue.slice(0, -1)));
          }
        } else if (padValue === 'ALL_CLEAR') {
          setValue(0);
        } else if (padValue === 'SUBMIT') {
          onSubmitPayment(value);
        }
        break;
      }
      default:
        break;
    }
  };
  return (
    <Box>
      <Box
        borderRadius="md"
        border="1px solid"
        borderColor="gray.200"
        px={4}
        py={2}
        mb={4}
      >
        <Text fontSize="2xl" color="gray.600">
          {formatCurrencyNoSymbol(value)}
        </Text>
      </Box>
      <HStack spacing={2} mb={4}>
        {recommendedValues.map((value) => (
          <Button key={value} size="sm" onClick={() => setValue(value)}>
            {formatCurrencyNoSymbol(value)}
          </Button>
        ))}
      </HStack>
      <NumberPad onClick={handlePadClick} submittable={value >= paymentValue} />
      {value > paymentValue && (
        <Alert mt={2} status="warning" borderRadius="md">
          Change:
          <Text ml={2} fontWeight="bold" fontSize="xl">
            {formatCurrency(value - paymentValue)}
          </Text>
        </Alert>
      )}
    </Box>
  );
};

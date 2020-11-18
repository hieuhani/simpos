import React from 'react';
import { Box, Button, Heading } from '@chakra-ui/react';
import { IconChevronRight, IconCreditCard } from '../../../../components/icons';

export interface PaymentMethodProps {
  onSelect: () => void;
}

export const PaymentMethod: React.FunctionComponent<PaymentMethodProps> = ({
  onSelect,
}) => (
  <Button
    display="flex"
    justifyContent="flex-start"
    textAlign="left"
    alignItems="center"
    p={2}
    h="4rem"
    backgroundColor="white"
    onClick={onSelect}
  >
    <IconCreditCard size="30" />
    <Heading ml={2} size="md" fontWeight="medium">
      Tien mat
    </Heading>
    <Box ml="auto">
      <IconChevronRight size="22" />
    </Box>
  </Button>
);

import React from 'react';
import { Avatar, Box, Button, Heading, Text } from '@chakra-ui/react';
import { IconCheckCircle } from '../../../../components/icons/output/IconCheckCircle';
import { Partner } from '../../../../services/db';

export interface CustomerRowProps {
  customer: Partner;
  checked?: boolean;
  onClick: () => void;
}
export const CustomerRow: React.FunctionComponent<CustomerRowProps> = ({
  customer,
  checked,
  onClick,
}) => {
  const info = [customer.mobile, customer.phone, customer.street]
    .filter(Boolean)
    .join();
  return (
    <Button
      display="flex"
      justifyContent="flex-start"
      textAlign="left"
      alignItems="center"
      p={2}
      h="4rem"
      backgroundColor="white"
      onClick={onClick}
    >
      <Avatar name={customer.name} />
      <Box ml={2} flex="1">
        <Heading size="sm" fontWeight="medium">
          {customer.name}
        </Heading>
        <Text fontWeight="400" fontSize="sm" whiteSpace="normal">
          {info}
        </Text>
      </Box>
      <Box w="4">{checked && <IconCheckCircle color="green" />}</Box>
    </Button>
  );
};

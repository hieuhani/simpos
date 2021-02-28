import { Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { Company } from '../../../../services/db/company';

export interface OrderReceiptFooterProps {
  company: Company;
}
export const OrderReceiptFooter: React.FunctionComponent<OrderReceiptFooterProps> = ({
  company,
}) => (
  <Box textAlign="center" mb={4}>
    <Heading mt={4} textTransform="uppercase" fontWeight="medium" fontSize="sm">
      Cảm ơn quý khách và hẹn gặp lại!
    </Heading>
    <Text>Hotline: {company.phone}</Text>
  </Box>
);

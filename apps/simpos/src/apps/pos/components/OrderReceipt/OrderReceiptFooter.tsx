import { Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { PosConfig } from '../../../../services/db';
import { Company } from '../../../../services/db/company';

export interface OrderReceiptFooterProps {
  company: Company;
  posConfig?: PosConfig;
}
export const OrderReceiptFooter: React.FunctionComponent<
  OrderReceiptFooterProps
> = ({ company, posConfig }) => (
  <Box textAlign="center" mb={4} mt={4}>
    {posConfig?.receiptFooter ? (
      <div
        dangerouslySetInnerHTML={{
          __html: posConfig.receiptFooter,
        }}
      />
    ) : (
      <>
        <Heading
          mt={4}
          textTransform="uppercase"
          fontWeight="medium"
          fontSize="sm"
        >
          Thank you and see you again!
        </Heading>
        <Text>Hotline: {company.phone}</Text>
      </>
    )}
  </Box>
);

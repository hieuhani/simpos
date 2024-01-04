import { Box, Heading, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { Company } from '../../../../services/db/company';

export interface OrderReceiptHeaderProps {
  company: Company;
}
export const OrderReceiptHeader: React.FunctionComponent<
  OrderReceiptHeaderProps
> = ({ company }) => (
  <>
    <Box w="250px" h="80px" margin="0 auto 1rem auto">
      {company.logo && <Image src={`data:image/png;base64,${company.logo}`} />}
    </Box>

    <Box textAlign="center" mb={2}>
      <Text fontSize="1rem">{company.street}</Text>
    </Box>
    <Heading
      textTransform="uppercase"
      fontWeight="medium"
      textAlign="center"
      fontSize="xl"
      mb={2}
    >
      Pay receipt
    </Heading>
  </>
);

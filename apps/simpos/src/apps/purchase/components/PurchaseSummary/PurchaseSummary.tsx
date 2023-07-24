import React from 'react';
import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { DisplayCount } from '../../../../components/DisplayCount';
import { PurchaseOrder } from '../../../../services/db';
import { formatDate } from '../../../../utils';

export interface PurchaseSummaryProps {
  purchaseOrder: PurchaseOrder;
}
export const PurchaseSummary: React.FunctionComponent<PurchaseSummaryProps> = ({
  purchaseOrder,
}) => {
  return (
    <>
      <Flex mb={4} backgroundColor="gray.100" borderRadius="md" px={4} py={2}>
        <Box>
          <Text>Phiếu mua hàng</Text>
          <Heading>{purchaseOrder.name}</Heading>
        </Box>

        <Stack ml="auto" direction="row" spacing={4}>
          <DisplayCount title="Đối tác" value={purchaseOrder.partnerId[1]} />
          <DisplayCount
            title="Ngày tạo"
            value={formatDate(purchaseOrder.dateApprove)}
          />
        </Stack>
      </Flex>
    </>
  );
};

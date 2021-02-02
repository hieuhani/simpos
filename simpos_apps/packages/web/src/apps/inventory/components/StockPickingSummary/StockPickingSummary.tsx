import React from 'react';
import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { DisplayCount } from '../../../../components/DisplayCount';
import { formatDate } from '../../../../utils';
import { StockPicking } from '../../../../services/stock-picking';

export interface StockPickingSummaryProps {
  stockPicking: StockPicking;
}
export const StockPickingSummary: React.FunctionComponent<StockPickingSummaryProps> = ({
  stockPicking,
}) => {
  return (
    <>
      <Flex mb={4} backgroundColor="gray.100" borderRadius="md" px={4} py={2}>
        <Box>
          <Text>Phiếu chuyển hàng</Text>
          <Heading>{stockPicking.name}</Heading>
        </Box>

        <Stack ml="auto" direction="row" spacing={4}>
          <DisplayCount title="Đối tác" value={stockPicking.companyId[1]} />
          <DisplayCount title="Mã phiếu mua" value={stockPicking.origin} />
          <DisplayCount
            title="Ngày tạo"
            value={formatDate(stockPicking.scheduledDate)}
          />
        </Stack>
      </Flex>
    </>
  );
};

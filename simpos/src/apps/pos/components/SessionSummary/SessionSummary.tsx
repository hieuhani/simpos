import { Box, Heading, Text, Flex, Grid } from '@chakra-ui/react';
import React from 'react';
import { DisplayCount } from '../../../../components/DisplayCount';
import { useMoneyFormatter } from '../../../../hooks';
import { PosSession } from '../../../../services/db';
import { BoxInfo } from './BoxInfo';

export interface SessionSummaryProps {
  session: PosSession;
}
export const SessionSummary: React.FunctionComponent<SessionSummaryProps> = ({
  session,
}) => {
  const { formatCurrency } = useMoneyFormatter();
  return (
    <>
      <Flex mb={4} backgroundColor="gray.100" borderRadius="md" px={4} py={2}>
        <Box>
          <Text>Phiên bán hàng</Text>
          <Heading>{session.displayName}</Heading>
        </Box>
        <Flex ml="auto">
          <DisplayCount title="Đơn hàng" value={String(session.orderCount)} />
          <Box w={4} />
          <DisplayCount
            title="Doanh thu"
            value={formatCurrency(session.totalPaymentsAmount!)}
          />
        </Flex>
      </Flex>
      <Grid templateColumns="1fr 1fr 1fr" gridGap={4}>
        <BoxInfo title="Người phụ trách" value={session.userId[1]} />
        <BoxInfo title="Điểm bán hàng" value={session.configId[1]} />
        <BoxInfo title="Ngày tạo phiên" value={session.startAt} />
      </Grid>
    </>
  );
};

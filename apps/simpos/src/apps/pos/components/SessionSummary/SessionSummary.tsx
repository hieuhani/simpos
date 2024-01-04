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
          <Text>Selling session</Text>
          <Heading>{session.displayName}</Heading>
        </Box>
        <Flex ml="auto">
          <DisplayCount title="Orders" value={String(session.orderCount)} />
          <Box w={4} />
          <DisplayCount
            title="Net sales"
            value={formatCurrency(session.totalPaymentsAmount!)}
          />
        </Flex>
      </Flex>
      <Grid templateColumns="1fr 1fr 1fr 1fr" gridGap={4}>
        <BoxInfo title="Responsible staff" value={session.userId[1]} />
        <BoxInfo title="Point of sale" value={session.configId[1]} />
        <BoxInfo title="Created at" value={session.startAt} />
        <BoxInfo title="Status" value={session.state} />
      </Grid>
    </>
  );
};

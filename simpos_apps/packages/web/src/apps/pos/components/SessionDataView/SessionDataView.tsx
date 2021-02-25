import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';
import { SessionOrders } from './SessionOrders';
import { SessionPayments } from './SessionPayments';

export interface SessionDataViewProps {
  sessionId: number;
}

export const SessionDataView: React.FunctionComponent<SessionDataViewProps> = ({
  sessionId,
}) => {
  return (
    <Box mt={4} backgroundColor="gray.100" borderRadius="md">
      <Tabs isLazy variant="soft-rounded" colorScheme="pink">
        <TabList px={4} pt={4} pb={2}>
          <Tab>Đơn hàng</Tab>
          <Tab>Thanh toán</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <SessionOrders sessionId={sessionId} />
          </TabPanel>
          <TabPanel p={0}>
            <SessionPayments sessionId={sessionId} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

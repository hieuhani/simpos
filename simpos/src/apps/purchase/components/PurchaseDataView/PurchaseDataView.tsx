import React from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

export const PurchaseDataView: React.FunctionComponent = () => {
  return (
    <Box mt={4} backgroundColor="gray.100" borderRadius="md">
      <Tabs isLazy variant="soft-rounded" colorScheme="pink">
        <TabList px={4} pt={4} pb={2}>
          <Tab>Yêu cầu nhập hàng</Tab>
          <Tab>Chờ nhận hàng</Tab>
          <Tab>Đã nhận hàng</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>X</TabPanel>
          <TabPanel p={0}>Y</TabPanel>
          <TabPanel p={0}>Z</TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

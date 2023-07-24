import React from 'react';

import {
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  Button,
  Portal,
  Flex,
  Grid,
  useDisclosure,
} from '@chakra-ui/react';
import { IconFlag } from '../../../../components/icons';
import {
  useOrderManagerAction,
  useOrderManagerState,
} from '../../../../contexts/OrderManager';

export const TableNoAction: React.FunctionComponent = () => {
  const { activeOrder } = useOrderManagerState();
  const { selectTableNo } = useOrderManagerAction();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const onSelect = (no?: string) => {
    selectTableNo(no);
    onClose();
  };
  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <Box
          width="120px"
          height="66px"
          as={Button}
          backgroundColor="brand.500"
          color="brand.100"
          borderRadius="md"
          display="flex"
          flexDirection="column"
          p={2}
          alignItems="center"
        >
          <Flex h="33px" alignItems="center" justifyContent="center">
            {activeOrder?.order.tableNo ? (
              <Box
                backgroundColor="brand.100"
                color="white"
                w="28px"
                h="28px"
                lineHeight="28px"
                borderRadius="14px"
              >
                {activeOrder.order.tableNo}
              </Box>
            ) : (
              <IconFlag size="20" />
            )}
          </Flex>
          <Text fontSize="sm">Số bàn</Text>
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Chọn số bàn</PopoverHeader>
          <PopoverBody>
            <Grid templateColumns="1fr 1fr 1fr" gridGap={2}>
              {Array.from({ length: 21 }, (_, i) => (
                <Button key={i} onClick={() => onSelect(String(i + 1))}>
                  {i + 1}
                </Button>
              ))}
              {activeOrder?.order.tableNo && (
                <Button
                  gridColumnStart="1"
                  gridColumnEnd="span 3"
                  colorScheme="red"
                  onClick={() => onSelect(undefined)}
                >
                  Xóa số bàn
                </Button>
              )}
            </Grid>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

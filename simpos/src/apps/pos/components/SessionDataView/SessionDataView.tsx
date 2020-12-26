import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { IconChevronDown } from '../../../../components/icons/output/IconChevronDown';

export interface SessionDataViewProps {
  sessionId: number;
}
type SessionViewType = 'pos.order' | 'pos.payment';

const viewTypeMap: Record<SessionViewType, string> = {
  'pos.order': 'Đơn hàng',
  'pos.payment': 'Thanh toán',
};

export const SessionDataView: React.FunctionComponent<SessionDataViewProps> = ({
  sessionId,
}) => {
  const [viewType, setViewType] = useState<SessionViewType>('pos.order');
  return (
    <Box mt={4}>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<IconChevronDown size="0.8rem" />}
          variant="link"
          color="gray.800"
          fontSize="lg"
        >
          {viewTypeMap[viewType]}
        </MenuButton>
        <MenuList>
          <MenuItem>Đơn hàng</MenuItem>
          <MenuItem>Thanh toán</MenuItem>
        </MenuList>
      </Menu>
      <Box backgroundColor="gray.100" borderRadius="md" px={4} py={2} mt={4}>
        XXX
      </Box>
    </Box>
  );
};

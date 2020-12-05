import React from 'react';
import {
  Flex,
  Menu,
  MenuButton,
  Button,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IconBars } from '../../../../components/icons';
import { OrderTab, OrderTabAdd } from '../OrderTab';
import {
  useOrderManagerAction,
  useOrderManagerState,
} from '../../../../contexts/OrderManager';

const StyledSwiper = styled(Swiper)`
  margin-left: 0;
  margin-right: 0;
`;

export const NavigationBar: React.FunctionComponent = () => {
  const state = useOrderManagerState();
  const { addNewOrder, selectOrder, deleteOrder } = useOrderManagerAction();
  return (
    <Flex align="center" px={4} py={2}>
      <Menu>
        <MenuButton as={Button}>
          <IconBars size="20" />
        </MenuButton>
        <MenuList>
          <MenuItem>Bán hàng</MenuItem>
          <MenuItem>Đơn hàng</MenuItem>
        </MenuList>
      </Menu>
      <Flex flex="1" overflow="hidden" px={2} justifyContent="flex-start">
        <StyledSwiper spaceBetween={8} slidesPerView="auto">
          {state.orders.map((order) => (
            <SwiperSlide key={order.id} style={{ width: 'auto' }}>
              <OrderTab
                order={order}
                active={state.activeOrderId === order.id}
                onSelectOrder={() => selectOrder(order)}
                onDeleteOrder={() => deleteOrder(order)}
              />
            </SwiperSlide>
          ))}
        </StyledSwiper>
        <OrderTabAdd onClick={addNewOrder} />
      </Flex>
    </Flex>
  );
};

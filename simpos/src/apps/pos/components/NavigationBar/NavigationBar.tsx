import React from 'react';
import {
  Flex,
  Menu,
  MenuButton,
  Button,
  MenuItem,
  MenuList,
} from '@chakra-ui/core';
import styled from '@emotion/styled';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IconBars } from '../../../../components/icons';
import { OrderTab, OrderTabAdd } from '../OrderTab';

const StyledSwiper = styled(Swiper)`
  margin-left: 0;
  margin-right: 0;
`;
export const NavigationBar: React.FunctionComponent = () => (
  <Flex align="center" p={2}>
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
        {[1, 2, 3, 5].map((i) => (
          <SwiperSlide key={i} style={{ width: 'auto' }}>
            <OrderTab no={i} />
          </SwiperSlide>
        ))}
      </StyledSwiper>
      <OrderTabAdd />
    </Flex>
  </Flex>
);

import { Box } from '@chakra-ui/react';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CategoryButton } from './CategoryButton';

export const CategoryPanel: React.FunctionComponent = () => (
  <Box px={2} mb={2}>
    <Swiper spaceBetween={8} slidesPerView="auto">
      {[1, 2, 3, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <SwiperSlide key={i} style={{ width: 'auto' }}>
          <CategoryButton name={`Category ${i}`} />
        </SwiperSlide>
      ))}
    </Swiper>
    <Box h={2} />
    <Swiper spaceBetween={8} slidesPerView="auto">
      {[1, 2, 3, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <SwiperSlide key={i} style={{ width: 'auto' }}>
          <CategoryButton name={`Category ${i}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  </Box>
);

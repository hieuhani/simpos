import { Box } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { PosCategory, posCategoryRepository } from '../../../../services/db';
import { CategoryButton } from './CategoryButton';

export interface CategoryPanelProps {
  onClickCategory: (category: PosCategory) => void;
  categoryId: number;
}

export const CategoryPanel: React.FunctionComponent<CategoryPanelProps> = ({
  onClickCategory,
  categoryId,
}) => {
  const [categories, setCategories] = useState<PosCategory[]>([]);
  const [selectedCategoryId, setSelectedCategory] = useState<number>(0);

  const fetchCategories = async () => {
    const dbCategories = await posCategoryRepository.treeCategories();
    setCategories([{ id: 0, name: 'Tất cả' }, ...dbCategories]);
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const childCategories = useMemo(() => {
    const selectedCategory = categories.find(
      ({ id }) => id === selectedCategoryId,
    );
    if (selectedCategory && selectedCategory.children) {
      return selectedCategory.children;
    }
    return [];
  }, [selectedCategoryId, categories]);

  const onClickRootCategory = (category: PosCategory) => {
    setSelectedCategory(category.id);
    onClickCategory(category);
  };

  return (
    <Box px={4} mb={2}>
      {categories.length > 0 && (
        <Swiper spaceBetween={8} slidesPerView="auto">
          {categories.map((category) => (
            <SwiperSlide key={category.id} style={{ width: 'auto' }}>
              <CategoryButton
                name={category.name}
                active={selectedCategoryId === category.id}
                onClick={() => onClickRootCategory(category)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <Box h={2} />
      {!!selectedCategoryId && (
        <Swiper spaceBetween={8} slidesPerView="auto">
          {childCategories.map((category) => (
            <SwiperSlide key={category.id} style={{ width: 'auto' }}>
              <CategoryButton
                name={category.name}
                active={categoryId === category.id}
                onClick={() => onClickCategory(category)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Box>
  );
};

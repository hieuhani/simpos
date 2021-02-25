import React from 'react';
import { Button } from '@chakra-ui/react';

export interface CategoryButtonProps {
  name: string;
  active?: boolean;
  onClick: () => void;
}
export const CategoryButton: React.FunctionComponent<CategoryButtonProps> = ({
  name,
  onClick,
  active,
}) => (
  <Button
    size="md"
    onClick={onClick}
    background={active ? 'brand.200' : 'brand.500'}
    color={active ? 'white' : 'brand.100'}
  >
    {name}
  </Button>
);

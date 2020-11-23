import React from 'react';
import { Button } from '@chakra-ui/react';

export interface CategoryButtonProps {
  name: string;
  onClick: () => void;
}
export const CategoryButton: React.FunctionComponent<CategoryButtonProps> = ({
  name,
  onClick,
}) => (
  <Button size="lg" onClick={onClick}>
    {name}
  </Button>
);

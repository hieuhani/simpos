import React from 'react';
import { Button } from '@chakra-ui/react';

export interface CategoryButtonProps {
  name: string;
}
export const CategoryButton: React.FunctionComponent<CategoryButtonProps> = ({
  name,
}) => <Button size="lg">{name}</Button>;

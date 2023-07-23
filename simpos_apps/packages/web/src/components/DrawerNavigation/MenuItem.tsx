import React from 'react';
import { Box, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export interface MenuItemProps {
  to: string;
  title: string;
  icon: React.ReactNode;
  active?: boolean;
}

export const MenuItem: React.FunctionComponent<MenuItemProps> = ({
  to,
  title,
  icon,
  active,
}) => {
  return (
    <Box as="li" mb={2} color="brand.200">
      <Link to={to} as={RouterLink} d="flex" alignItems="center">
        <Box backgroundColor="brand.200" borderRadius="md" p="6px">
          {icon}
        </Box>
        <Text ml={2} fontWeight={active ? 'bold' : ''}>
          {title}
        </Text>
      </Link>
    </Box>
  );
};

import React from 'react';
import { Box, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export interface SubMenuItemProps {
  to: string;
  title: string;
  active?: boolean;
}

export const SubMenuItem: React.FunctionComponent<SubMenuItemProps> = ({
  to,
  title,
  active,
}) => {
  return (
    <Box as="li" mb={1}>
      <Link
        to={to}
        as={RouterLink}
        d="flex"
        backgroundColor={active ? 'brand.500' : ''}
        color={active ? 'brand.100' : ''}
        fontWeight={active ? 'bold' : ''}
        px={3}
        py={1}
        borderRadius="md"
        _hover={{
          textTransform: 'none',
          color: active ? '' : 'brand.100',
        }}
      >
        {title}
      </Link>
    </Box>
  );
};

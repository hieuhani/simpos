import { Box, Container, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { NavigationBarGeneral } from '../pos/components/NavigationBar';

export const Purchase: React.FunctionComponent = () => (
  <>
    <NavigationBarGeneral />
    <Container maxW="6xl" pt={4}>
      <Flex>
        <Link to="/purchase" as={RouterLink}>
          <Box
            backgroundColor="pink.100"
            borderRadius="full"
            py={2}
            px={4}
            color="pink.700"
            fontWeight="600"
          >
            Mua hàng
          </Box>
        </Link>
        <Link
          to={{ pathname: '/purchase', search: '?status=waiting' }}
          as={RouterLink}
        >
          <Box py={2} px={4} color="gray.600" fontWeight="600">
            Chờ nhận hàng
          </Box>
        </Link>
        <Link
          to={{ pathname: '/purchase', search: '?status=received' }}
          as={RouterLink}
        >
          <Box py={2} px={4} color="gray.600" fontWeight="600">
            Đã nhận hàng
          </Box>
        </Link>
      </Flex>
    </Container>
  </>
);

import React from 'react';

import {
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Box,
  Text,
  Link,
  Heading,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';
import { IconStore } from '../icons/output/IconStore';
import { IconTruckMoving } from '../icons/output/IconTruckMoving';
import { IconInventory } from '../icons/output/IconInventory';

// const SubMenuLink = styled(Link)(({ theme }: any) => {
//   return `
//   padding: 0.4rem 0.8rem;
//   display: flex;
//   background-color: ${theme.colors.brand['500']};
//   color: ${theme.colors.brand['100']};
// `;
// });

export const DrawerNavigation: React.FunctionComponent = () => {
  const { signOut } = useAuth();

  return (
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader>Chateraise</DrawerHeader>

      <DrawerBody>
        <Box listStyleType="none" as="ul">
          <Box as="li" mb={2} color="brand.200">
            <Link to="/pos" as={RouterLink} d="flex" alignItems="center">
              <Box backgroundColor="brand.200" borderRadius="md" p="6px">
                <IconStore size="20px" color="white" />
              </Box>
              <Text ml={2} fontWeight="bold">
                Bán hàng
              </Text>
            </Link>
          </Box>
          <Box as="li" mb={2} color="brand.200">
            <Link to="/purchase" as={RouterLink} d="flex" alignItems="center">
              <Box backgroundColor="brand.200" borderRadius="md" p="6px">
                <IconTruckMoving size="20px" color="white" />
              </Box>

              <Text ml={2}>Mua hàng</Text>
            </Link>
          </Box>
          <Box as="li" mb={2} color="brand.200">
            <Link to="/inventory" as={RouterLink} d="flex" alignItems="center">
              <Box backgroundColor="brand.200" borderRadius="md" p="6px">
                <IconInventory size="20px" color="white" />
              </Box>

              <Text ml={2}>Kho</Text>
            </Link>
          </Box>
        </Box>
        <Box listStyleType="none" as="ul" mt={6}>
          <Heading color="brand.200" fontSize="lg">
            Bán hàng
          </Heading>
          <Box as="li" mb={1}>
            <Link
              to="/pos/orders"
              as={RouterLink}
              d="flex"
              backgroundColor="brand.500"
              color="brand.100"
              fontWeight="bold"
              px={3}
              py={1}
              borderRadius="md"
              _hover={{
                textTransform: 'none',
              }}
            >
              Đơn hàng
            </Link>
          </Box>
          <Box as="li" mb={1}>
            <Link
              to="/pos/report"
              as={RouterLink}
              d="flex"
              px={3}
              py={1}
              _hover={{
                textTransform: 'none',
                color: 'brand.100',
              }}
            >
              Báo cáo
            </Link>
          </Box>
        </Box>
      </DrawerBody>
      <DrawerFooter>
        <Button w="full" onClick={() => signOut()}>
          Đăng xuất
        </Button>
      </DrawerFooter>
    </DrawerContent>
  );
};

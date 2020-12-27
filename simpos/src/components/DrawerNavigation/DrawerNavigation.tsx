import React, { useMemo } from 'react';
import {
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Box,
  Heading,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';
import { IconStore } from '../icons/output/IconStore';
import { IconTruckMoving } from '../icons/output/IconTruckMoving';
import { IconInventory } from '../icons/output/IconInventory';
import { MenuItem, MenuItemProps } from './MenuItem';
import { SubMenuItem, SubMenuItemProps } from './SubMenuItem';

interface MenuGroup {
  menu: MenuItemProps;
  subMenus: SubMenuItemProps[];
}

const menuGroups: Record<string, MenuGroup> = {
  '/pos': {
    menu: {
      title: 'Bán hàng',
      icon: <IconStore size="20px" color="white" />,
      to: '/pos',
    },
    subMenus: [
      {
        title: 'Phiên bán hàng',
        to: '/pos/session',
      },
      {
        title: 'Báo cáo',
        to: '/pos/report',
      },
    ],
  },
  '/purchase': {
    menu: {
      title: 'Mua hàng',
      icon: <IconTruckMoving size="20px" color="white" />,
      to: '/purchase',
    },
    subMenus: [
      {
        title: 'Báo cáo',
        to: '/purchase/report',
      },
    ],
  },
  '/inventory': {
    menu: {
      title: 'Kho',
      icon: <IconInventory size="20px" color="white" />,
      to: '/inventory',
    },
    subMenus: [
      {
        title: 'Báo cáo',
        to: '/purchase/report',
      },
    ],
  },
};

export const DrawerNavigation: React.FunctionComponent = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  const currentMenuGroupKey = useMemo(() => {
    const segments = location.pathname.split('/');
    if (!segments[1]) {
      return undefined;
    }
    return `/${segments[1]}`;
  }, [location.pathname]);
  return (
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader>Chateraise</DrawerHeader>

      <DrawerBody>
        <Box listStyleType="none" as="ul">
          {Object.keys(menuGroups).map((menu) => (
            <MenuItem
              key={menu}
              {...menuGroups[menu].menu}
              active={location.pathname.startsWith(menuGroups[menu].menu.to)}
            />
          ))}
        </Box>
        {currentMenuGroupKey && menuGroups[currentMenuGroupKey] && (
          <Box listStyleType="none" as="ul" mt={6}>
            <Heading color="brand.200" fontSize="lg" mb={4}>
              {menuGroups[currentMenuGroupKey].menu.title}
            </Heading>
            {menuGroups[currentMenuGroupKey].subMenus.map((subMenu) => (
              <SubMenuItem
                key={subMenu.to}
                {...subMenu}
                active={subMenu.to === location.pathname}
              />
            ))}
          </Box>
        )}
      </DrawerBody>
      <DrawerFooter>
        <Button w="full" onClick={() => signOut()}>
          Đăng xuất
        </Button>
      </DrawerFooter>
    </DrawerContent>
  );
};

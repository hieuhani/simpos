import React from 'react';
import { StatusBar } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { VendorsScreen } from '../vendors';
import { ProductsScreen } from '../products';
import { PurchaseScreen } from '../purchase';
import { withMainLayout } from '../shared/layouts/MainLayout';
import { InventoryNavigation } from './Inventory';

const Drawer = createDrawerNavigator();

export const Main: React.FunctionComponent = () => (
  <>
    <StatusBar barStyle="dark-content" />
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Inventory"
        component={withMainLayout(InventoryNavigation)}
      />
      <Drawer.Screen
        name="Purchase"
        component={withMainLayout(PurchaseScreen)}
      />
      <Drawer.Screen
        name="Products"
        component={withMainLayout(ProductsScreen)}
      />
      <Drawer.Screen name="Vendors" component={withMainLayout(VendorsScreen)} />
    </Drawer.Navigator>
  </>
);

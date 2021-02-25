import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  InventoryScreen,
  InventoryTransfersScreen,
  InventoryScrapScreen,
  InventoryAdjustmentsScreen,
} from '../inventory';
import { InventoryNewTransferScreen } from '../inventory/InventoryNewTransferScreen';

export type InventoryNavigationStackParams = {
  Inventory: undefined;
  'Inventory Transfers': undefined;
  Scrap: undefined;
  'Inventory Adjustments': undefined;
  'New Transfer': undefined;
};

export type InventoryNavigationScreen = keyof InventoryNavigationStackParams;

export type InventoryNavigationProp = StackNavigationProp<
  InventoryNavigationStackParams
>;

const Stack = createStackNavigator<InventoryNavigationStackParams>();

export const InventoryNavigation = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Inventory" component={InventoryScreen} />
    <Stack.Screen
      name="Inventory Transfers"
      component={InventoryTransfersScreen}
    />
    <Stack.Screen name="New Transfer" component={InventoryNewTransferScreen} />
    <Stack.Screen name="Scrap" component={InventoryScrapScreen} />
    <Stack.Screen
      name="Inventory Adjustments"
      component={InventoryAdjustmentsScreen}
    />
  </Stack.Navigator>
);

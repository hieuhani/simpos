import React from "react";
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
} from "@react-navigation/stack";
import { SaleOrderScreen, SalesScreen } from "../sales";
import { NewSaleScreen } from "../sales/NewSaleScreen";

interface SaleOrderNavigationParams {
  id: number;
  name?: string;
}

export type SaleOrderNavigationProps = StackScreenProps<any>;

export type SalesNavigationStackParams = {
  Sales: undefined;
  "New Sale": undefined;
  "Sale Order": SaleOrderNavigationParams;
};

export type SalesNavigationScreen = keyof SalesNavigationStackParams;

export type SalesNavigationProp = StackNavigationProp<SalesNavigationStackParams>;

const Stack = createStackNavigator<SalesNavigationStackParams>();

export const SalesNavigation = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Sales" component={SalesScreen} />
    <Stack.Screen name="New Sale" component={NewSaleScreen} />
    <Stack.Screen name="Sale Order" component={SaleOrderScreen} />
  </Stack.Navigator>
);

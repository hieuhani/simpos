import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StackNavigationProp } from "@react-navigation/stack";

import { SalesScreen } from "../sales";
import { NewSaleScreen } from "../sales/NewSaleScreen";

export type SalesNavigationStackParams = {
  Sales: undefined;
  "New Sale": undefined;
};

export type SalesNavigationScreen = keyof SalesNavigationStackParams;

export type SalesNavigationProp = StackNavigationProp<SalesNavigationStackParams>;

const Stack = createStackNavigator<SalesNavigationStackParams>();

export const SalesNavigation = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Sales" component={SalesScreen} />

    <Stack.Screen name="New Sale" component={NewSaleScreen} />
  </Stack.Navigator>
);

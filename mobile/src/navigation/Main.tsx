import React from "react";
import { StatusBar } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { VendorsScreen } from "../vendors";
import { ProductsScreen } from "../products";
import { withMainLayout } from "../shared/layouts/MainLayout";
import { InventoryNavigation } from "./Inventory";
import { SalesNavigation } from "./Sales";

const Drawer = createDrawerNavigator();

export const Main: React.FunctionComponent = () => (
  <>
    <StatusBar barStyle="dark-content" />
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Kho"
        component={withMainLayout(InventoryNavigation)}
      />
      <Drawer.Screen
        name="Bán hàng"
        component={withMainLayout(SalesNavigation)}
      />
      <Drawer.Screen
        name="Sản phẩm"
        component={withMainLayout(ProductsScreen)}
      />
      <Drawer.Screen name="Đối tác" component={withMainLayout(VendorsScreen)} />
    </Drawer.Navigator>
  </>
);

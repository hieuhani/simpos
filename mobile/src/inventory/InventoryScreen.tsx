import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { InventoryCard } from "./components";
import { InventoryActionLine } from "./components/InventoryActionLine";
import {
  InventoryNavigationProp,
  InventoryNavigationScreen,
} from "../navigation/Inventory";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  inventoryGrid: {
    flexWrap: "wrap",
    flexDirection: "row",
    paddingHorizontal: 12,
  },
  card: {
    maxWidth: "50%",
    flexBasis: "50%",
    padding: 14,
  },
  actions: {
    marginTop: 10,
    marginHorizontal: 26,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: "700",
  },
});

const inventories = [
  {
    id: 0,
    name: "Kho staging",
    totalItems: 19,
    color: "#EA4848",
  },
  {
    id: 1,
    name: "Kho -20 độ",
    totalItems: 19,
    color: "#007AFF",
  },
  {
    id: 2,
    name: "Kho -5 độ",
    totalItems: 209,
    color: "#3797FE",
  },
  {
    id: 3,
    name: "Kho 2 - 7 độ",
    totalItems: 99,
    color: "#5AC8FA",
  },
  {
    id: 4,
    name: "Kho thường",
    totalItems: 181,
    color: "#40D192",
  },
  {
    id: 5,
    name: "Tủ trưng bày",
    totalItems: 181,
    color: "#FFCC00",
  },
];

interface ActionLine {
  name: string;
  icon: {
    name: string;
    color: string;
  };
  screen: InventoryNavigationScreen;
}

const actionLines: Array<ActionLine> = [
  {
    name: "Chuyển kho",
    icon: {
      name: "md-switch",
      color: "#FFCC00",
    },
    screen: "Inventory Transfers",
  },
  {
    name: "Huỷ hàng",
    icon: {
      name: "md-trash",
      color: "#FF3B30",
    },
    screen: "Scrap",
  },
  {
    name: "Điều chỉnh kho",
    icon: {
      name: "md-clipboard",
      color: "#4CD964",
    },
    screen: "Inventory Adjustments",
  },
];

export const InventoryScreen: React.FunctionComponent = () => {
  const navigation = useNavigation<InventoryNavigationProp>();
  const onInventoryActionPress = (screen: InventoryNavigationScreen) => {
    navigation.push(screen);
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.inventoryGrid}>
        {inventories.map((inventory) => (
          <View key={inventory.id} style={styles.card}>
            <InventoryCard inventory={inventory} />
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <Text style={styles.title}>Hoạt động</Text>
        {actionLines.map((action, index) => (
          <InventoryActionLine
            key={index}
            onPress={() => onInventoryActionPress(action.screen)}
            {...action}
          />
        ))}
      </View>
    </ScrollView>
  );
};

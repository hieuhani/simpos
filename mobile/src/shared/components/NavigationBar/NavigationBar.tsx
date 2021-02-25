import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerActions,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { WithNavigationProps } from "../../layouts/MainLayout";

export interface NavigationBarProps extends WithNavigationProps {}

const styles = StyleSheet.create({
  container: {
    height: 44,
    alignItems: "center",
    flexDirection: "row",
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 14,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  title: {
    color: "#687881",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: -44,
  },
});

export const NavigationBar: React.FunctionComponent<NavigationBarProps> = ({
  navigation,
  route,
}) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Chateraise";

  const isInRoot = true;
  const onMenuPressed = () => {
    if (isInRoot) {
      navigation.dispatch(DrawerActions.toggleDrawer());
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPressed}>
        <Ionicons
          name={isInRoot ? "md-menu" : "ios-arrow-back"}
          size={30}
          color="#687881"
        />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>{routeName}</Text>
      </View>
    </View>
  );
};

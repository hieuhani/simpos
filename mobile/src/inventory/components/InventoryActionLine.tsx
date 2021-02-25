import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface InventoryActionLineProps {
  name: string;
  icon: {
    name: any;
    color: string;
  };
  onPress?: () => void;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
});

export const InventoryActionLine: React.FunctionComponent<InventoryActionLineProps> = ({
  name,
  icon,
  onPress,
}: InventoryActionLineProps) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <View style={[styles.iconWrapper, { backgroundColor: icon.color }]}>
      <Ionicons name={icon.name} size={20} color="#FFFFFF" />
    </View>
    <Text>{name}</Text>
  </TouchableOpacity>
);

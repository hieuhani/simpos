import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { UserPicker } from "../shared/components/UserPicker";
import { ButtonPicker } from "../shared/components/ButtonPicker";
import { Button } from "../shared/components/Button";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  field: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  destinationWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  destination: {
    flex: 1,
  },
  iconWrapper: {
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  wrapper: {
    paddingHorizontal: 20,
  },
  buttonAdd: {
    width: "100%",
    justifyContent: "flex-start",
    paddingHorizontal: 0,
  },
});

export const InventoryNewTransferScreen: React.FunctionComponent = () => (
  <View style={styles.container}>
    <UserPicker style={styles.field} />
    <View style={[styles.destinationWrapper, styles.field]}>
      <ButtonPicker style={styles.destination} />
      <View style={styles.iconWrapper}>
        <Ionicons name="code" size={30} color="#CCC" />
      </View>
      <ButtonPicker style={styles.destination} />
    </View>
    <View style={styles.wrapper}>
      <Button
        style={styles.buttonAdd}
        link
        icon={{ name: "ios-add", size: 26 }}
      >
        Thêm sản phẩm
      </Button>
    </View>
  </View>
);

import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SaleOrderRow } from "./components";
import { Button } from "../shared/components/Button";
import { SalesNavigationProp } from "../navigation/Sales";
import { SaleOrder, saleOrderService } from "../services/sale-order";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  list: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
});

export const SalesScreen: React.FunctionComponent = () => {
  const navigation = useNavigation<SalesNavigationProp>();
  const [saleOrders, setSaleOrders] = useState<SaleOrder[]>([]);
  const goToSaleOrder = (saleOrder: SaleOrder) => {
    navigation.push("Sale Order", {
      id: saleOrder.id,
      name: saleOrder.name,
    });
  };
  const onNewSalePressed = () => {
    navigation.push("New Sale");
  };

  useEffect(() => {
    const fetchSaleOrders = async () => {
      const serverSaleOrders = await saleOrderService.getSaleOrders();
      setSaleOrders(serverSaleOrders);
    };
    fetchSaleOrders();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={saleOrders}
        renderItem={({ item }) => (
          <SaleOrderRow saleOrder={item} onPress={() => goToSaleOrder(item)} />
        )}
        keyExtractor={({ id }) => id.toString()}
      />
      <View style={styles.footer}>
        <Button block onPress={onNewSalePressed}>
          Lên báo giá
        </Button>
      </View>
    </View>
  );
};

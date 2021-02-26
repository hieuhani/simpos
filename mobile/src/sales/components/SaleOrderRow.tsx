import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { SaleOrder, saleOrderStateMap } from "../../services/sale-order";
import { formatDate, formatMoney } from "../../utils";

export interface SaleOrderRowProps {
  saleOrder: SaleOrder;
}

const TouchableContainer = styled.TouchableOpacity`
  padding: 8px 16px;
`;

const Wrapper = styled.View`
  border-color: #eee;
  border-style: solid;
  border-bottom-width: 1px;
  padding-bottom: 8px;
  flex-direction: row;
  justify-content: space-between;
`;

const Name = styled.Text`
  color: #9c1b50;
  font-weight: 700;
  font-size: 16px;
`;

const AmountTotal = styled.Text`
  font-size: 16px;
`;

const Summary = styled.View`
  align-items: flex-end;
`;

const State = styled.Text``;

export const SaleOrderRow: React.FunctionComponent<SaleOrderRowProps> = ({
  saleOrder,
}: SaleOrderRowProps) => (
  <TouchableContainer>
    <Wrapper>
      <View>
        <Name>{saleOrder.name}</Name>
        {saleOrder.partnerId && <Text>{saleOrder.partnerId[1]}</Text>}
        <Text>{formatDate(saleOrder.createDate, "HH:mm DD/MM/YYYY")}</Text>
      </View>

      <Summary>
        <AmountTotal>{formatMoney(saleOrder.amountTotal)}</AmountTotal>
        <State>{saleOrderStateMap[saleOrder.state]}</State>
      </Summary>
    </Wrapper>
  </TouchableContainer>
);

import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { SaleOrderNavigationProps } from "../navigation/Sales";
import {
  SaleOrderDetails,
  saleOrderService,
  saleOrderStateMap,
} from "../services/sale-order";
import {
  SaleOrderLine,
  saleOrderLineService,
} from "../services/sale-order-item";
import { Button, ButtonProps } from "../shared/components/Button";
import { formatDate, formatMoney } from "../utils";

const Container = styled.ScrollView`
  background-color: #fff;
  flex: 1;
`;

const Header = styled.View`
  padding-vertical: 4px;
  padding-horizontal: 16px;
  border-radius: 8px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.Text`
  color: #9c1b50;
  font-weight: 700;
  font-size: 16px;
`;

const SubHeader = styled.Text``;

const BasicInfo = styled.View`
  flex-direction: row;
  padding-vertical: 8px;
  padding-horizontal: 16px;
`;
const Block = styled.View`
  flex: 1;
`;
const SubTitle = styled.Text`
  color: #888;
  font-size: 10px;
  text-transform: uppercase;
`;
const Value = styled.Text``;

const BodyOrderItems = styled.View`
  padding-vertical: 8px;
  padding-horizontal: 16px;
`;

const OrderLineRow = styled.View`
  padding-vertical: 8px;
  flex-direction: row;
  align-items: center;
`;

const ProductName = styled.Text`
  margin-bottom: 4px;
`;

const OrderProductInfo = styled.View`
  flex: 1;
`;

const OrderLineInfo = styled.View`
  flex-direction: row;
`;

const PriceSubTotal = styled.Text`
  color: #c62828;
`;

const PriceUnitWrapper = styled.View`
  padding-vertical: 2px;
  padding-horizontal: 6px;
  background-color: #2196f3;
  border-radius: 4px;
`;

const PriceUnitText = styled.Text`
  font-size: 10px;
  color: #e3f2fd;
`;

const ProductQtyWrapper = styled.View`
  padding-vertical: 2px;
  padding-horizontal: 6px;
  background-color: #7cb342;
  border-radius: 4px;
  margin-left: 4px;
`;
const ProductQty = styled.Text`
  font-size: 10px;
  color: #dcedc8;
`;

const Footer = styled.View`
  padding-vertical: 8px;
  padding-horizontal: 16px;
  flex-direction: row;
`;

const Spacer = styled.View`
  width: 8px;
`;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  buttonCancel: {},
});

export interface SaleOrderScreenProps extends SaleOrderNavigationProps {}

export const SaleOrderScreen: React.FunctionComponent<SaleOrderScreenProps> = ({
  route,
}) => {
  const [saleOrder, setSaleOrder] = useState<SaleOrderDetails | null>(null);
  const [saleOrderLines, setSaleOrderLines] = useState<SaleOrderLine[]>([]);
  useEffect(() => {
    const fetchSaleOrderDetails = async (orderId: number) => {
      const remoteSaleOrder = await saleOrderService.getSaleOrder(orderId);
      if (remoteSaleOrder?.orderLine && remoteSaleOrder.orderLine.length > 0) {
        const remoteSaleOrderLines = await saleOrderLineService.getSaleOrderLines(
          remoteSaleOrder?.orderLine
        );
        setSaleOrderLines(remoteSaleOrderLines);
      }
      setSaleOrder(remoteSaleOrder);
    };
    if (route.params?.id) {
      fetchSaleOrderDetails(route.params.id);
    }
  }, [route.params]);

  const handleActionConfirm = () => {};
  const handleActionCancel = () => {};
  const handleActionSetQuotation = () => {};
  const handlePrint = () => {};

  const actionButtons = useMemo(() => {
    if (!saleOrder) {
      return [];
    }
    const buttons: ButtonProps[] = [];

    if (~["draft", "sent"].indexOf(saleOrder.state)) {
      buttons.push({
        children: "Xác nhận",
        onPress: handleActionConfirm,
      });
    }

    if (~["draft", "sent", "sale"].indexOf(saleOrder.state)) {
      buttons.push({
        children: "Huỷ đơn",
        onPress: handleActionCancel,
      });
    }

    if (saleOrder.state === "cancel") {
      buttons.push({
        children: "Huỷ",
        onPress: handleActionSetQuotation,
      });
    }

    buttons.push({
      children: "In đơn",
      onPress: handlePrint,
    });
    return buttons;
  }, [saleOrder]);
  if (!saleOrder) {
    return <ActivityIndicator />;
  }
  return (
    <>
      <Container>
        <Header>
          <View>
            <Title>{saleOrder.name}</Title>
            <SubHeader>{formatDate(saleOrder.createDate)}</SubHeader>
          </View>
          <View>
            <SubTitle>Trạng thái</SubTitle>
            <Value>{saleOrderStateMap[saleOrder.state]}</Value>
          </View>
        </Header>

        <BasicInfo>
          <Block>
            <SubTitle>Khách hàng</SubTitle>
            <Value>{saleOrder.partnerId[1]}</Value>
          </Block>
          <Block>
            <SubTitle>Kho xuất</SubTitle>
            <Value>{saleOrder.warehouseId[1]}</Value>
          </Block>
          <Block>
            <SubTitle>Dự kiến nhận</SubTitle>
            <Value>{formatDate(saleOrder.expectedDate)}</Value>
          </Block>
        </BasicInfo>

        <BodyOrderItems>
          <SubTitle>Sản phẩm</SubTitle>
          {saleOrderLines.map((orderLine) => (
            <OrderLineRow key={orderLine.id}>
              <OrderProductInfo>
                <ProductName>{orderLine.name}</ProductName>
                <OrderLineInfo>
                  <PriceUnitWrapper>
                    <PriceUnitText>
                      {formatMoney(orderLine.priceUnit)}
                    </PriceUnitText>
                  </PriceUnitWrapper>
                  <ProductQtyWrapper>
                    <ProductQty>
                      {orderLine.productUomQty} {orderLine.productUom[1]}
                    </ProductQty>
                  </ProductQtyWrapper>
                </OrderLineInfo>
              </OrderProductInfo>
              <PriceSubTotal>
                {formatMoney(orderLine.priceSubtotal)}
              </PriceSubTotal>
            </OrderLineRow>
          ))}
        </BodyOrderItems>
      </Container>
      <Footer>
        {actionButtons.map((buttonProps, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Spacer />}
            <Button {...buttonProps} />
          </React.Fragment>
        ))}
      </Footer>
    </>
  );
};

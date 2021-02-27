import React from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";
import { SaleOrder } from "../../services/sale-order";
import { SaleOrderLine } from "../../services/sale-order-item";
import { formatDate, formatMoney } from "../../utils";

export interface SaleOrderReceiptProps {
  saleOrder: SaleOrder;
  saleOrderLines: SaleOrderLine[];
}

const Heading = styled.Text`
  font-size: 12px;
  text-transform: uppercase;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 700;
`;

const Header = styled.View`
  align-items: center;
  margin-bottom: 8px;
`;

const SubTitle = styled.Text`
  text-transform: uppercase;
  font-size: 8px;
  font-weight: 700;
`;
const Value = styled.Text`
  font-size: 12px;
`;

const Row = styled.View`
  margin-top: 0;
  margin-bottom: 4px;
  flex-direction: row;
`;

const Col = styled.View`
  flex: 1;
`;

const Hr = styled.View`
  border-bottom-width: 1px;
  border-color: #000;
  margin-bottom: 4px;
`;

const THead = styled.View`
  flex-direction: row;
`;
const Th = styled.View``;

const ThText = styled.Text`
  text-transform: uppercase;
  font-size: 8px;
  font-weight: 700;
`;

const ThName = styled.View`
  flex: 1;
`;
const ThPrice = styled.View`
  width: 50px;
`;
const ThQty = styled.View`
  width: 30px;
`;
const ThAmount = styled.View`
  width: 50px;
`;

const TBody = styled.View``;

const Tr = styled.View``;

const LineName = styled.Text`
  font-size: 10px;
  font-weight: 700;
`;

export const SaleOrderReceipt: React.FunctionComponent<SaleOrderReceiptProps> = ({
  saleOrder,
  saleOrderLines,
}) => {
  return (
    <>
      <Header>
        <Heading>Phiếu bán hàng</Heading>
        <Title>{saleOrder.name}</Title>
      </Header>
      <Row>
        <Col>
          <SubTitle>Khách hàng</SubTitle>
          <Value>{saleOrder.partnerId[1]}</Value>
        </Col>
        <Col>
          <SubTitle>Kho xuất</SubTitle>
          <Value>{saleOrder.warehouseId[1]}</Value>
        </Col>
      </Row>
      <Row>
        <Col>
          <SubTitle>Ngày tạo</SubTitle>
          <Value>{formatDate(saleOrder.createDate)}</Value>
        </Col>
        <Col>
          <SubTitle>Dự kiến nhận</SubTitle>
          <Value>{formatDate(saleOrder.expectedDate)}</Value>
        </Col>
      </Row>
      <Hr />
      <THead>
        <ThName>
          <ThText>Sản phẩm</ThText>
        </ThName>
        <ThPrice>
          <ThText>Đ.Giá</ThText>
        </ThPrice>
        <ThQty>
          <ThText>SL</ThText>
        </ThQty>
        <ThAmount>
          <ThText>T.Tiền</ThText>
        </ThAmount>
      </THead>
      <TBody>
        {saleOrderLines.map((line) => (
          <Tr key={line.id}>
            <LineName>{line.name}</LineName>
            <THead>
              <ThName />
              <ThPrice>
                <ThText>{formatMoney(line.priceUnit)}</ThText>
              </ThPrice>
              <ThQty>
                <ThText>{line.productUomQty}</ThText>
              </ThQty>
              <ThAmount>
                <ThText>{formatMoney(line.priceSubtotal)}</ThText>
              </ThAmount>
            </THead>
          </Tr>
        ))}
      </TBody>
      <Hr />
    </>
  );
};

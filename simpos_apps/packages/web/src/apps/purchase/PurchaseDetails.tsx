import { Box, Button, Container, Stack } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { PurchaseOrder } from '../../services/db';
import { purchaseOrderService } from '../../services/purchase-order';
import {
  PurchaseOrderLine,
  purchaseOrderLineService,
} from '../../services/purchase-order-line';
import { NavigationBarGeneral } from '../pos/components/NavigationBar';
import { PurchaseSummary } from './components/PurchaseSummary';
import { PurchaseOrderLines } from './components/PurchaseDetails/PurchaseOrderLines';
import { ActionButtonProps } from '../../types';
interface PurchaseDetailsRoute {
  purchaseOrderId: string;
}

const PurchaseDetails: React.FunctionComponent = () => {
  const params = useParams<PurchaseDetailsRoute>();
  const history = useHistory();
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(
    null,
  );
  const [purchaseOrderLines, setPurchaseOrderLines] = useState<
    PurchaseOrderLine[]
  >([]);
  const getPurchaseOrder = async (purchaseOrderId: string) => {
    const serverPurchaseOrder = await purchaseOrderService.getPurchaseOrder(
      parseInt(purchaseOrderId, 10),
    );

    if (serverPurchaseOrder && serverPurchaseOrder.orderLine.length > 0) {
      const serverPurchaseOrderLines = await purchaseOrderLineService.getPurhcaseOrderLines(
        serverPurchaseOrder.orderLine,
      );

      setPurchaseOrderLines(serverPurchaseOrderLines);
    }
    setPurchaseOrder(serverPurchaseOrder);
  };
  useEffect(() => {
    getPurchaseOrder(params.purchaseOrderId);
  }, [params.purchaseOrderId]);

  const handleViewPicking = async () => {
    const picking = await purchaseOrderService.getPicking(
      parseInt(params.purchaseOrderId, 10),
    );
    history.push(`/inventory/stock_picking/${picking?.resId}`);
  };
  const actionButtons = useMemo<ActionButtonProps[]>(() => {
    if (!purchaseOrder) {
      return [];
    }
    const buttons: ActionButtonProps[] = [];

    if (purchaseOrder.state === 'draft') {
      buttons.push({
        children: 'Gửi email',
        colorScheme: 'pink',
      });

      buttons.push({
        children: 'In phiếu mua',
        colorScheme: 'pink',
      });
    }

    if (purchaseOrder.state === 'sent') {
      buttons.push({
        children: 'Xác nhận',
        colorScheme: 'pink',
      });
      buttons.push({
        children: 'Gửi email',
        colorScheme: 'pink',
      });
    }

    if (purchaseOrder.state === 'to approve') {
      buttons.push({
        children: 'Duyệt mua',
        colorScheme: 'pink',
      });
    }

    if (purchaseOrder.state === 'purchase') {
      buttons.push({
        children: 'Khoá',
        colorScheme: 'pink',
      });
    }

    if (purchaseOrder.state === 'done') {
      buttons.push({
        children: 'Mở khoá',
        colorScheme: 'pink',
      });
    }
    if (
      !!~['draft', 'to', 'approve', 'sent', 'purchase'].indexOf(
        purchaseOrder.state,
      )
    ) {
      buttons.push({
        children: 'Huỷ',
        colorScheme: 'pink',
        to: '/purchase/new',
        as: RouterLink,
      });
    }

    if (
      !purchaseOrder.isShipped &&
      ~['purchase', 'done'].indexOf(purchaseOrder.state) &&
      purchaseOrder.pickingCount > 0
    ) {
      buttons.push({
        children: 'Nhận hàng',
        colorScheme: 'pink',
        onClick: handleViewPicking,
      });
    }

    return buttons;
  }, [purchaseOrder]);

  if (!purchaseOrder) {
    return null;
  }
  return (
    <>
      <NavigationBarGeneral />
      <Box height="calc(100vh - 112px)" overflowY="auto">
        <Container maxW="6xl" pt={4}>
          <PurchaseSummary purchaseOrder={purchaseOrder} />
          <PurchaseOrderLines purchaseOrderLines={purchaseOrderLines} />
        </Container>
      </Box>
      <Box position="fixed" left="0" right="0" bottom="0">
        <Container maxW="6xl" py={2}>
          <Stack direction="row">
            {actionButtons.map((actionButton, index) => (
              <Button key={index} {...actionButton} />
            ))}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default PurchaseDetails;
import {
  Box,
  Button,
  Container,
  Stack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const PurchaseDetails: React.FunctionComponent = () => {
  const params = useParams<{
    purchaseOrderId: string;
  }>();
  const navigate = useNavigate();
  const toast = useToast();
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
      const serverPurchaseOrderLines =
        await purchaseOrderLineService.getPurhcaseOrderLines(
          serverPurchaseOrder.orderLine,
        );

      setPurchaseOrderLines(serverPurchaseOrderLines);
    }
    setPurchaseOrder(serverPurchaseOrder);
  };
  useEffect(() => {
    if (params.purchaseOrderId) {
      getPurchaseOrder(params.purchaseOrderId);
    }
  }, [params.purchaseOrderId]);

  const handleCancelPurchaseOrder = useCallback(async () => {
    try {
      await purchaseOrderService.cancelPurchaseOrder(
        parseInt(params.purchaseOrderId!, 10),
      );
      getPurchaseOrder(params.purchaseOrderId!);
      toast({
        title: 'Alert',
        description: 'Cancel purchase order successfully',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch (e: any) {
      toast({
        title: 'Cancel purchase order failed',
        description: e.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }, [params, toast]);
  const handleViewPicking = useCallback(async () => {
    const picking = await purchaseOrderService.getPicking(
      parseInt(params.purchaseOrderId!, 10),
    );
    navigate(`/inventory/stock_picking/${picking?.resId}`);
  }, [params, history]);
  const actionButtons = useMemo<ActionButtonProps[]>(() => {
    if (!purchaseOrder) {
      return [];
    }
    const buttons: ActionButtonProps[] = [];

    if (purchaseOrder.state === 'draft') {
      buttons.push({
        children: 'Gửi email',
        colorScheme: 'green',
      });

      buttons.push({
        children: 'In phiếu mua',
        colorScheme: 'green',
      });
    }

    if (purchaseOrder.state === 'sent') {
      buttons.push({
        children: 'Xác nhận',
        colorScheme: 'green',
      });
      buttons.push({
        children: 'Gửi email',
        colorScheme: 'green',
      });
    }

    if (purchaseOrder.state === 'to approve') {
      buttons.push({
        children: 'Duyệt mua',
        colorScheme: 'green',
      });
    }

    // if (purchaseOrder.state === 'purchase') {
    //   buttons.push({
    //     children: 'Khoá',
    //     colorScheme: 'green',
    //   });
    // }

    // if (purchaseOrder.state === 'done') {
    //   buttons.push({
    //     children: 'Mở khoá',
    //     colorScheme: 'green',
    //   });
    // }
    if (
      !!~['draft', 'to', 'approve', 'sent', 'purchase'].indexOf(
        purchaseOrder.state,
      )
    ) {
      buttons.push({
        children: 'Huỷ',
        colorScheme: 'red',
        onClick: handleCancelPurchaseOrder,
      });
    }

    if (
      !purchaseOrder.isShipped &&
      ~['purchase', 'done'].indexOf(purchaseOrder.state) &&
      purchaseOrder.pickingCount > 0
    ) {
      buttons.push({
        children: 'Nhận hàng',
        colorScheme: 'green',
        onClick: handleViewPicking,
      });
    }

    return buttons;
  }, [purchaseOrder, handleCancelPurchaseOrder, handleViewPicking]);

  if (!purchaseOrder) {
    return null;
  }
  return (
    <>
      <NavigationBarGeneral />
      <Box height="calc(100vh - 112px)" overflowY="auto">
        <Container maxW="6xl" pt={4}>
          <Breadcrumb mb={4}>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/purchase">
                Purchase orders
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">{purchaseOrder.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <PurchaseSummary purchaseOrder={purchaseOrder} />
          <PurchaseOrderLines purchaseOrderLines={purchaseOrderLines} />
        </Container>
      </Box>
      <Box position="fixed" left="0" right="0" bottom="0">
        <Container maxW="6xl" py={2}>
          <Stack direction="row">
            {actionButtons.map((actionButton, index) => (
              <Button key={index} {...actionButton} flex={1} />
            ))}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default PurchaseDetails;

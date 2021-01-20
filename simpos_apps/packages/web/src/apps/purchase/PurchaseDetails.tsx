import { Box, Container } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PurchaseOrder } from '../../services/db';
import { purchaseOrderService } from '../../services/purchase-order';
import { NavigationBarGeneral } from '../pos/components/NavigationBar';
import { PurchaseSummary } from './components/PurchaseSummary';

interface PurchaseDetailsRoute {
  purchaseOrderId: string;
}
const PurchaseDetails: React.FunctionComponent = () => {
  const params = useParams<PurchaseDetailsRoute>();
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(
    null,
  );
  const getPurchaseOrder = async (purchaseOrderId: string) => {
    const serverPurchaseOrder = await purchaseOrderService.getPurchaseOrder(
      parseInt(purchaseOrderId, 10),
    );
    setPurchaseOrder(serverPurchaseOrder);
  };
  useEffect(() => {
    getPurchaseOrder(params.purchaseOrderId);
  }, [params.purchaseOrderId]);

  if (!purchaseOrder) {
    return null;
  }
  return (
    <>
      <NavigationBarGeneral />
      <Box height="calc(100vh - 112px)" overflowY="auto">
        <Container maxW="6xl" pt={4}>
          <PurchaseSummary purchaseOrder={purchaseOrder} />
        </Container>
      </Box>
    </>
  );
};

export default PurchaseDetails;

import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Box,
  Button,
  Container,
  Grid,
  Stack,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { NavigationBarGeneral } from '../pos/components/NavigationBar';
import {
  StockPicking,
  stockPickingService,
} from '../../services/stock-picking';
import { ActionButtonProps } from '../../types';
import { StockPickingSummary } from './components/StockPickingSummary/StockPickingSummary';
import { StockMoves } from './components/StockPickingSummary/StockMoves';
import { StockMove, stockMoveService } from '../../services/stock-move';
import { useMachine } from '@xstate/react';
import { stockBackorderConfirmationService } from '../../services/stock-backorder-confirmation';
import { purchaseOrderService } from '../../services/purchase-order';
import {
  receiveProductsMachine,
  receiveProductsMachineStateMapping,
} from './machines/receive-products-machine';

const StockPickingDetails: React.FunctionComponent = () => {
  const toast = useToast();

  const params = useParams<{
    stockPickingId: string;
  }>();
  const [stockPicking, setStockPicking] = useState<StockPicking | null>(null);
  const [stockMoves, setStockMoves] = useState<StockMove[]>([]);
  const cancelPoDialogRef = useRef(null);
  const [receiveProductsMachineState, receiveProductsMachineSend] = useMachine(
    receiveProductsMachine,
  );
  const getStockPicking = async (stockPickingId: number) => {
    const serverStockPicking = await stockPickingService.getStockPicking(
      stockPickingId,
    );
    if (
      serverStockPicking &&
      serverStockPicking.moveIdsWithoutPackage.length > 0
    ) {
      const serverStockMoves = await stockMoveService.getStockMovesByIds(
        serverStockPicking.moveIdsWithoutPackage,
      );
      setStockMoves(serverStockMoves);
    }
    setStockPicking(serverStockPicking);
  };

  useEffect(() => {
    if (params.stockPickingId) {
      getStockPicking(parseInt(params.stockPickingId));
    }
  }, [params.stockPickingId]);

  const markPurcharOrderAsDone = useCallback(async () => {
    try {
      if (!stockPicking?.origin) {
        throw new Error('Stock picking origin is not found');
      }
      receiveProductsMachineSend('LOCK_PURCHASE_ORDER');
      const po = await purchaseOrderService.findByName(stockPicking?.origin);
      if (!po.id) {
        throw new Error(
          'Could not found purchase order by stock picking origin',
        );
      }
      await purchaseOrderService.lockPurchaseOrder(po.id);
      receiveProductsMachineSend('LOCKED_PURCHASE_ORDER');
    } catch (e) {
      receiveProductsMachineSend('LOCK_PURCHASE_ORDER_FAILED');
    }
  }, [stockPicking, receiveProductsMachineSend]);

  const nextActionNode = useMemo<React.ReactNode>(() => {
    const createBackorder = async (id: number) => {
      toast({
        title: 'Thông báo',
        description: 'Chức năng tạo backorder chưa hoàn thiện',
        status: 'warning',
        duration: 9000,
        isClosable: true,
      });
      // receiveProductsMachineSend('CREATE_BACKORDER');
      // await stockBackorderConfirmationService.processBackorder(id);
      // receiveProductsMachineSend('CREATED_BACKORDER');
    };

    const skipBackorder = async (id: number) => {
      receiveProductsMachineSend('SKIP_BACKORDER');
      await stockBackorderConfirmationService.cancelBackorder(id);
      receiveProductsMachineSend('SKIPPED_BACKORDER');

      await markPurcharOrderAsDone();
    };
    if (receiveProductsMachineState.value === 'backorderConfirmation') {
      const resId = receiveProductsMachineState.event.resId;
      return (
        <Box>
          <Alert status="warning" mb={2} borderRadius="md">
            <AlertIcon />
            Số lượng hàng nhập ít hơn số lương yêu cầu ban đầu.
          </Alert>
          <Grid templateColumns="1fr 1fr" gridGap={2}>
            <Button colorScheme="teal" onClick={() => createBackorder(resId)}>
              Tạo đơn nhập sau
            </Button>
            <Button colorScheme="orange" onClick={() => skipBackorder(resId)}>
              Bỏ qua
            </Button>
          </Grid>
        </Box>
      );
    }
    return receiveProductsMachineStateMapping[
      receiveProductsMachineState.value as string
    ];
  }, [
    receiveProductsMachineState,
    markPurcharOrderAsDone,
    receiveProductsMachineSend,
    toast,
  ]);
  const handleOnReceive = async (quantityMap: Record<string, number>) => {
    if (!stockPicking) {
      return;
    }

    receiveProductsMachineSend('UPDATE_MOVES');
    const stockMovesMap = stockMoves.reduce<Record<string, StockMove>>(
      (prev, current) => {
        return {
          ...prev,
          [current.id]: current,
        };
      },
      {},
    );

    let writeLinesError = false;

    try {
      await Promise.all(
        Object.keys(quantityMap).map((moveId: string, index) => {
          const move = stockMovesMap[moveId];
          const isUpdate = move.moveLineNosuggestIds.length > 0;

          if (isUpdate) {
            return stockMoveService.write(move.id, {
              move_line_nosuggest_ids: [
                [
                  1,
                  move.moveLineNosuggestIds[0],
                  {
                    qty_done: quantityMap[moveId],
                  },
                ],
              ],
            });
          } else {
            return stockMoveService.write(move.id, {
              move_line_nosuggest_ids: [
                [
                  0,
                  `virtual_${index}`,
                  {
                    company_id: stockPicking.companyId[0],
                    picking_id: stockPicking.id,
                    move_id: move.id,
                    product_id: move.productId[0],
                    location_id: move.locationId[0],
                    location_dest_id: stockPicking.locationDestId[0],
                    qty_done: quantityMap[moveId],
                    package_level_id: false,
                    lot_id: false,
                    lot_name: false,
                    package_id: false,
                    result_package_id: false,
                    owner_id: false,
                    is_initial_demand_editable: false,
                    state: move.state,
                    product_uom_id: move.productUom[0],
                  },
                ],
              ],
            });
          }
        }),
      );
      receiveProductsMachineSend('UPDATED_MOVES');
    } catch (e) {
      writeLinesError = true;
      receiveProductsMachineSend('UPDATE_MOVES_FAILED');
    }

    if (!writeLinesError) {
      receiveProductsMachineSend('VALIDATE_MOVES');
      try {
        const res = await stockPickingService.validateStockPicking(
          stockPicking.id,
        );
        if (res.resModel === 'stock.backorder.confirmation') {
          receiveProductsMachineSend('BACKORDER_CONFIRMATION', {
            resId: res.resId,
          });
        } else {
          receiveProductsMachineSend('VALIDATED_MOVES');
          await markPurcharOrderAsDone();
        }
      } catch (e) {
        receiveProductsMachineSend('VALIDATE_MOVES_FAILED');
      }
    }
  };

  const onDialogClose = () => {
    getStockPicking(parseInt(params.stockPickingId!));
    receiveProductsMachineSend('RESET');
  };

  const actionButtons = useMemo<ActionButtonProps[]>(() => {
    if (!stockPicking) {
      return [];
    }

    return [];
  }, [stockPicking]);

  if (!stockPicking) {
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
                Danh sách đơn mua
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink>{stockPicking.origin}</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">
                {stockPicking.displayName}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <StockPickingSummary stockPicking={stockPicking} />
          <StockMoves
            readonly={stockPicking.isLocked && stockPicking.state === 'done'}
            stockMoves={stockMoves}
            onReceive={handleOnReceive}
          />
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
      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onDialogClose}
        isOpen={receiveProductsMachineState.value !== 'initial'}
        isCentered
        leastDestructiveRef={cancelPoDialogRef}
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Trạng thái</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{nextActionNode}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelPoDialogRef} onClick={onDialogClose}>
              Tiếp tục
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StockPickingDetails;

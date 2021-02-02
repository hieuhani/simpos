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
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { NavigationBarGeneral } from '../pos/components/NavigationBar';
import {
  StockPicking,
  stockPickingService,
} from '../../services/stock-picking';
import { ActionButtonProps } from '../../types';
import { StockPickingSummary } from './components/StockPickingSummary/StockPickingSummary';
import { StockMoves } from './components/StockPickingSummary/StockMoves';
import { StockMove, stockMoveService } from '../../services/stock-move';
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';
import { stockBackorderConfirmationService } from '../../services/stock-backorder-confirmation';

const receiveProductsMachine = Machine({
  id: 'receive_product_machine',
  initial: 'initial',
  states: {
    initial: {
      on: { UPDATE_MOVES: 'updatingMoves' },
    },
    updatingMoves: {
      on: {
        UPDATED_MOVES: 'updatedMoves',
        UPDATE_MOVES_FAILED: 'updateMovesFailed',
      },
    },
    updatedMoves: {
      on: {
        VALIDATE_MOVES: 'validatingMoves',
      },
    },
    validatingMoves: {
      on: {
        VALIDATED_MOVES: 'validatedMoves',
        VALIDATE_MOVES_FAILED: 'validateMovesFailed',
        BACKORDER_CONFIRMATION: 'backorderConfirmation',
      },
    },
    backorderConfirmation: {
      on: {
        CREATE_BACKORDER: 'creatingBackorder',
        SKIP_BACKORDER: 'skippingBackorder',
      },
    },
    creatingBackorder: {
      on: {
        CREATED_BACKORDER: 'createdBackorder',
      },
    },
    skippingBackorder: {
      on: {
        SKIPPED_BACKORDER: 'skippedBackorder',
      },
    },
    createdBackorder: {},
    skippedBackorder: {},
    updateMovesFailed: {},
    validatedMoves: {},
    validateMovesFailed: {},
  },
  on: {
    RESET: 'initial',
  },
});

interface PurchaseDetailsRoute {
  stockPickingId: string;
}

const StockPickingDetails: React.FunctionComponent = () => {
  const params = useParams<PurchaseDetailsRoute>();
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
    getStockPicking(parseInt(params.stockPickingId));
  }, [params.stockPickingId]);

  const createBackorder = async (id: number) => {
    receiveProductsMachineSend('CREATE_BACKORDER');
    await stockBackorderConfirmationService.processBackorder(id);
    receiveProductsMachineSend('CREATED_BACKORDER');
  };

  const skipBackorder = async (id: number) => {
    receiveProductsMachineSend('SKIP_BACKORDER');
    await stockBackorderConfirmationService.cancelBackorder(id);
    receiveProductsMachineSend('SKIPPED_BACKORDER');
  };

  const nextActionNode = useMemo<React.ReactNode>(() => {
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
    return null;
  }, [receiveProductsMachineState]);
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
    } catch {
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
        }
      } catch {
        receiveProductsMachineSend('VALIDATE_MOVES_FAILED');
      }
    }
  };

  const onDialogClose = () => {
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

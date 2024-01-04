import { Machine } from 'xstate';

export const receiveProductsMachine = Machine({
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
    skippedBackorder: {
      on: {
        LOCK_PURCHASE_ORDER: 'lockingPurchaseOrder',
      },
    },
    updateMovesFailed: {},
    validatedMoves: {
      on: {
        LOCK_PURCHASE_ORDER: 'lockingPurchaseOrder',
      },
    },
    lockingPurchaseOrder: {
      on: {
        LOCKED_PURCHASE_ORDER: 'lockedPurchaseOrder',
        LOCK_PURCHASE_ORDER_FAILED: 'lockPurchaseOrderFailed',
      },
    },
    validateMovesFailed: {},
    lockedPurchaseOrder: {},
    lockPurchaseOrderFailed: {},
  },
  on: {
    RESET: 'initial',
  },
});

export const receiveProductsMachineStateMapping: Record<string, string> = {
  updatingMoves: 'Updating moves',
  updatedMoves: 'Updated moves',
  updateMovesFailed: 'Error in updating moves',
  validatingMoves: 'Validating moves',
  validatedMoves: 'Validated moves',
  validateMovesFailed: 'Error in validating moves',
  backorderConfirmation:
    'Because of missing products, please confirm how to receive the rest',
  creatingBackorder: 'Creating back order',
  skippingBackorder: 'Skipping back order',
  createdBackorder: 'Back order created',
  skippedBackorder: 'Skipping back order',
  lockingPurchaseOrder: 'Purchasing',
  lockedPurchaseOrder: 'Purchase completed',
  lockPurchaseOrderFailed: 'Error in purchasing',
};

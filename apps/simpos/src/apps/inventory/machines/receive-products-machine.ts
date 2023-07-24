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
  updatingMoves: 'Đang cập nhật thông tin chuyển hàng',
  updatedMoves: 'Đã cập nhật thông tin chuyển hàng',
  updateMovesFailed: 'Có lỗi khi cập nhật thông tin chuyển hàng',
  validatingMoves: 'Đang kiểm tra thông tin chuyển hàng',
  validatedMoves: 'Đã kiểm tra thông tin chuyển hàng xong',
  validateMovesFailed: 'Có lỗi khi kiểm tra thông tin chuyển hàng',
  backorderConfirmation:
    'Do nhận hàng thiếu nên cần xác nhận cách nhận phần còn lại',
  creatingBackorder: 'Đang tạo đơn bù hàng thiếu',
  skippingBackorder: 'Đang bỏ qua phần hàng thiếu',
  createdBackorder: 'Đã tạo đơn bù hàng thiếu xong',
  skippedBackorder: 'Đã bỏ qua phần hàng thiếu',
  lockingPurchaseOrder: 'Đang hoàn thành đơn hàng',
  lockedPurchaseOrder: 'Đã hoàn thành đơn hàng',
  lockPurchaseOrderFailed: 'Có lỗi khi hoàn thành đơn hàng',
};

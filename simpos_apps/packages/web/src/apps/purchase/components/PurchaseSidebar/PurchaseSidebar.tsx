import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Flex,
  Stack,
  Image,
  Text,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { PurchasePanel } from '../PurchasePanel';
import {
  usePurchaseDispatch,
  usePurchaseState,
} from '../../contexts/PurchaseContext';
import { IconCalendarAlt } from '../../../../components/icons';
import {
  DefaultPurchaseOrder,
  purchaseOrderService,
} from '../../../../services/purchase-order';
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';
import {
  StockPickingType,
  stockPickingTypeService,
} from '../../../../services/stock-picking-type';
import { useHistory } from 'react-router-dom';

const poStateMessageMap: Record<string, string> = {
  creatingPo: 'Đang tạo đơn mua...',
  createdPo: 'Đã tạo đơn mua thành công',
  confirmingPo: 'Đang xác nhận đơn mua...',
  confirmedPo: 'Xác nhận đơn mua thành công',
  confirmPoFailed: 'Xác nhận đơn mua thất bại',
  createPoFailed: 'Tạo đơn mua thất bại',
};

const createPoMachine = Machine({
  id: 'create_po_machine',
  initial: 'initial',
  states: {
    initial: {
      on: { CREATE_PO: 'creatingPo' },
    },
    creatingPo: {
      on: {
        CREATED_PO: 'createdPo',
        CREATE_PO_FAILED: 'createPoFailed',
      },
    },
    createdPo: {
      on: {
        CONFIRM_PO: 'confirmingPo',
      },
    },
    confirmingPo: {
      on: {
        CONFIRMED_PO: 'confirmedPo',
        CONFIRM_PO_FAILED: 'confirmPoFailed',
      },
    },
    createPoFailed: {},
    confirmedPo: {},
    confirmPoFailed: {},
  },
  on: {
    RESET: 'initial',
  },
});

export const PurchaseSidebar: React.FunctionComponent = () => {
  const state = usePurchaseState();
  const history = useHistory();
  const [createPoState, poMachineSend] = useMachine(createPoMachine);
  const dispatch = usePurchaseDispatch();
  const cancelPoDialogRef = useRef(null);
  const [stockPickingTypes, setStockPickingTypes] = useState<
    StockPickingType[]
  >([]);
  const [defaultPurchaseOrder, setDefaultPurchaseOrder] = useState<
    DefaultPurchaseOrder | undefined
  >();

  const makePurchase = async () => {
    const po = defaultPurchaseOrder!;
    poMachineSend('CREATE_PO');
    let purchaseOrderId;
    try {
      purchaseOrderId = await purchaseOrderService.create({
        currencyId: po.currencyId,
        dateOrder: po.dateOrder,
        companyId: po.companyId,
        pickingTypeId: po.pickingTypeId,
        userId: po.userId,
        partnerId: 1, // chateraise id
        lines: state.lines.map((line) => ({
          productId: line.product.id,
          name: line.product.name,
          datePlanned: po.dateOrder,
          productQty: line.quantity,
          priceUnit: line.product.lstPrice,
        })),
      });
      dispatch({ type: 'RESET' });
      poMachineSend('CREATED_PO');
    } catch {
      poMachineSend('CREATE_PO_FAILED');
    }
    poMachineSend('CONFIRM_PO');
    try {
      await purchaseOrderService.confirmPurchaseOrder(purchaseOrderId);
      poMachineSend('CONFIRMED_PO', { purchaseOrderId });
    } catch {
      poMachineSend('CONFIRM_PO_FAILED');
    }
  };

  const onPoDialogClose = () => {
    poMachineSend('RESET');
    if (
      createPoState.event.type === 'CONFIRMED_PO' &&
      createPoState.event.purchaseOrderId
    ) {
      history.push(`/purchase/${createPoState.event.purchaseOrderId}`);
    }
  };

  const defaultGet = async () => {
    const defaultPo = await purchaseOrderService.defaultGet();
    const serverStockPickingTypes = await stockPickingTypeService.getIncommingStockPickingTypes();
    setStockPickingTypes(serverStockPickingTypes);
    setDefaultPurchaseOrder(defaultPo);
  };

  useEffect(() => {
    defaultGet();
  }, []);

  if (!defaultPurchaseOrder) {
    return null;
  }

  return (
    <>
      <Stack spacing={4} direction="row" p={4}>
        <Box flex="1">
          <Text color="brand.100" fontWeight="medium" mb={1}>
            Đối tác cung ứng
          </Text>
          <Flex
            alignItems="center"
            p={2}
            rounded="md"
            backgroundColor="white"
            boxShadow="sm"
            borderRadius="md"
            minHeight="62px"
          >
            <Box w="40px">
              <Image
                borderRadius="md"
                src="https://scontent.fhan5-7.fna.fbcdn.net/v/t1.0-9/16602989_213352972404188_8062965415553834_n.png?_nc_cat=100&ccb=2&_nc_sid=09cbfe&_nc_ohc=YPYGE_-HWN4AX9h6pmg&_nc_ht=scontent.fhan5-7.fna&oh=04d6fc4de63a6452bad1b569d35a352d&oe=602780CA"
              />
            </Box>
            <Box ml="2">
              <Text fontWeight="medium" mb="0">
                Chateraise Viet Nam
              </Text>
              <Text fontSize="sm">02499383844</Text>
            </Box>
          </Flex>
        </Box>
        <Box flex="1">
          <Text color="brand.100" fontWeight="medium" mb={1}>
            Ngày đặt hàng
          </Text>
          <Flex
            p={2}
            rounded="md"
            backgroundColor="white"
            boxShadow="sm"
            borderRadius="md"
            minHeight="62px"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontWeight="medium">{defaultPurchaseOrder.dateOrder}</Text>
            <IconCalendarAlt size="22" />
          </Flex>
        </Box>
        <Box flex="1">
          <Text color="brand.100" fontWeight="medium" mb={1}>
            Địa điểm nhận
          </Text>
          <Flex
            p={2}
            rounded="md"
            backgroundColor="white"
            boxShadow="sm"
            borderRadius="md"
            minHeight="62px"
            alignItems="center"
          >
            <Text fontWeight="medium">Baumkuchen Tran Nhan Tong</Text>
          </Flex>
        </Box>
      </Stack>
      <Box px={4}>
        <Text color="brand.100" fontWeight="medium" mb={1}>
          Giỏ sản phẩm
        </Text>
      </Box>
      <Box flex={1} overflowY="auto">
        <PurchasePanel lines={state.lines} />
      </Box>
      <Box px={4} py={2}>
        <Button
          width="full"
          color="white"
          background="brand.100"
          disabled={state.lines.length === 0}
          onClick={makePurchase}
        >
          Mua hàng
        </Button>
      </Box>
      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onPoDialogClose}
        isOpen={createPoState.value !== 'initial'}
        isCentered
        leastDestructiveRef={cancelPoDialogRef}
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Trạng thái</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            {poStateMessageMap[createPoState.value.toString()]}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelPoDialogRef} onClick={onPoDialogClose}>
              Tiếp tục
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

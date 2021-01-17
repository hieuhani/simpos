import React, { useEffect, useState } from 'react';
import { Box, Flex, Stack, Image, Text, Button } from '@chakra-ui/react';
import { PurchasePanel } from '../PurchasePanel';
import { usePurchaseState } from '../../contexts/PurchaseContext';
import { IconCalendarAlt } from '../../../../components/icons';
import {
  DefaultPurchaseOrder,
  purchaseOrderService,
} from '../../../../services/purchase-order';

export const PurchaseSidebar: React.FunctionComponent = () => {
  const state = usePurchaseState();
  const [defaultPurchaseOrder, setDefaultPurchaseOrder] = useState<
    DefaultPurchaseOrder | undefined
  >();

  const makePurchase = async () => {
    const po = defaultPurchaseOrder!;
    const purchaseOrderId = await purchaseOrderService.create({
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
    await purchaseOrderService.confirmPurchaseOrder(purchaseOrderId);
  };

  const defaultGet = async () => {
    const defaultPo = await purchaseOrderService.defaultGet();
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
          Thanh toán
        </Button>
      </Box>
    </>
  );
};

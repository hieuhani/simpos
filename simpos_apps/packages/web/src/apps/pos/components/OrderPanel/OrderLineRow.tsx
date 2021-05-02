import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Badge,
  Flex,
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Portal,
  Button,
  PopoverFooter,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { IconTrashAlt } from '../../../../components/icons/output/IconTrashAlt';
import { Stepper } from '../../../../components/Stepper';
import { OrderLine } from '../../../../services/db';
import { useMoneyFormatter, useOrderLineExtensions } from '../../../../hooks';
import { EditOrderLine } from './EditOrderLine';
import { useOrderManagerAction } from '../../../../contexts/OrderManager';
import { ProductImageThumb } from '../ProductCard/ProductImageThumb';
import { useDebounce } from '../../../../hooks/use-debounce';

export interface OrderLineRowProps {
  onClick?: () => void;
  orderLine: OrderLine;
}

export const OrderLineRow: React.FunctionComponent<OrderLineRowProps> = ({
  onClick,
  orderLine,
}) => {
  const { formatCurrency } = useMoneyFormatter();
  const [localValue, setLocalValue] = useState(orderLine.discount);
  const debouncedValue = useDebounce(localValue, 500);
  const { getUnitDisplayPrice, getDisplayPrice } = useOrderLineExtensions(
    orderLine,
  );
  useEffect(() => {
    updateOrderLine(orderLine.id!, {
      discount: debouncedValue,
    });
  }, [debouncedValue]);
  const { updateOrderLine, deleteOrderLine } = useOrderManagerAction();
  if (!orderLine.productVariant) {
    return null;
  }

  const onChange = (value: number) => {
    if (value !== orderLine.qty) {
      if (value === 0) {
        deleteOrderLine(orderLine.id!);
      } else {
        updateOrderLine(orderLine.id!, {
          qty: value,
        });
      }
    }
  };

  const onDiscountChange = (value: number) => {
    setLocalValue(value);
  };

  const onDeleteOrderLine = () => {
    deleteOrderLine(orderLine.id!);
  };

  return (
    <Popover placement="left" isLazy>
      <PopoverTrigger>
        <Flex
          alignItems="center"
          mt={1}
          py={4}
          px={4}
          w="full"
          as="button"
          rounded="md"
          boxShadow="sm"
          borderRadius="md"
          onClick={onClick}
          background="white"
          _focus={{
            outline: 'none',
            boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)',
          }}
        >
          <Box width="55px" position="relative">
            <ProductImageThumb variant={orderLine.productVariant} />
            <Badge
              position="absolute"
              top="-0.5rem"
              right="-0.5rem"
              backgroundColor="green.500"
              color="white"
              borderRadius="full"
              width={6}
              height={6}
              alignItems="center"
              justifyContent="center"
              display="flex"
            >
              {orderLine.qty}
            </Badge>
          </Box>
          <Box ml={4} textAlign="left">
            <Heading size="sm" fontWeight="medium" mb={1}>
              {orderLine.productVariant?.name}
            </Heading>
            <Stack direction="row">
              {orderLine.productVariant.defaultCode && (
                <Badge>{orderLine.productVariant.defaultCode}</Badge>
              )}
              <Badge>
                {formatCurrency(getUnitDisplayPrice(), 'Product Price')}
              </Badge>
            </Stack>
          </Box>
          <Box ml="auto">
            <Heading size="sm">
              {formatCurrency(getDisplayPrice(), 'Product Price')}
            </Heading>
          </Box>
        </Flex>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Chỉnh sửa sản phẩm</PopoverHeader>
          <PopoverBody>
            <EditOrderLine
              productVariant={orderLine.productVariant}
              unitPrice={formatCurrency(getUnitDisplayPrice(), 'Product Price')}
            />
          </PopoverBody>
          <PopoverFooter bgColor="yellow.50">
            <Heading mb={2} size="sm" fontWeight="500">
              Giảm giá sản phẩm %
            </Heading>
            <Flex>
              <NumberInput
                maxW="80px"
                bgColor="white"
                mr="2rem"
                value={localValue}
                onChange={(_, value) => onDiscountChange(value)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Slider
                flex="1"
                focusThumbOnChange={false}
                value={localValue}
                onChange={onDiscountChange}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb
                  fontSize="sm"
                  boxSize="32px"
                  children={localValue}
                />
              </Slider>
            </Flex>
          </PopoverFooter>
          <PopoverFooter>
            <Flex>
              <Stepper value={orderLine.qty} onChange={onChange} />
              <Button
                ml="auto"
                colorScheme="red"
                size="sm"
                onClick={onDeleteOrderLine}
              >
                <IconTrashAlt size="20" />
              </Button>
            </Flex>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

import React, { FormEvent } from 'react';
import {
  Box,
  Heading,
  Badge,
  Flex,
  Stack,
  Button,
  Select,
} from '@chakra-ui/react';
import { Counter } from '../../../../components/Counter';
import { formatMoney } from '../../../../utils';
import {
  PurchaseLine,
  usePurchaseDispatch,
} from '../../contexts/PurchaseContext';
import { IconTrashAlt } from '../../../../components/icons';

export interface PurchaseLineRowProps {
  onClick?: () => void;
  line: PurchaseLine;
}

export const PurchaseLineRow: React.FunctionComponent<PurchaseLineRowProps> = ({
  onClick,
  line,
}) => {
  const { product } = line;
  const dispatch = usePurchaseDispatch();
  const onLineQuantityChanged = (quantity: number) => {
    dispatch({
      type: 'UPDATE_LINE',
      payload: {
        virtualId: line.virtualId,
        quantity,
      },
    });
  };

  const onDeleteLine = () => {
    dispatch({
      type: 'REMOVE_LINE',
      payload: line.virtualId,
    });
  };

  const onProductUomChanged = (e: FormEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'UPDATE_LINE',
      payload: {
        virtualId: line.virtualId,
        quantity: line.quantity,
        productUom: parseInt(e.currentTarget.value, 10),
      },
    });
  };
  return (
    <Flex
      alignItems="center"
      mt={1}
      py={4}
      px={4}
      w="full"
      rounded="md"
      boxShadow="sm"
      borderRadius="md"
      onClick={onClick}
      background="white"
    >
      <Box textAlign="left" mr="auto">
        <Heading size="sm" fontWeight="medium" mb={1}>
          {product.name}
        </Heading>
        <Stack direction="row">
          {product.defaultCode && <Badge>{product.defaultCode}</Badge>}

          <Badge>{formatMoney(line.product.lstPrice)}</Badge>
        </Stack>
      </Box>
      <Stack direction="row">
        {product.uomPoId[0] !== 1 && (
          <Select
            w="120px"
            onChange={onProductUomChanged}
            value={line.productUom}
          >
            <option value={1}>Cái</option>
            <option value={product.uomPoId[0]}>{product.uomPoId[1]}</option>
          </Select>
        )}

        <Counter
          value={line.quantity}
          onchange={(value) => onLineQuantityChanged(value)}
        />
        <Button
          height="2.5rem"
          colorScheme="red"
          size="sm"
          onClick={onDeleteLine}
        >
          <IconTrashAlt size="20" />
        </Button>
      </Stack>
    </Flex>
  );
};

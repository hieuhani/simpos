import {
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tfoot,
  Tr,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { StockMove } from '../../../../../services/stock-move';

export interface StockMovesProps {
  stockMoves: StockMove[];
  readonly: boolean;
  onReceive?: (quantityMap: Record<number, number>) => void;
}
export const StockMoves: React.FunctionComponent<StockMovesProps> = ({
  stockMoves,
  readonly,
  onReceive,
}) => {
  const [quantityDoneMap, setQuantityDoneMap] = useState<
    Record<number, number>
  >(
    stockMoves.reduce((prev, current) => {
      return {
        ...prev,
        [current.id]: current.quantityDone,
      };
    }, {}),
  );
  const onQuantityDoneChange = (moveId: number, value: number) => {
    setQuantityDoneMap({
      ...quantityDoneMap,
      [moveId]: value,
    });
  };
  return (
    <Box mt={4} backgroundColor="gray.100" borderRadius="md">
      <Table variant="striped" colorScheme="pink">
        <Thead>
          <Tr>
            <Th>Sản phẩm</Th>
            <Th>Số lượng yêu cầu</Th>
            <Th>Nhận</Th>
          </Tr>
        </Thead>
        <Tbody>
          {stockMoves.map((move) => (
            <Tr key={move.id}>
              <Td>{move.productId && move.productId[1]}</Td>
              <Td>{move.productUomQty}</Td>
              <Td>
                {readonly ? (
                  move.quantityDone
                ) : (
                  <NumberInput
                    value={quantityDoneMap[move.id]}
                    onChange={(_, value) =>
                      onQuantityDoneChange(move.id, value)
                    }
                    min={0}
                    max={move.productUomQty}
                  >
                    <NumberInputField backgroundColor="white" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
        {!readonly && (
          <Tfoot>
            <Tr>
              <Th colSpan={2} />
              <Th>
                <Button
                  colorScheme="pink"
                  w="full"
                  onClick={() => onReceive && onReceive(quantityDoneMap)}
                >
                  Nhận hàng
                </Button>
              </Th>
            </Tr>
          </Tfoot>
        )}
      </Table>
    </Box>
  );
};

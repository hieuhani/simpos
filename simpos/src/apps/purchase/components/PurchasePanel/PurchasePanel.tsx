import { Box, Stack } from '@chakra-ui/react';
import React from 'react';
import { PurchaseLine } from '../../contexts/PurchaseContext';
import { PurchaseLineRow } from './PurchaseLineRow';

export interface PurchasePanelProps {
  lines: PurchaseLine[];
}

export const PurchasePanel: React.FunctionComponent<PurchasePanelProps> = ({
  lines,
}) => {
  return (
    <Box px={4}>
      <Stack spacing={4}>
        {lines.map((line) => (
          <PurchaseLineRow key={line.virtualId} line={line} />
        ))}
      </Stack>
    </Box>
  );
};

import { Box, Text } from '@chakra-ui/react';
import React from 'react';

export interface BoxInfoProps {
  title: string;
  value: string;
}
export const BoxInfo: React.FunctionComponent<BoxInfoProps> = ({
  title,
  value,
}) => (
  <Box backgroundColor="gray.100" borderRadius="md" px={4} py={2}>
    <Text>{title}</Text>
    <Text fontWeight="medium">{value}</Text>
  </Box>
);

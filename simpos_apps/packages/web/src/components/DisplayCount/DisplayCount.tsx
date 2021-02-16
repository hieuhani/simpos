import { Box, Text, Heading, Flex } from '@chakra-ui/react';
import React from 'react';

export interface DisplayCountProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
}

export const DisplayCount: React.FunctionComponent<DisplayCountProps> = ({
  icon,
  title,
  value,
}) => {
  return (
    <Flex alignItems="center">
      {icon && <Box mr="2">{icon}</Box>}
      <Box>
        <Text>{title}</Text>
        <Heading fontSize="2xl" lineHeight={1}>
          {value}
        </Heading>
      </Box>
    </Flex>
  );
};

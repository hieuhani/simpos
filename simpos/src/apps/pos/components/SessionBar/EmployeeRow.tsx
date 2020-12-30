import React from 'react';
import { Avatar, Box, Button, Heading } from '@chakra-ui/react';
import { IconCheckCircle } from '../../../../components/icons/output/IconCheckCircle';
import { Employee } from '../../../../services/db/employee';

export interface EmployeeRowProps {
  employee: Employee;
  checked?: boolean;
  onClick: () => void;
}
export const EmployeeRow: React.FunctionComponent<EmployeeRowProps> = ({
  employee,
  checked,
  onClick,
}) => {
  return (
    <Button
      display="flex"
      justifyContent="flex-start"
      textAlign="left"
      alignItems="center"
      p={2}
      h="4rem"
      backgroundColor="white"
      onClick={onClick}
    >
      <Avatar name={employee.name} />
      <Box ml={2} flex="1">
        <Heading size="sm" fontWeight="medium">
          {employee.name}
        </Heading>
      </Box>
      <Box w="4">{checked && <IconCheckCircle color="green" />}</Box>
    </Button>
  );
};

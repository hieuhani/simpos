import { Box, Button, HStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDebounce } from '../../hooks/use-debounce';
import { IconMinus } from '../icons/output/IconMinus';
import { IconPlus } from '../icons/output/IconPlus';

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
}

export const Stepper: React.FunctionComponent<StepperProps> = ({
  value,
  onChange,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 500);

  const increase = () => {
    setLocalValue(localValue + 1);
  };

  const decrease = () => {
    setLocalValue(localValue - 1);
  };

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);
  return (
    <HStack>
      <Button ml="auto" size="sm" onClick={decrease}>
        <IconMinus size="20" />
      </Button>
      <Box w="30px" textAlign="center">
        {localValue}
      </Box>
      <Button ml="auto" size="sm" onClick={increase}>
        <IconPlus size="20" />
      </Button>
    </HStack>
  );
};

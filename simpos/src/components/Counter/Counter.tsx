import { Stack, Button, Input } from '@chakra-ui/react';
import React, { FormEvent } from 'react';

export interface CounterProps {
  value: number;
  onchange: (value: number) => void;
}

export const Counter: React.FunctionComponent<CounterProps> = ({
  value,
  onchange,
}) => {
  return (
    <Stack direction="row" alignItems="center">
      <Button disabled={value === 1} onClick={() => onchange(value - 1)}>
        -
      </Button>
      <Input
        textAlign="center"
        width="100px"
        type="number"
        value={value}
        onChange={(e: FormEvent<HTMLInputElement>) =>
          onchange(parseInt(e.currentTarget.value, 10))
        }
      />
      <Button onClick={() => onchange(value + 1)}>+</Button>
    </Stack>
  );
};

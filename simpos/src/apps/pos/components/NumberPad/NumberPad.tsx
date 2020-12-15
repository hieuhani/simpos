import React from 'react';
import { Button, Grid } from '@chakra-ui/react';
import { IconBackspace, IconChevronRight } from '../../../../components/icons';

export type NumberPadType = 'number' | 'action';

export type NumberPadValue = 'BACKSPACE' | 'ALL_CLEAR' | 'SUBMIT' | string;
export interface NumberPadProps {
  onClick: (value: NumberPadValue, type: NumberPadType) => void;
  submittable?: boolean;
}

export const NumberPad: React.FunctionComponent<NumberPadProps> = ({
  onClick,
  submittable,
}) => {
  return (
    <Grid templateColumns="1fr 1fr 1fr 2fr" gridGap={2}>
      {['7', '8', '9'].map((value) => (
        <Button key={value} onClick={() => onClick(value, 'number')}>
          {value}
        </Button>
      ))}

      <Button onClick={() => onClick('BACKSPACE', 'action')}>
        <IconBackspace size="26" />
      </Button>
      {['4', '5', '6'].map((value) => (
        <Button key={value} onClick={() => onClick(value, 'number')}>
          {value}
        </Button>
      ))}

      <Button onClick={() => onClick('ALL_CLEAR', 'action')}>AC</Button>
      {['1', '2', '3'].map((value) => (
        <Button key={value} onClick={() => onClick(value, 'number')}>
          {value}
        </Button>
      ))}
      <Button
        gridColumn="4 / 5"
        gridRow="3 / 5"
        height="auto"
        colorScheme="red"
        onClick={() => onClick('SUBMIT', 'action')}
        disabled={!submittable}
      >
        <IconChevronRight size={33} />
      </Button>
      {['000', '0', '0000'].map((value) => (
        <Button key={value} onClick={() => onClick(value, 'number')}>
          {value}
        </Button>
      ))}
    </Grid>
  );
};

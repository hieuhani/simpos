import React from 'react';
import { Button, Grid } from '@chakra-ui/react';
import { IconBackspace, IconChevronRight } from '../../../../components/icons';

export const NumberPad: React.FunctionComponent = () => (
  <Grid templateColumns="1fr 1fr 1fr 2fr" gridGap={2}>
    <Button>7</Button>
    <Button>8</Button>
    <Button>9</Button>
    <Button>
      <IconBackspace size="26" />
    </Button>
    <Button>4</Button>
    <Button>5</Button>
    <Button>6</Button>
    <Button>AC</Button>
    <Button>1</Button>
    <Button>2</Button>
    <Button>3</Button>
    <Button gridColumn="4 / 5" gridRow="3 / 5" height="auto">
      OK <IconChevronRight />
    </Button>
    <Button>000</Button>
    <Button>0</Button>
    <Button>0000</Button>
  </Grid>
);

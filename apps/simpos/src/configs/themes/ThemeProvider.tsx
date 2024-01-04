import React, { PropsWithChildren } from 'react';
import { Global } from '@emotion/react';
import { ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react';
import { globalStyles } from './globalStyles';
import 'react-datepicker/dist/react-datepicker.css';

export interface ThemeProviderProps {
  children?: React.ReactNode;
}

const theme = extendTheme({
  colors: {
    brand: {
      100: '#1FB886',
      200: '#06a06e',
      400: '#1FB886',
      500: '#def3ec',
    },
  },
});

export const ThemeProvider: React.FunctionComponent<PropsWithChildren> = ({
  children,
}: ThemeProviderProps) => (
  <ChakraProvider theme={theme}>
    <Global styles={globalStyles} />
    <CSSReset />
    {children}
  </ChakraProvider>
);

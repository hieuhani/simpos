import React from 'react';
import { Global } from '@emotion/react';
import { ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react';
import { globalStyles } from './globalStyles';

export interface ThemeProviderProps {
  children?: React.ReactNode;
}

const theme = extendTheme({
  colors: {
    brand: {
      100: '#551937',
      200: '#7C2551',
      300: '#893645',
      400: '#894966',
      500: '#BCA5AE',
    },
  },
});

export const ThemeProvider: React.FunctionComponent = ({
  children,
}: ThemeProviderProps) => (
  <ChakraProvider theme={theme}>
    <Global styles={globalStyles} />
    <CSSReset />
    {children}
  </ChakraProvider>
);

import React from 'react';
import { Global } from '@emotion/react';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { globalStyles } from './globalStyles';

export interface ThemeProviderProps {
  children?: React.ReactNode;
}

export const ThemeProvider: React.FunctionComponent = ({
  children,
}: ThemeProviderProps) => (
  <ChakraProvider>
    <Global styles={globalStyles} />
    <CSSReset />
    {children}
  </ChakraProvider>
);

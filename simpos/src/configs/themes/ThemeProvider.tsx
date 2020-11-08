import React from 'react';
import { Global } from '@emotion/core';
import {
  ThemeProvider as ChakraThemeProvider,
  CSSReset,
} from '@chakra-ui/core';
import { globalStyles } from './globalStyles';

export interface ThemeProviderProps {
  children?: React.ReactNode;
}

export const ThemeProvider: React.FunctionComponent = ({
  children,
}: ThemeProviderProps) => (
  <ChakraThemeProvider>
    <Global styles={globalStyles} />
    <CSSReset />
    {children}
  </ChakraThemeProvider>
);

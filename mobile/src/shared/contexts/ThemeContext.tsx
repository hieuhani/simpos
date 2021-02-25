import React, { useContext } from 'react';
import { colors } from '../../configs/theme';

const defaultTheme = {
  colors,
  borderRadius: 8,
  brand: {
    main: '#9C1B50',
    text: '#838383',
    primary: '#541A37',
    secondary: '#F7B437',
    success: '#F7B437',
    danger: '#F7B437',
    warning: '#F7B437',
    info: '#F7B437',
  },
};

export type Theme = typeof defaultTheme;

export const ThemeContext = React.createContext<Theme>(defaultTheme);

export interface ThemeProviderProps {
  theme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme,
  children,
}) => {
  const themeValue = Object.assign({}, defaultTheme, theme);
  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
};

export function useTheme(): Theme {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be inside a ThemeProvider');
  }
  return context;
}

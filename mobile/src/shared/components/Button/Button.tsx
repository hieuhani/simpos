import React from 'react';
import {
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { IconProps } from 'react-native-vector-icons/Icon';

import { useTheme, Theme } from '../../contexts';
import { ThemeVariant } from '../../../types';

export interface ButtonProps {
  children?: React.ReactNode | string;
  onPress?: () => void;
  block?: boolean;
  variant?: ThemeVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  direction?: 'column' | 'row' | 'column-reverse' | 'row-reverse';
  outline?: boolean;
  link?: boolean;
  icon?: IconProps;
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
  },

  textWhite: {
    color: '#FFFFFF',
  },
  icon: {
    marginRight: 8,
  },
});

const getButtonStyles = (
  {
    outline = false,
    variant = 'primary',
    block = false,
    link = false,
  }: Partial<ButtonProps>,
  theme: Theme,
): StyleProp<ViewStyle> => {
  const buttonStyles: StyleProp<ViewStyle> = {
    borderColor: theme.brand[variant],
  };
  if (link) {
    buttonStyles.borderWidth = 0;
  }
  if (!outline && !link) {
    buttonStyles.backgroundColor = theme.brand[variant];
  }
  if (!block) {
    buttonStyles.alignSelf = 'flex-start';
  }
  return buttonStyles;
};

const getTextStyles = (
  { outline = false, variant = 'primary', link = false }: Partial<ButtonProps>,
  theme: Theme,
): StyleProp<ViewStyle> => {
  const textStyles: StyleProp<TextStyle> = {};
  if (outline || link) {
    textStyles.color = theme.brand[variant];
  } else {
    if (variant === 'primary') {
      textStyles.color = theme.colors.white;
    }
  }
  return textStyles;
};

export const Button = React.forwardRef<any, ButtonProps>(
  (
    {
      children,
      disabled,
      onPress,
      block,
      variant,
      style,
      outline = false,
      direction = 'row',
      link = false,
      icon,
    }: ButtonProps,
    ref,
  ) => {
    const theme = useTheme();
    const buttonStyles: Array<StyleProp<ViewStyle>> = [
      styles.button,
      {
        flexDirection: direction,
        borderRadius: theme.borderRadius,
      },
    ];
    const textStyles: Array<StyleProp<TextStyle>> = [];

    buttonStyles.push(
      getButtonStyles({ outline, variant, block, link }, theme),
    );
    textStyles.push(getTextStyles({ outline, variant, block, link }, theme));

    let node;
    if (typeof children === 'string') {
      node = <Text style={textStyles}>{children}</Text>;
    } else {
      node = children;
    }
    if (style) {
      buttonStyles.push(style);
    }

    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        style={buttonStyles}
        disabled={disabled || !onPress}>
        {icon && <Icon style={[styles.icon, textStyles]} {...icon} />}
        {node}
      </TouchableOpacity>
    );
  },
);

Button.defaultProps = {
  variant: 'primary',
};

import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../contexts';

export interface InputProps extends TextInputProps {
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  error?: boolean;
  inputStyle?: StyleProp<ViewStyle>;
  feedback?: React.ReactNode;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  textInputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledView: {},
  textInput: {
    height: 44,
    paddingHorizontal: 10,
    flex: 1,
  },
  iconWrapper: {
    paddingHorizontal: 10,
  },
});

export const Input: React.FunctionComponent<InputProps> = React.memo(
  ({
    label,
    disabled,
    style,
    textStyle,
    inputStyle,
    feedback,
    ...inputProps
  }) => {
    const theme = useTheme();
    const containerStyles: Array<StyleProp<ViewStyle>> = [styles.container];

    if (style) {
      containerStyles.push(style);
    }
    return (
      <View style={containerStyles}>
        {label && (
          <Text
            style={[
              styles.label,
              {
                color: theme.brand.main,
              },
              textStyle,
            ]}>
            {label}
          </Text>
        )}
        <View
          style={[
            styles.textInputWrapper,
            {
              borderRadius: theme.borderRadius,
              backgroundColor: theme.colors.neutral20,
            },
            inputStyle,
          ]}>
          <TextInput style={[styles.textInput]} {...inputProps} />
          {disabled && (
            <View style={[StyleSheet.absoluteFill, styles.disabledView]} />
          )}
          {feedback}
        </View>
      </View>
    );
  },
);

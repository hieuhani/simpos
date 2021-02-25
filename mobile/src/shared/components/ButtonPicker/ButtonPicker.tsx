import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

export interface UserPickerProps {
  style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  container: {},
  name: {},
  title: {
    marginBottom: 6,
    color: '#444',
    fontSize: 12,
  },
});

export const ButtonPicker: React.FunctionComponent<UserPickerProps> = ({
  style,
}) => (
  <TouchableOpacity style={[styles.container, style]}>
    <Text style={styles.title}>Chuyển từ</Text>
    <Text style={styles.name}>WH/Kho -20 độ</Text>
  </TouchableOpacity>
);

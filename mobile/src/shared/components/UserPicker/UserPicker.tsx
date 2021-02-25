import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export interface UserPickerProps {
  style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  main: {
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  name: {
    marginLeft: 6,
  },
  title: {
    marginBottom: 6,
    color: '#444',
    fontSize: 12,
  },
});

export const UserPicker: React.FunctionComponent<UserPickerProps> = ({
  style,
}) => (
  <TouchableOpacity style={[styles.rowCenter, style]}>
    <View style={styles.main}>
      <Text style={styles.title}>Người thực hiện</Text>
      <View style={styles.rowCenter}>
        <Image
          style={styles.avatar}
          source={{
            uri: 'https://reactnative.dev/img/tiny_logo.png',
          }}
        />
        <Text style={styles.name}>Nguyễn Phương Dung</Text>
      </View>
    </View>
    <Icon name="ios-arrow-forward" size={20} color="#444" />
  </TouchableOpacity>
);

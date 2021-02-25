import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  order: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderIcon: {
    marginLeft: 6,
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterIcon: {
    marginRight: 6,
  },
});

export const FilterBar: React.FunctionComponent = () => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.order}>
      <Text>Sắp xếp: Ngày chuyển</Text>
      <Icon
        style={styles.orderIcon}
        name="ios-arrow-down"
        size={16}
        color="#666"
      />
    </TouchableOpacity>
    <TouchableOpacity style={styles.filter}>
      <Icon
        style={styles.filterIcon}
        name="ios-options"
        size={16}
        color="#666"
      />
      <Text>Lọc</Text>
    </TouchableOpacity>
  </View>
);

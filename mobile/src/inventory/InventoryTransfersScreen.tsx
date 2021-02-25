import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { InventoryTransferLine } from './components';
import { FilterBar } from '../shared/components/FilterBar';
import { InventoryNavigationProp } from '../navigation/Inventory';
import { Button } from '../shared/components/Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  list: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
});

const DATA = [
  {
    id: 12,
    name: 'WH/INT/00003',
    location: {
      id: 8,
      name: 'WH/Kho thường',
    },
    locationDest: {
      id: 8,
      name: 'WH/Kho trưng bày',
    },
    date: '2020-05-16 09:07:50',
    state: 'done',
    partner: {
      id: 8,
      name: 'Nguyễn Phương Dung',
    },
    note: 'Chuyển sang kho trưng bày',
  },
  {
    id: 13,
    name: 'WH/INT/00004',
    location: {
      id: 8,
      name: 'WH/Kho thường',
    },
    locationDest: {
      id: 8,
      name: 'WH/Kho trưng bày',
    },
    date: '2020-05-16 09:07:50',
    state: 'done',
    partner: {
      id: 8,
      name: 'Nguyễn Phương Dung',
    },
    note: 'Chuyển sang kho trưng bày',
  },
  {
    id: 14,
    name: 'WH/INT/00005',
    location: {
      id: 8,
      name: 'WH/Kho thường',
    },
    locationDest: {
      id: 8,
      name: 'WH/Kho trưng bày',
    },
    date: '2020-05-16 09:07:50',
    state: 'done',
    partner: {
      id: 8,
      name: 'Nguyễn Phương Dung',
    },
    note: 'Chuyển sang kho trưng bày',
  },
];

export const InventoryTransfersScreen: React.FunctionComponent = () => {
  const navigation = useNavigation<InventoryNavigationProp>();
  const onNewTransferPressed = () => {
    navigation.push('New Transfer');
  };
  return (
    <View style={styles.container}>
      <FilterBar />
      <FlatList
        style={styles.list}
        data={DATA}
        renderItem={({ item }) => <InventoryTransferLine line={item} />}
        keyExtractor={({ id }) => id.toString()}
      />
      <View style={styles.footer}>
        <Button block onPress={onNewTransferPressed}>
          Tạo chuyển kho
        </Button>
      </View>
    </View>
  );
};

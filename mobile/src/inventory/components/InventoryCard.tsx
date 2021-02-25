import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

export interface InventoryCardProps {
  style?: StyleProp<ViewStyle>;
  inventory: {
    id: number;
    name: string;
    totalItems: number;
    color: string;
  };
}

const styles = StyleSheet.create({
  container: {},
  body: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  footer: {
    backgroundColor: '#253640',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  inventoryName: {
    color: '#FFF',
  },
  circle: {
    backgroundColor: '#FFF',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 30,
  },
});

export const InventoryCard: React.FunctionComponent<InventoryCardProps> = ({
  inventory,
  style,
}: InventoryCardProps) => (
  <TouchableOpacity style={[styles.container, style]}>
    <View style={[styles.body, { backgroundColor: inventory.color }]}>
      <View style={styles.circle}>
        <Text style={styles.value}>{inventory.totalItems}</Text>
      </View>
    </View>
    <View style={styles.footer}>
      <Text style={styles.inventoryName}>{inventory.name}</Text>
    </View>
  </TouchableOpacity>
);

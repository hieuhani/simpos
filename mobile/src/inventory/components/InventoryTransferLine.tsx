import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export interface InventoryTransferLineProps {
  line: {
    id: number;
    name: string;
    location: {
      id: number;
      name: string;
    };
    locationDest: {
      id: number;
      name: string;
    };
    date: string;
    state: string;
    partner: {
      id: number;
      name: string;
    };
    note: string;
  };
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 20,
  },

  wrapper: {
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
    paddingBottom: 12,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
  transferLocation: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  location: {
    flexGrow: 1,
  },
  name: {
    color: '#9C1B50',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  iconWrapper: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  note: {
    color: '#838383',
  },
  partner: {
    color: '#253640',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    marginBottom: 8,
  },
  locationName: {
    color: '#FFF',
    fontWeight: '700',
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    marginRight: 6,
  },
});
export const InventoryTransferLine: React.FunctionComponent<InventoryTransferLineProps> = ({
  line,
}: InventoryTransferLineProps) => (
  <TouchableOpacity style={styles.container}>
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{line.name}</Text>
          <View style={styles.timeWrapper}>
            <Text style={styles.time}>20:22 22/04/2020</Text>
            <Icon name="ios-arrow-forward" size={20} color="#CCC" />
          </View>
        </View>
        <View style={styles.info}>
          <Text style={styles.partner}>{line.partner.name}</Text>
          <Text style={styles.note}>{line.note}</Text>
        </View>
        <View style={styles.transferLocation}>
          <View style={[styles.location]}>
            <Text
              style={[
                styles.locationName,
                {
                  color: '#3797FE',
                },
              ]}>
              {line.location.name}
            </Text>
          </View>
          <View style={styles.iconWrapper}>
            <Icon name="ios-arrow-round-forward" size={30} color="#CCC" />
          </View>
          <View style={[styles.location]}>
            <Text style={[styles.locationName, { color: '#40D192' }]}>
              {line.locationDest.name}
            </Text>
          </View>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

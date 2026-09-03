// App.js

import React, { useState } from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import MapComponent from './src/components/MapComponent';
import { useBatterySim } from './src/hooks/useBatterySim';
import { DELIVERY_DESTINATIONS } from './src/data/mockData';

export default function App() {
  const { battery, isDraining, pauseDrain, resumeDrain } = useBatterySim();
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [driverCoords, setDriverCoords] = useState(null);

  const activeOrder = DELIVERY_DESTINATIONS.find((o) => o.id === activeOrderId) || null;

  const [fontsLoaded] = useFonts({
  ...Ionicons.font,
  ...MaterialCommunityIcons.font,
  });

  if (!fontsLoaded) {
    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading…</Text>
    </View>
   );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>VoltRoute</Text>
        <Text style={styles.battery}>🔋 {battery}%</Text>
      </View>

      <MapComponent
        activeOrder={activeOrder}
        batteryPercentage={battery}
        onDriverLocation={setDriverCoords}
      />

      <View style={styles.controls}>
        {DELIVERY_DESTINATIONS.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={[
              styles.orderBtn,
              activeOrderId === order.id && styles.orderBtnActive,
            ]}
            onPress={() => setActiveOrderId(order.id)}
          >
            <Text
              style={[
                styles.orderBtnText,
                activeOrderId === order.id && styles.orderBtnTextActive,
              ]}
            >
              {order.label} · {order.distanceKm}km · ₹{order.payout}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.drainBtn}
          onPress={isDraining ? pauseDrain : resumeDrain}
        >
          <Text style={styles.drainBtnText}>
            {isDraining ? '⏸ Pause Drain' : '▶ Resume Drain'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: { color: '#2E7D32', fontSize: 22, fontWeight: 'bold' },
  battery: { color: '#212121', fontSize: 16 },
  controls: {
    padding: 12,
    backgroundColor: '#F5F5F5',
    gap: 8,
  },
  orderBtn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  orderBtnActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  orderBtnText: { color: '#555555', fontSize: 13 },
  orderBtnTextActive: { color: '#2E7D32', fontWeight: '600' },
  drainBtn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#212121',
    alignItems: 'center',
  },
  drainBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
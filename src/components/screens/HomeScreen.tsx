import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import KPIStrip from '../components/KPIStrip';
import MapComponent from '../MapComponent';
import OrderCard from '../components/OrderCard';
import BottomNav from '../components/BottomNav';
import { toQueueOrder } from '../adaptOrders';
import { ORDERS } from '../../data/orders';
import { COLORS } from '../data';
import type { NavTab } from '../types';

interface HomeScreenProps {
  activeTab: NavTab;
  onTabPress: (tab: NavTab) => void;
  activeDestination: typeof ORDERS[number] | null;
  batteryPercentage: number;
  drainNow: () => void;
  driverLocation: { latitude: number; longitude: number } | null;
  onDriverLocation: (loc: { latitude: number; longitude: number }) => void;
  acceptedIds: Set<string>;
}

export default function HomeScreen({
  activeTab,
  onTabPress,
  activeDestination,
  batteryPercentage,
  drainNow,
  onDriverLocation,
  acceptedIds,
}: HomeScreenProps) {
  const queueOrders = ORDERS.map((order) =>
    toQueueOrder(order, acceptedIds.has(order.id) ? 'Assigned' : 'Pending')
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.content}>
        <Header notificationCount={5} />
        <KPIStrip />

        <View style={styles.mapWrapper}>
          <MapComponent
            activeOrder={activeDestination}
            batteryPercentage={batteryPercentage}
            onDriverLocation={onDriverLocation}
          />
        </View>

        {activeDestination && (
          <View style={styles.demoControls}>
            <View style={styles.demoCopy}>
              <Text style={styles.demoTitle}>Live battery demo</Text>
              <Text style={styles.demoSubtitle}>{batteryPercentage}% charge · route updates instantly</Text>
            </View>
            <Pressable style={styles.drainButton} onPress={drainNow}>
              <Text style={styles.drainButtonText}>Drain 4%</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.queueHeader}>
          <Text style={styles.queueTitle}>Order Queue</Text>
          <Text style={styles.queueCount}>{queueOrders.length} orders</Text>
        </View>

        <ScrollView
          style={styles.orderScroll}
          contentContainerStyle={styles.orderList}
          showsVerticalScrollIndicator={false}
        >
          {queueOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ScrollView>
      </View>

      <BottomNav activeTab={activeTab} onTabPress={onTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  content: { flex: 1 },
  mapWrapper: {
    marginHorizontal: 16, marginTop: 14, height: 260, borderRadius: 24,
    overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 14, elevation: 4,
  },
  demoControls: {
    marginHorizontal: 16, marginTop: 10, paddingHorizontal: 14, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF8E8', borderRadius: 14, borderWidth: 1, borderColor: '#FDE7A9',
  },
  demoCopy: { flex: 1, gap: 2 },
  demoTitle: { fontSize: 12, fontWeight: '800', color: COLORS.textDark },
  demoSubtitle: { fontSize: 10, fontWeight: '500', color: COLORS.textMuted },
  drainButton: { backgroundColor: COLORS.red, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  drainButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  queueHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10,
  },
  queueTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textDark, letterSpacing: -0.3 },
  queueCount: { fontSize: 12, fontWeight: '500', color: COLORS.textMuted },
  orderScroll: { flex: 1 },
  orderList: { paddingHorizontal: 16, paddingBottom: 16, gap: 10 },
});
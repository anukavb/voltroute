import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import KPIStrip from '../components/KPIStrip';
import BatterySummary from '../components/BatterySummary';
import OrderCard from '../components/OrderCard';
import BottomNav from '../components/BottomNav';
import { toQueueOrder } from '../adaptOrders';
import { ORDERS } from '../../data/orders';
import { COLORS } from '../data';
import { useTheme } from '../../theme/ThemeContext';
import type { NavTab } from '../types';

interface HomeScreenProps {
  activeTab: NavTab;
  onTabPress: (tab: NavTab) => void;
  batteryPercentage: number;
  driverLocation: { latitude: number; longitude: number } | null;
  acceptedIds: Set<string>;
}

export default function HomeScreen({
  activeTab,
  onTabPress,
  batteryPercentage,
  driverLocation,
  acceptedIds,
}: HomeScreenProps) {
  const { theme } = useTheme();
  const queueOrders = ORDERS.map((order) =>
    toQueueOrder(order, acceptedIds.has(order.id) ? 'Assigned' : 'Pending')
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.content}>
        <Header />
        <KPIStrip />
        <BatterySummary level={batteryPercentage} driverLocation={driverLocation} />

        <View style={styles.queueHeader}>
          <Text style={[styles.queueTitle, { color: theme.textPrimary }]}>Order Queue</Text>
          <Text style={[styles.queueCount, { color: theme.textSecondary }]}>{queueOrders.length} orders</Text>
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
  queueHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10,
  },
  queueTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textDark, letterSpacing: -0.3 },
  queueCount: { fontSize: 12, fontWeight: '500', color: COLORS.textMuted },
  orderScroll: { flex: 1 },
  orderList: { paddingHorizontal: 16, paddingBottom: 16, gap: 10 },
});
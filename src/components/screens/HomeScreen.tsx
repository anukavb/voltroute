import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Header from '../components/Header';
import KPIStrip from '../components/KPIStrip';
import LiveMap from '../components/LiveMap';
import OrderCard from '../components/OrderCard';
import BottomNav from '../components/BottomNav';
import { COLORS, orders } from '../data';
import type { NavTab } from '../types';

interface HomeScreenProps {
  activeTab: NavTab;
  onTabPress: (tab: NavTab) => void;
}

export default function HomeScreen({ activeTab, onTabPress }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.content}>

        {/* Header */}
        <Header notificationCount={5} />

        {/* KPI strip */}
        <KPIStrip />

        {/* Live map */}
        <View style={styles.mapWrapper}>
          <LiveMap />
        </View>

        {/* Order queue */}
        <View style={styles.queueHeader}>
          <Text style={styles.queueTitle}>Order Queue</Text>
          <Text style={styles.queueCount}>{orders.length} orders</Text>
        </View>

        <ScrollView
          style={styles.orderScroll}
          contentContainerStyle={styles.orderList}
          showsVerticalScrollIndicator={false}
        >
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ScrollView>

      </View>

      {/* Bottom nav sits outside scroll */}
      <BottomNav activeTab={activeTab} onTabPress={onTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
  },
  mapWrapper: {
    marginHorizontal: 16,
    marginTop: 14,
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  queueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  queueTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  queueCount: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  orderScroll: {
    flex: 1,
  },
  orderList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
});

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Pressable, ScrollView, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView as SafeAreaContextView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import MapComponent from '../MapComponent';
import { evaluateOrderSafety } from '../../logic/smartAccept';
import {
  COLORS, RANGE_PER_PERCENT, availableOrders,
} from '../data';
import { ORDERS } from '../../data/orders';
import type { AvailableOrder, NavTab } from '../types';
import { useTheme } from '../../theme/ThemeContext';

interface AvailableOrderCardProps {
  order: AvailableOrder;
  batteryPercentage: number;
  onAccept: (id: string) => void;
  onPreviewSwapRoute: (id: string) => void;
  onReject: (id: string) => void;
}

function AvailableOrderCard({ order, batteryPercentage, onAccept, onPreviewSwapRoute, onReject }: AvailableOrderCardProps) {
  const { theme } = useTheme();
  const totalKm = order.pickupKm + order.deliveryKm;
  const safety = evaluateOrderSafety(totalKm, batteryPercentage);
  const isSufficient = !safety.swapRequired;
  const availableRange = batteryPercentage * RANGE_PER_PERCENT;

  return (
       <View style={[styles.orderCard, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
      <View style={styles.orderTopRow}>
        <Text style={[styles.orderIdText, { color: theme.textSecondary }]}>{order.id}</Text>
        <Text style={[styles.orderPayout, { color: theme.accentPositive }]}>{order.payout}</Text>
      </View>

      <View style={styles.routeRow}>
        <View style={styles.routeConnector}>
          <View style={[styles.routeDot, { borderColor: theme.accentSecondary }]} />
          <View style={styles.routeDash} />
          <View style={styles.routeDash} />
          <View style={styles.routeDash} />
          <View style={[styles.routeDot, { borderColor: theme.accentWarning, backgroundColor: theme.accentWarning }]} />
        </View>
        <View style={styles.routeAddresses}>
          <Text style={[styles.routeAddr, { color: theme.textPrimary }]} numberOfLines={1}>{order.pickupAddr}</Text>
          <Text style={[styles.routeAddr, { color: theme.textPrimary }]} numberOfLines={1}>{order.dropAddr}</Text>
        </View>
      </View>

      <Text style={[styles.distanceText, { color: theme.textSecondary }]}>
        {order.pickupKm} km pickup {'→'} {order.deliveryKm} km delivery
        {'  '}
           <Text style={[styles.totalText, { color: theme.textSecondary }]}>({totalKm.toFixed(1)} km total)</Text>
      </Text>

      <View style={[styles.smartBadge, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
        <Text style={styles.smartIcon}>{isSufficient ? '✓' : '⚠'}</Text>
        <Text style={[styles.smartText, { color: isSufficient ? theme.accentPositive : theme.accentWarning }]}>
          {isSufficient ? 'SAFE ROUTE — Accept' : 'INSUFFICIENT BATTERY'}
        </Text>
        {!isSufficient && (
          <Text style={styles.shortfallText}>{(totalKm - availableRange).toFixed(1)} km short</Text>
        )}
      </View>

      <View style={styles.actionRow}>
        <View style={styles.acceptWrapper}>
          <Pressable
            onPress={() => isSufficient && onAccept(order.id)}
            disabled={!isSufficient}
                style={[styles.acceptBtn, { backgroundColor: isSufficient ? theme.accentPositive : theme.card, borderColor: theme.border, borderWidth: 1 }]}
          >
            <Text style={[styles.acceptBtnText, !isSufficient && styles.acceptBtnTextDisabled]}>Accept</Text>
          </Pressable>
          {!isSufficient && (
            <>
              <Text style={styles.tooLowText}>Battery too low to complete this delivery safely.</Text>
              <Pressable style={styles.swapLink} onPress={() => onPreviewSwapRoute(order.id)}>
                <Ionicons name="swap-horizontal-outline" size={11} color={theme.accentSecondary} />
                <Text style={styles.swapLinkText}>View swap-station detour</Text>
              </Pressable>
            </>
          )}
        </View>
        <Pressable style={[styles.rejectBtn, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => onReject(order.id)}>
          <Text style={[styles.rejectBtnText, { color: theme.textSecondary }]}>Reject</Text>
        </Pressable>
      </View>
    </View>
  );
}

interface DriverProfileScreenProps {
  onBack: () => void;
  activeTab: NavTab;
  onTabPress: (tab: NavTab) => void;
  batteryPercentage: number;
  activeOrder: typeof ORDERS[number] | null;
  drainNow: () => void;
  driverLocation: { latitude: number; longitude: number } | null;
  onDriverLocation: (loc: { latitude: number; longitude: number }) => void;
  acceptedIds: Set<string>;
  onAccept: (id: string) => void;
  onPreviewSwapRoute: (id: string) => void;
  onConfirmHome: () => void;
}

export default function DriverProfileScreen({
  onBack, activeTab, onTabPress, batteryPercentage, activeOrder, drainNow, driverLocation, onDriverLocation, onAccept, onPreviewSwapRoute, onConfirmHome,
}: DriverProfileScreenProps) {
  const { theme } = useTheme();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [accepted, setAccepted] = useState<Set<string>>(new Set());
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!activeOrder) return;
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: 0, animated: true }));
  }, [activeOrder?.id]);

  const activeOrders = availableOrders.filter(
    (o) => !dismissed.has(o.id) && !accepted.has(o.id)
  );

  function handleAccept(id: string) {
    setAccepted((prev) => new Set(prev).add(id));
    onAccept(id);
  }
  function handleReject(id: string) {
    setDismissed((prev) => new Set(prev).add(id));
  }

  const availableRange = batteryPercentage * RANGE_PER_PERCENT;
  const activeOrderSafety = activeOrder
    ? evaluateOrderSafety(activeOrder.distanceKm, batteryPercentage)
    : null;

  return (
    <SafeAreaContextView style={[styles.root, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Pressable style={[styles.backBtn, { backgroundColor: theme.card }]} onPress={onBack}>
          <Ionicons name="chevron-back" size={20} color={theme.textPrimary} />
        </Pressable>
        <View style={styles.driverInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AM</Text>
          </View>
          <View>
            <View style={styles.nameRow}>
              <Text style={[styles.driverName, { color: theme.textPrimary }]}>Amir Mehta</Text>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
            <Text style={[styles.driverId, { color: theme.textSecondary }]}>Driver ID: DRV-2847</Text>
          </View>
        </View>
      </View>

      <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mapWrapper}>
          <MapComponent
            activeOrder={activeOrder}
            batteryPercentage={batteryPercentage}
            onDriverLocation={onDriverLocation}
          />
        </View>

        <Pressable style={[styles.simulationButton, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={drainNow}>
          <Text style={[styles.simulationText, { color: theme.textPrimary }]}>Simulate Drain (-4%)</Text>
        </Pressable>

        <View style={styles.statsRow}>
          {[
            { label: 'Deliveries Today', value: '7', icon: '📦' },
            { label: 'Earnings Today', value: '₹1,240', icon: '💰' },
            { label: 'Distance Covered', value: '38.2 km', icon: '🛣️' },
          ].map((s) => (
            <View key={s.label} style={styles.statChip}>
              <Text style={{ fontSize: 16 }}>{s.icon}</Text>
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.ordersHeader}>
          <Text style={[styles.ordersTitle, { color: theme.textPrimary }]}>Available Orders for You</Text>
          <Text style={[styles.rangeText, { color: theme.textSecondary }]}>Range: {availableRange.toFixed(0)} km</Text>
        </View>

        {accepted.size > 0 && (
          <View style={[styles.acceptedBanner, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
            <Text style={[styles.acceptedBannerText, { color: theme.accentPositive }]}>
              ✓ {accepted.size} order{accepted.size > 1 ? 's' : ''} accepted — dispatching now
            </Text>
          </View>
        )}

        {activeOrder && activeOrderSafety && (
          <View style={[styles.confirmationCard, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
            <View style={styles.confirmationHeader}>
              <View>
                <Text style={styles.confirmationEyebrow}>FINAL CONFIRMATION</Text>
                <Text style={[styles.confirmationTitle, { color: theme.textPrimary }]}>{activeOrder.id} selected</Text>
              </View>
              <Text style={[styles.confirmationBattery, { color: theme.textPrimary }]}>{batteryPercentage}%</Text>
            </View>
            <Text style={[styles.confirmationText, { color: theme.textSecondary }]}>
              {activeOrderSafety.swapRequired
                ? `Battery is low. Home will route you through the nearest BaaS kiosk before ${activeOrder.homeLabel}.`
                : `Battery is sufficient for a direct route to ${activeOrder.homeLabel}.`}
            </Text>
            <Pressable style={styles.confirmationButton} onPress={onConfirmHome}>
              <Text style={styles.confirmationButtonText}>Continue to Home Route</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        )}

        {activeOrders.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
            <Text style={{ fontSize: 32 }}>📭</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No orders available right now</Text>
          </View>
        ) : (
          <View style={styles.orderList}>
            {activeOrders.map((order) => (
              <AvailableOrderCard
                key={order.id}
                order={order}
                batteryPercentage={batteryPercentage}
                onAccept={handleAccept}
                onPreviewSwapRoute={onPreviewSwapRoute}
                onReject={handleReject}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <BottomNav activeTab={activeTab} onTabPress={onTabPress} />
    </SafeAreaContextView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14, backgroundColor: COLORS.bg },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.cardBg, alignItems: 'center', justifyContent: 'center' },
  driverInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  driverName: { fontSize: 17, fontWeight: '700', color: COLORS.textDark, letterSpacing: -0.2 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: COLORS.green },
  onlineText: { fontSize: 11, fontWeight: '600', color: '#00A854' },
  driverId: { fontSize: 11, fontWeight: '500', color: COLORS.textMuted, marginTop: 1 },
  scroll: { flex: 1 },
  mapWrapper: { height: 280, marginHorizontal: 16, borderRadius: 22, overflow: 'hidden' },
  scrollContent: { paddingBottom: 16, gap: 14 },
  simulationButton: { marginHorizontal: 16, borderRadius: 14, borderWidth: 1, paddingVertical: 12, alignItems: 'center' },
  simulationText: { fontSize: 12, fontWeight: '800' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10 },
  statChip: { flex: 1, backgroundColor: COLORS.cardBg, borderRadius: 18, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center', gap: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  statValue: { fontSize: 14, fontWeight: '800', color: COLORS.textDark, textAlign: 'center', lineHeight: 18 },
  statLabel: { fontSize: 9, fontWeight: '500', color: COLORS.textMuted, textAlign: 'center', lineHeight: 12 },
  ordersHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  ordersTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textDark, letterSpacing: -0.3 },
  rangeText: { fontFamily: 'monospace', fontSize: 10, color: COLORS.textMuted, fontWeight: '500' },
  acceptedBanner: { marginHorizontal: 16, backgroundColor: '#E8FFF3', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 },
  acceptedBannerText: { fontSize: 12, fontWeight: '600', color: '#00A854' },
  confirmationCard: { marginHorizontal: 16, backgroundColor: '#102A2A', borderRadius: 20, padding: 16, gap: 12 },
  confirmationHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  confirmationEyebrow: { fontSize: 10, fontWeight: '800', color: '#8BE0B0', letterSpacing: 1 },
  confirmationTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', marginTop: 3 },
  confirmationBattery: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  confirmationText: { fontSize: 12, lineHeight: 18, fontWeight: '500', color: '#D6E7E3' },
  confirmationButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.green, borderRadius: 12, paddingVertical: 12 },
  confirmationButtonText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  emptyState: { alignItems: 'center', padding: 32, backgroundColor: COLORS.cardBg, borderRadius: 20, marginHorizontal: 16, gap: 8 },
  emptyText: { fontSize: 15, fontWeight: '600', color: COLORS.textMuted },
  orderList: { paddingHorizontal: 16, gap: 12 },
  orderCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 },
  orderTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderIdText: { fontFamily: 'monospace', fontSize: 10, color: COLORS.textMuted, fontWeight: '500', letterSpacing: 0.5 },
  orderPayout: { fontSize: 20, fontWeight: '800', color: COLORS.greenDark, letterSpacing: -0.3 },
  routeRow: { flexDirection: 'row', alignItems: 'stretch', gap: 10 },
  routeConnector: { alignItems: 'center', paddingTop: 2, paddingBottom: 2, gap: 2, width: 10 },
  routeDot: { width: 8, height: 8, borderRadius: 4, borderWidth: 2, backgroundColor: 'transparent' },
  routeDash: { width: 1.5, height: 4, backgroundColor: '#CBD5E1', borderRadius: 1 },
  routeAddresses: { flex: 1, gap: 8 },
  routeAddr: { fontSize: 12, fontWeight: '500', color: COLORS.textMid, lineHeight: 16 },
  distanceText: { fontSize: 11, fontWeight: '500', color: '#6B7280' },
  totalText: { color: COLORS.textMuted, fontWeight: '400' },
  smartBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  smartIcon: { fontSize: 13 },
  smartText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3, textTransform: 'uppercase', flex: 1 },
  shortfallText: { fontSize: 10, color: COLORS.textMuted, fontWeight: '500' },
  actionRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  acceptWrapper: { flex: 1, gap: 6 },
  acceptBtn: { paddingVertical: 12, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  acceptBtnEnabled: { backgroundColor: COLORS.green },
  acceptBtnDisabled: { backgroundColor: '#F0F1F5', opacity: 0.75 },
  acceptBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  acceptBtnTextDisabled: { color: '#B0B7C3' },
  tooLowText: { fontSize: 10, fontWeight: '500', color: COLORS.red, textAlign: 'center', lineHeight: 14 },
  swapLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 2 },
  swapLinkText: { fontSize: 10, fontWeight: '600', color: COLORS.blue },
  rejectBtn: { flex: 1, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  rejectBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.textMid },
});
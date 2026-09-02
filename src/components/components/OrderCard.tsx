import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Order, OrderStatus } from '../types';
import { COLORS } from '../data';

const STATUS_CONFIG: Record<OrderStatus, { bg: string; text: string }> = {
  Pending:    { bg: '#F0F1F5', text: COLORS.textMuted },
  Assigned:   { bg: '#EEF4FF', text: COLORS.blue },
  'Picked Up':{ bg: '#E8FFF3', text: '#00A854' },
};

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const pill = STATUS_CONFIG[order.status];

  return (
    <View style={styles.card}>
      {/* Top row: ID + status pill */}
      <View style={styles.topRow}>
        <Text style={styles.orderId}>{order.id}</Text>
        <View style={[styles.pill, { backgroundColor: pill.bg }]}>
          <Text style={[styles.pillText, { color: pill.text }]}>{order.status}</Text>
        </View>
      </View>

      {/* Route connector */}
      <View style={styles.routeRow}>
        <View style={styles.connector}>
          <View style={[styles.connectorDot, { borderColor: COLORS.blue }]} />
          <View style={styles.connectorLine} />
          <View style={styles.connectorLine} />
          <View style={styles.connectorLine} />
          <View style={[styles.connectorDot, { backgroundColor: COLORS.red, borderColor: COLORS.red }]} />
        </View>
        <View style={styles.addresses}>
          <Text style={styles.addressText} numberOfLines={1}>{order.pickup}</Text>
          <Text style={styles.addressText} numberOfLines={1}>{order.drop}</Text>
        </View>
      </View>

      {/* Bottom row: distance + payout */}
      <View style={styles.bottomRow}>
        <Text style={styles.distance}>{order.distance}</Text>
        <Text style={styles.payout}>{order.payout}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderId: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  pill: {
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  connector: {
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 2,
    gap: 2,
    width: 10,
  },
  connectorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  connectorLine: {
    width: 1.5,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 1,
  },
  addresses: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 6,
  },
  addressText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMid,
    lineHeight: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F1F5',
    paddingTop: 8,
    marginTop: 2,
  },
  distance: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  payout: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
});

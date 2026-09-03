import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

interface BatterySummaryProps {
  level: number;
  driverLocation: { latitude: number; longitude: number } | null;
}

export default function BatterySummary({ level, driverLocation }: BatterySummaryProps) {
  const { theme } = useTheme();
  const color = level > 50 ? theme.accentPositive : level > 20 ? theme.accentCaution : theme.accentWarning;
  const isCritical = level <= 20;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isCritical) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 0.25, duration: 500, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [isCritical, pulse]);

  const stateLabel = level > 50 ? 'GOOD RANGE' : level > 20 ? 'MODERATE - CHARGE SOON' : 'CRITICAL - CHARGE NOW';

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.ringSection}>
        <Animated.View style={[styles.ringOuter, { borderColor: color, opacity: isCritical ? pulse : 1 }]}>
          <Text style={[styles.ringPct, { color: theme.textPrimary }]}>{level}%</Text>
          <Text style={[styles.ringLabel, { color: theme.textSecondary }]}>Battery</Text>
        </Animated.View>
        <View style={[styles.stateBadge, { backgroundColor: theme.background }]}>
          <View style={[styles.stateDot, { backgroundColor: color }]} />
          <Text style={[styles.stateText, { color }]}>{stateLabel}</Text>
        </View>
      </View>

      <View style={[styles.vehicleRow, { borderTopColor: theme.border }]}>
        <View style={styles.vehicleStat}>
          <Ionicons name="car-outline" size={16} color={theme.accentSecondary} />
          <Text style={[styles.label, { color: theme.textSecondary }]}>Vehicle</Text>
          <Text style={[styles.value, { color: theme.textPrimary }]}>2-Wheeler EV</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={styles.vehicleStat}>
          <Ionicons name="location-outline" size={16} color={theme.accentSecondary} />
          <Text style={[styles.label, { color: theme.textSecondary }]}>Location</Text>
          <Text style={[styles.value, { color: theme.textPrimary }]}>
            {driverLocation ? `${driverLocation.latitude.toFixed(4)}, ${driverLocation.longitude.toFixed(4)}` : 'Locating...'}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={styles.vehicleStat}>
          <Ionicons name="time-outline" size={16} color={theme.accentSecondary} />
          <Text style={[styles.label, { color: theme.textSecondary }]}>Updated</Text>
          <Text style={[styles.value, { color: theme.textPrimary }]}>just now</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        {[
          ['7', 'Deliveries Today'],
          ['₹1,240', 'Earnings Today'],
          ['38.2 km', 'Distance Covered'],
        ].map(([value, label]) => (
          <View key={label} style={[styles.statChip, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, borderRadius: 22, borderWidth: 1, padding: 16, gap: 16 },
  ringSection: { alignItems: 'center', gap: 12 },
  ringOuter: { width: 156, height: 156, borderRadius: 78, borderWidth: 12, alignItems: 'center', justifyContent: 'center' },
  ringPct: { fontSize: 34, fontWeight: '800', lineHeight: 38 },
  ringLabel: { fontSize: 11, marginTop: 2 },
  stateBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5 },
  stateDot: { width: 6, height: 6, borderRadius: 3 },
  stateText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', width: '100%', borderTopWidth: 1, paddingTop: 14 },
  vehicleStat: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontSize: 10 },
  value: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  divider: { width: 1, height: 38 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statChip: { flex: 1, borderRadius: 14, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 4, alignItems: 'center', gap: 3 },
  statValue: { fontSize: 14, fontWeight: '800' },
  statLabel: { fontSize: 9, textAlign: 'center' },
});

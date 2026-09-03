import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLORS, vehicles, VEHICLE_STATUS_COLOR } from '../data';

// District blocks painted as absolute Views
const DISTRICTS = [
  { x: 10, y: 10, w: 28, h: 18, color: '#F0F4FF' },
  { x: 42, y: 10, w: 20, h: 14, color: '#FFF8E8' },
  { x: 65, y: 8,  w: 25, h: 16, color: '#F0FFF4' },
  { x: 8,  y: 32, w: 22, h: 20, color: '#FFF0F2' },
  { x: 38, y: 28, w: 18, h: 16, color: '#F0F4FF' },
  { x: 60, y: 26, w: 28, h: 22, color: '#FFF8E8' },
  { x: 10, y: 55, w: 30, h: 20, color: '#F0FFF4' },
  { x: 48, y: 50, w: 22, h: 26, color: '#F0F4FF' },
  { x: 72, y: 52, w: 22, h: 24, color: '#FFF0F2' },
];

// Horizontal/vertical road segments [x, y, isHorizontal, length]
const ROADS: [number, number, boolean, number][] = [
  [5,  20, true,  90],
  [5,  45, true,  90],
  [5,  70, true,  90],
  [25, 5,  false, 90],
  [55, 5,  false, 90],
  [80, 5,  false, 90],
];

const LEGEND = [
  { label: 'Idle',        color: COLORS.green },
  { label: 'En Route',    color: COLORS.blue },
  { label: 'Low Battery', color: COLORS.amber },
  { label: 'Offline',     color: COLORS.red },
];

function PulseDot({ color }: { color: string }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.8, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,   duration: 900, useNativeDriver: true }),
      ])
    ).start();
    return () => pulse.stopAnimation();
  }, [pulse]);

  return (
    <View style={styles.pinWrapper}>
      <Animated.View
        style={[
          styles.pinRing,
          { backgroundColor: color, opacity: 0.2, transform: [{ scale: pulse }] },
        ]}
      />
      <View style={[styles.pinCore, { backgroundColor: color }]}>
        <View style={styles.pinInner} />
      </View>
    </View>
  );
}

export default function LiveMap() {
  return (
    <View style={styles.container}>
      {/* Base map background */}
      <View style={styles.mapBg} />

      {/* District fills */}
      {DISTRICTS.map((d, i) => (
        <View
          key={i}
          style={[
            styles.district,
            {
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: `${d.w}%`,
              height: `${d.h}%`,
              backgroundColor: d.color,
            },
          ]}
        />
      ))}

      {/* Roads */}
      {ROADS.map(([x, y, horiz, len], i) => (
        <View
          key={i}
          style={[
            styles.road,
            horiz
              ? { left: `${x}%`, top: `${y}%`, width: `${len}%`, height: 1.5 }
              : { left: `${x}%`, top: `${y}%`, width: 1.5, height: `${len}%` },
          ]}
        />
      ))}

      {/* Vehicle pins */}
      {vehicles.map((v) => (
        <View
          key={v.id}
          style={[styles.pinAnchor, { left: `${v.x}%`, top: `${v.y}%` }]}
        >
          <PulseDot color={VEHICLE_STATUS_COLOR[v.status]} />
        </View>
      ))}

      {/* LIVE badge */}
      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {LEGEND.map(({ label, color }) => (
          <View key={label} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 24,
  },
  mapBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F8F9FC',
  },
  district: {
    position: 'absolute',
    borderRadius: 3,
  },
  road: {
    position: 'absolute',
    backgroundColor: '#E2E5EF',
  },
  pinAnchor: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinWrapper: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinRing: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  pinCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  liveBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.green,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textDark,
    letterSpacing: 0.5,
  },
  legend: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 110,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
});

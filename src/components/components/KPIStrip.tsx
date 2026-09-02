import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { COLORS, kpis } from '../data';

export default function KPIStrip() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}
    >
      {kpis.map((kpi) => (
        <View key={kpi.label} style={styles.card}>
          <Text style={styles.value}>{kpi.value}</Text>
          <Text style={styles.label}>{kpi.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 10,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 92,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.greenDark,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.textMuted,
    marginTop: 3,
  },
});

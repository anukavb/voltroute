import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { kpis } from '../data';
import { useTheme } from '../../theme/ThemeContext';

export default function KPIStrip() {
  const { theme } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}
    >
      {kpis.map((kpi) => (
        <View key={kpi.label} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.value, { color: theme.accentPositive }]}>{kpi.value}</Text>
          <Text style={[styles.label, { color: theme.textSecondary }]}>{kpi.label}</Text>
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
    borderWidth: 1,
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
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 3,
  },
});

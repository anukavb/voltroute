import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NavTab } from '../types';
import { useTheme } from '../../theme/ThemeContext';

interface NavItem {
  id: NavTab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',      label: 'Home',      icon: 'home-outline',        iconActive: 'home' },
  { id: 'fleet',     label: 'Fleet',     icon: 'car-outline',         iconActive: 'car' },
  { id: 'history',   label: 'History',   icon: 'time-outline',        iconActive: 'time' },
  { id: 'analytics', label: 'Analytics', icon: 'bar-chart-outline',   iconActive: 'bar-chart' },
];

interface BottomNavProps {
  activeTab: NavTab;
  onTabPress: (tab: NavTab) => void;
}

export default function BottomNav({ activeTab, onTabPress }: BottomNavProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <Pressable
            key={item.id}
            style={styles.tab}
            onPress={() => onTabPress(item.id)}
          >
            <Ionicons
              name={isActive ? item.iconActive : item.icon}
              size={22}
              color={isActive ? theme.accentPositive : theme.textSecondary}
            />
            <Text style={[styles.label, { color: theme.textSecondary }, isActive && { color: theme.accentPositive }]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 28,
    paddingHorizontal: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
  },
  labelActive: {
  },
});

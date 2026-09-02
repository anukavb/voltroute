import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../data';

interface HeaderProps {
  notificationCount?: number;
}

export default function Header({ notificationCount = 5 }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.wordmark}>
        <Text style={styles.wordmarkBold}>Live</Text>
        <Text style={styles.wordmarkLight}> Ops</Text>
      </View>
      <Pressable style={styles.bellWrapper}>
        <Ionicons name="notifications-outline" size={22} color={COLORS.textMuted} />
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notificationCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: COLORS.bg,
  },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  wordmarkBold: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  wordmarkLight: {
    fontSize: 22,
    fontWeight: '400',
    color: COLORS.textMuted,
    letterSpacing: -0.5,
  },
  bellWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 11,
  },
});

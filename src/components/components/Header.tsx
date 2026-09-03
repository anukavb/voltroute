import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

export default function Header() {
  const { theme, isDark, toggleTheme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.wordmark}>
        <Text style={[styles.wordmarkBold, { color: theme.textPrimary }]}>VoltRoute</Text>
      </View>
      <Pressable style={styles.bellWrapper} onPress={toggleTheme} accessibilityLabel="Toggle theme">
        <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={22} color={theme.textPrimary} />
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
  },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  wordmarkBold: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  wordmarkLight: {
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: -0.5,
  },
  bellWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

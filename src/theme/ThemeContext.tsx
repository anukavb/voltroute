import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LIGHT_THEME = {
  background: '#FFFFFF', card: '#F5F6FA', textPrimary: '#1A1A1F', textSecondary: '#6B6B75',
  accentPositive: '#00E676', accentWarning: '#FF3D57', accentCaution: '#FFB300', accentSecondary: '#2979FF', border: '#E4E4EA',
};
export const DARK_THEME = {
  background: '#121214', card: '#1E1E24', textPrimary: '#FFFFFF', textSecondary: '#A0A0AA',
  accentPositive: '#00FF87', accentWarning: '#FF3B30', accentCaution: '#FFB300', accentSecondary: '#2979FF', border: '#2A2A32',
};

export type ThemeTokens = typeof LIGHT_THEME;
interface ThemeContextValue { theme: ThemeTokens; isDark: boolean; toggleTheme: () => void; }
const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'voltroute-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => { AsyncStorage.getItem(STORAGE_KEY).then((value) => setIsDark(value === 'dark')); }, []);
  const toggleTheme = () => setIsDark((current) => { const next = !current; AsyncStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light'); return next; });
  const value = useMemo(() => ({ theme: isDark ? DARK_THEME : LIGHT_THEME, isDark, toggleTheme }), [isDark]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}

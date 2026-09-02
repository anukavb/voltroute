/**
 * Live Ops — Expo Root Entry
 *
 * Run with:
 *   npx expo start
 *
 * Required packages (beyond a fresh Expo install):
 *   npx expo install @expo/vector-icons
 *   (included in every Expo SDK by default)
 */

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './components/screens/HomeScreen';
import DriverProfileScreen from './components/screens/DriverProfileScreen';
import type { AppScreen, NavTab } from './components/types';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  function handleTabPress(tab: NavTab) {
    if (tab === 'fleet') {
      setScreen('driver-profile');
      setActiveTab('fleet');
    } else {
      setActiveTab(tab);
      if (screen !== 'home') setScreen('home');
    }
  }

  function handleBack() {
    setScreen('home');
    setActiveTab('home');
  }

  return (
    <>
      <StatusBar style="dark" />
      {screen === 'home' ? (
        <HomeScreen activeTab={activeTab} onTabPress={handleTabPress} />
      ) : (
        <DriverProfileScreen
          onBack={handleBack}
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
      )}
    </>
  );
}

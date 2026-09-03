import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './components/screens/HomeScreen';
import DriverProfileScreen from './components/screens/DriverProfileScreen';
import { useBatterySim } from './hooks/useBatterySim';
import { ORDERS } from './data/orders';
import type { AppScreen, NavTab } from './components/types';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set());
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const { battery, drainNow } = useBatterySim();
  const activeDestination = ORDERS.find((o) => o.id === activeOrderId) || null;

  function handleAcceptOrder(id: string) {
    setAcceptedIds((prev) => new Set(prev).add(id));
    setActiveOrderId(id);
  }

  function handlePreviewSwapRoute(id: string) {
    setActiveOrderId(id);
  }

  function handleConfirmHome() {
    setScreen('home');
    setActiveTab('home');
  }

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
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {screen === 'home' ? (
        <HomeScreen
          activeTab={activeTab}
          onTabPress={handleTabPress}
          activeDestination={activeDestination}
          batteryPercentage={battery}
          drainNow={drainNow}
          driverLocation={driverLocation}
          onDriverLocation={setDriverLocation}
          acceptedIds={acceptedIds}
        />
      ) : (
        <DriverProfileScreen
          onBack={handleBack}
          activeTab={activeTab}
          onTabPress={handleTabPress}
          batteryPercentage={battery}
          activeOrder={activeDestination}
          drainNow={drainNow}
          driverLocation={driverLocation}
          acceptedIds={acceptedIds}
          onAccept={handleAcceptOrder}
          onPreviewSwapRoute={handlePreviewSwapRoute}
          onConfirmHome={handleConfirmHome}
        />
      )}
    </SafeAreaProvider>
  );
}
// src/components/MapComponent.js

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';

import { evaluateOrderSafety } from '../logic/smartAccept';
import { buildRoutePolyline } from '../logic/routing';
import { SWAP_STATIONS } from '../data/mockData';

/**
 * Props:
 * - activeOrder: { id, label, latitude, longitude, distanceKm, payout }
 * - batteryPercentage: number (0-100) — current battery, drives Smart-Accept
 * - onDriverLocation: (coords: { latitude, longitude }) => void
 */
export default function MapComponent({ activeOrder, batteryPercentage, onDriverLocation }) {
  const [driverLocation, setDriverLocation] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('checking');
  const [errorMsg, setErrorMsg] = useState(null);
  const watchSubscription = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function startWatching() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (!isMounted) return;

      if (status !== 'granted') {
        setPermissionStatus('denied');
        setErrorMsg('Location permission denied. Enable it in device settings to use live tracking.');
        return;
      }

      setPermissionStatus('granted');

      try {
        const initial = await Location.getCurrentPositionAsync({});
        if (!isMounted) return;
        const coords = { latitude: initial.coords.latitude, longitude: initial.coords.longitude };
        setDriverLocation(coords);
        onDriverLocation?.(coords);
      } catch (e) {
        setErrorMsg('Could not get initial position.');
      }

      watchSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (location) => {
          if (!isMounted) return;
          const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setDriverLocation(coords);
          onDriverLocation?.(coords);
        }
      );
    }

    startWatching();

    return () => {
      isMounted = false;
      if (watchSubscription.current) {
        watchSubscription.current.remove();
      }
    };
  }, []);

  if (permissionStatus === 'checking') {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>Requesting location permission…</Text>
      </View>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!driverLocation) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>Getting current position…</Text>
      </View>
    );
  }

  // Smart-Accept evaluation for the active order, if one is selected
  let swapRequired = false;
  let routeData = { points: [driverLocation], swapStationUsed: null };

  if (activeOrder) {
    const safety = evaluateOrderSafety(activeOrder.distanceKm, batteryPercentage);
    swapRequired = safety.swapRequired;

    routeData = buildRoutePolyline({
      driverLocation,
      destination: { latitude: activeOrder.latitude, longitude: activeOrder.longitude },
      swapRequired,
      swapStations: SWAP_STATIONS,
    });
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {/* Driver marker */}
        <Marker
          coordinate={driverLocation}
          title="You"
          pinColor="#2E7D32"
        />

        {/* Active order destination marker */}
        {activeOrder && (
          <Marker
            coordinate={{ latitude: activeOrder.latitude, longitude: activeOrder.longitude }}
            title={activeOrder.label}
            description={`₹${activeOrder.payout} · ${activeOrder.distanceKm} km`}
            pinColor="#FF5252"
          />
        )}

        {/* Swap station marker, if route requires one */}
        {routeData.swapStationUsed && (
          <Marker
            coordinate={{
              latitude: routeData.swapStationUsed.latitude,
              longitude: routeData.swapStationUsed.longitude,
            }}
            title={routeData.swapStationUsed.label}
            pinColor="#F9A825"
          />
        )}

        {/* Route polyline */}
        {routeData.points.length > 1 && (
          <Polyline
            coordinates={routeData.points}
            strokeColor={swapRequired ? '#F9A825' : '#2E7D32'}
            strokeWidth={4}
          />
        )}
      </MapView>

      {activeOrder && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            {swapRequired
              ? `⚠ Battery swap needed en route to ${activeOrder.label}`
              : `✓ Sufficient charge for ${activeOrder.label}`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  infoText: { color: '#555', fontSize: 14, textAlign: 'center' },
  errorText: { color: '#D32F2F', fontSize: 14, textAlign: 'center' },
  banner: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerText: { color: '#212121', fontSize: 13, fontWeight: '600', textAlign: 'center' },
});
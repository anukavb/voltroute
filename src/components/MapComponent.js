// src/components/MapComponent.js

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { evaluateOrderSafety } from '../logic/smartAccept';
import { buildRoutePolyline } from '../logic/routing';
import { fetchRoadRoute } from '../services/routingService';
import { SWAP_STATIONS } from '../data/mockData';

const REVEAL_STEP_MS = 30;

export default function MapComponent({ activeOrder, batteryPercentage, onDriverLocation }) {
  const [driverLocation, setDriverLocation] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('checking');
  const [errorMsg, setErrorMsg] = useState(null);
  const [roadRoute, setRoadRoute] = useState(null);
  const [revealCount, setRevealCount] = useState(0);
  const watchSubscription = useRef(null);
  const mapRef = useRef(null);
  const revealInterval = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function startWatching() {
      console.log('[MapComponent] Requesting permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('[MapComponent] Permission status:', status);
      if (!isMounted) return;

      if (status !== 'granted') {
        setPermissionStatus('denied');
        setErrorMsg('Location permission denied. Enable it in device settings to use live tracking.');
        return;
      }

      setPermissionStatus('granted');

      try {
        console.log('[MapComponent] Fetching initial position...');
        const initial = await Location.getCurrentPositionAsync({});
        console.log('[MapComponent] Initial position:', initial.coords);
        if (!isMounted) return;
        const coords = { latitude: initial.coords.latitude, longitude: initial.coords.longitude };
        setDriverLocation(coords);
        onDriverLocation?.(coords);
      } catch (e) {
        console.log('[MapComponent] Initial position FAILED:', e.message);
        setErrorMsg('Could not get initial position: ' + e.message);
      }

      try {
        watchSubscription.current = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 },
          (location) => {
            if (!isMounted) return;
            const coords = { latitude: location.coords.latitude, longitude: location.coords.longitude };
            setDriverLocation(coords);
            onDriverLocation?.(coords);
          }
        );
        console.log('[MapComponent] Watch subscription started');
      } catch (e) {
        console.log('[MapComponent] Watch subscription FAILED:', e.message);
      }
    }

    startWatching();

    return () => {
      isMounted = false;
      if (watchSubscription.current) watchSubscription.current.remove();
    };
  }, []);

  let swapRequired = false;
  let waypoints = null;

  if (activeOrder && driverLocation) {
    const safety = evaluateOrderSafety(activeOrder.distanceKm, batteryPercentage);
    swapRequired = safety.swapRequired;

    waypoints = buildRoutePolyline({
      driverLocation,
      destination: { latitude: activeOrder.latitude, longitude: activeOrder.longitude },
      swapRequired,
      swapStations: SWAP_STATIONS,
    });
  }

  useEffect(() => {
    if (!waypoints || waypoints.points.length < 2) {
      setRoadRoute(null);
      return;
    }

    let cancelled = false;

    fetchRoadRoute(waypoints.points).then((route) => {
      if (cancelled) return;
      console.log('[MapComponent] Road route result:', route ? `${route.points.length} points` : 'null');
      if (route) {
        setRoadRoute(route);
      } else {
        setRoadRoute({ points: waypoints.points, distanceMeters: null, durationSeconds: null });
      }
    });

    return () => { cancelled = true; };
  }, [activeOrder?.id, swapRequired]);

  useEffect(() => {
    if (revealInterval.current) clearInterval(revealInterval.current);
    setRevealCount(0);

    if (!roadRoute || roadRoute.points.length === 0) return;

    let count = 0;
    revealInterval.current = setInterval(() => {
      count += Math.ceil(roadRoute.points.length / 40);
      if (count >= roadRoute.points.length) {
        count = roadRoute.points.length;
        clearInterval(revealInterval.current);
      }
      setRevealCount(count);
    }, REVEAL_STEP_MS);

    return () => clearInterval(revealInterval.current);
  }, [roadRoute]);

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
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      </View>
    );
  }

  const visiblePolylinePoints = roadRoute ? roadRoute.points.slice(0, revealCount) : [];
  const swapStationUsed = waypoints?.swapStationUsed || null;

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
        <Marker coordinate={driverLocation} title="You" anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
          <View style={styles.driverPin} collapsable={false}>
            <MaterialCommunityIcons name="moped" size={18} color="#fff" />
          </View>
        </Marker>

        {activeOrder && (
          <Marker
            coordinate={{ latitude: activeOrder.latitude, longitude: activeOrder.longitude }}
            title={activeOrder.homeLabel || activeOrder.label}
            description={`₹${activeOrder.payout} · ${activeOrder.distanceKm} km`}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges={false}
          >
            <View style={styles.homePin} collapsable={false}>
              <Ionicons name="home" size={18} color="#fff" />
            </View>
          </Marker>
        )}

        {swapStationUsed && (
          <Marker
            coordinate={{ latitude: swapStationUsed.latitude, longitude: swapStationUsed.longitude }}
            title={swapStationUsed.label}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges={false}
          >
            <View style={styles.kioskPin} collapsable={false}>
              <Ionicons name="flash" size={18} color="#fff" />
            </View>
          </Marker>
        )}

        {visiblePolylinePoints.length > 1 && (
          <Polyline
            coordinates={visiblePolylinePoints}
            strokeColor={swapRequired ? '#F9A825' : '#2E7D32'}
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>

      <TouchableOpacity
        style={[styles.recentreBtn, { bottom: activeOrder ? 90 : 20 }]}
        onPress={() => {
          if (mapRef.current && driverLocation) {
            mapRef.current.animateToRegion(
              {
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              },
              500
            );
          }
        }}
      >
        <Ionicons name="locate" size={22} color="#2E7D32" />
      </TouchableOpacity>

      {activeOrder && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            {swapRequired
              ? `⚠ Battery swap needed en route to ${activeOrder.homeLabel || activeOrder.label}`
              : `✓ Sufficient charge for ${activeOrder.homeLabel || activeOrder.label}`}
          </Text>
          {roadRoute?.distanceMeters != null && roadRoute?.durationSeconds != null && (
            <Text style={styles.bannerSubtext}>
              {(roadRoute.distanceMeters / 1000).toFixed(1)} km · {Math.round(roadRoute.durationSeconds / 60)} min
            </Text>
          )}
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
  errorText: { color: '#D32F2F', fontSize: 13, textAlign: 'center', marginTop: 8 },
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
  bannerSubtext: { color: '#757575', fontSize: 11, textAlign: 'center', marginTop: 2 },
  recentreBtn: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#fff',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  driverPin: {
    backgroundColor: '#2E7D32',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  homePin: {
    backgroundColor: '#FF5252',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  kioskPin: {
    backgroundColor: '#F9A825',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
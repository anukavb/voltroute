// src/logic/routing.js

function haversineDistance(a, b) {
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function findClosestSwapStation(driverLocation, swapStations) {
  let closest = swapStations[0];
  let minDist = haversineDistance(driverLocation, closest);

  for (const station of swapStations) {
    const d = haversineDistance(driverLocation, station);
    if (d < minDist) {
      minDist = d;
      closest = station;
    }
  }
  return closest;
}

export function buildRoutePolyline({
  driverLocation,
  destination,
  swapRequired,
  swapStations,
}) {
  if (!swapRequired) {
    return {
      points: [driverLocation, destination],
      swapStationUsed: null,
    };
  }

  const nearestStation = findClosestSwapStation(driverLocation, swapStations);

  return {
    points: [driverLocation, nearestStation, destination],
    swapStationUsed: nearestStation,
  };
}
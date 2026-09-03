// src/services/routingService.js
// (Free OSRM public server — no API key, no billing, no signup required)

/**
 * Fetches a real road-snapped route between an ordered list of waypoints.
 * waypoints: [{ latitude, longitude }, ...] — at least 2 points
 * Returns: { points: [{ latitude, longitude }, ...], distanceMeters, durationSeconds } | null on failure
 */
export async function fetchRoadRoute(waypoints) {
  if (!waypoints || waypoints.length < 2) return null;

  const coordString = waypoints
    .map((p) => `${p.longitude},${p.latitude}`)
    .join(';');

  const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      return null;
    }

    const route = data.routes[0];
    const points = route.geometry.coordinates.map(([lng, lat]) => ({
      latitude: lat,
      longitude: lng,
    }));

    return {
      points,
      distanceMeters: route.distance,
      durationSeconds: route.duration,
    };
  } catch (error) {
    console.warn('OSRM route fetch failed:', error);
    return null;
  }
}
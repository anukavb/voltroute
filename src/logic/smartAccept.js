// src/logic/smartAccept.js

/**
 * Pure function: decides if an order is safe to accept on current charge.
 * Rule: batteryPercentage - (distanceKm * 4) < 15  => swap required
 */
export function evaluateOrderSafety(distanceKm, batteryPercentage) {
  const projectedRemaining = batteryPercentage - distanceKm * 4;
  const swapRequired = projectedRemaining < 15;

  return {
    swapRequired,
    projectedRemaining: Math.max(projectedRemaining, 0),
  };
}
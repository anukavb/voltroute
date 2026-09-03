const KM_PER_PERCENT = 0.5;
const SAFETY_BUFFER_PERCENT = 8;

export function evaluateOrderSafety(distanceKm, batteryPercentage) {
  const batteryNeeded = distanceKm / KM_PER_PERCENT;
  const projectedRemaining = batteryPercentage - batteryNeeded;
  const swapRequired = projectedRemaining < SAFETY_BUFFER_PERCENT;
  return { swapRequired, projectedRemaining: Math.max(projectedRemaining, 0) };
}
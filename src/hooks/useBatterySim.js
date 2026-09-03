import { useState, useCallback } from 'react';

const START_BATTERY = 38;
const FLOOR_BATTERY = 5;
const DRAIN_AMOUNT = 4;

export function useBatterySim() {
  const [battery, setBattery] = useState(START_BATTERY);
  const drainNow = useCallback(() => {
    setBattery((prev) => Math.max(prev - DRAIN_AMOUNT, FLOOR_BATTERY));
  }, []);
  const resetBattery = useCallback(() => setBattery(START_BATTERY), []);
  return { battery, drainNow, resetBattery };
}
// src/hooks/useBatterySim.js

import { useState, useEffect, useRef, useCallback } from 'react';

const START_BATTERY = 25;
const FLOOR_BATTERY = 5;
const DRAIN_INTERVAL_MS = 10000;
const DRAIN_AMOUNT = 1;

export function useBatterySim() {
  const [battery, setBattery] = useState(START_BATTERY);
  const [isDraining, setIsDraining] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isDraining) {
      intervalRef.current = setInterval(() => {
        setBattery((prev) => Math.max(prev - DRAIN_AMOUNT, FLOOR_BATTERY));
      }, DRAIN_INTERVAL_MS);
    }
    return () => clearInterval(intervalRef.current);
  }, [isDraining]);

  const pauseDrain = useCallback(() => setIsDraining(false), []);
  const resumeDrain = useCallback(() => setIsDraining(true), []);
  const resetBattery = useCallback(() => setBattery(START_BATTERY), []);

  return { battery, isDraining, pauseDrain, resumeDrain, resetBattery };
}
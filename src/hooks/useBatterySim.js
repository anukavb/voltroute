// src/hooks/useBatterySim.js
import { useState, useEffect, useRef } from 'react';

const START_BATTERY = 25;
const MIN_BATTERY = 5;
const TICK_MS = 10000;
const DRAIN_PER_TICK = 1;

export default function useBatterySim() {
  const [battery, setBattery] = useState(START_BATTERY);
  const [isDraining, setIsDraining] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isDraining) return;

    intervalRef.current = setInterval(() => {
      setBattery((prev) => {
        const next = prev - DRAIN_PER_TICK;
        if (next <= MIN_BATTERY) {
          clearInterval(intervalRef.current);
          return MIN_BATTERY;
        }
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(intervalRef.current);
  }, [isDraining]);

  const pauseDrain = () => setIsDraining(false);
  const resumeDrain = () => setIsDraining(true);
  const resetBattery = () => setBattery(START_BATTERY);

  return { battery, isDraining, pauseDrain, resumeDrain, resetBattery };
}
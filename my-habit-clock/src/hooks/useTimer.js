import { useState, useRef, useCallback } from 'react';

export function useTimer() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  const tick = useCallback(() => {
    if (startTimeRef.current !== null) {
      setElapsedMs(Date.now() - startTimeRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;
    startTimeRef.current = Date.now() - elapsedMs;
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [isRunning, elapsedMs, tick]);

  const stop = useCallback(() => {
    setIsRunning(false);
    startTimeRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const reset = useCallback(() => {
    stop();
    setElapsedMs(0);
  }, [stop]);

  return { elapsedMs, isRunning, start, stop, reset };
}

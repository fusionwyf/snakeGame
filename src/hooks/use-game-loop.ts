import { useEffect, useRef, useCallback } from 'react';

interface UseGameLoopOptions {
  onUpdate: () => void;
  onRender: () => void;
  isRunning: boolean;
  speed: number;
}

/**
 * Game loop hook using requestAnimationFrame with fixed time step
 */
export const useGameLoop = ({ onUpdate, onRender, isRunning, speed }: UseGameLoopOptions): void => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);
  const speedRef = useRef(speed);

  // Update speed ref when speed changes
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time;
      }

      const deltaTime = time - previousTimeRef.current;
      previousTimeRef.current = time;
      accumulatorRef.current += deltaTime;

      // Fixed time step update
      while (accumulatorRef.current >= speedRef.current) {
        onUpdate();
        accumulatorRef.current -= speedRef.current;
      }

      onRender();

      if (isRunning) {
        requestRef.current = requestAnimationFrame(animate);
      }
    },
    [onUpdate, onRender, isRunning]
  );

  useEffect(() => {
    if (isRunning) {
      previousTimeRef.current = performance.now();
      accumulatorRef.current = 0;
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning, animate]);
};

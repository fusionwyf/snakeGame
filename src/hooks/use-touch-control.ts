import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/game-store';
import type { Direction } from '@/types';

interface TouchState {
  startX: number;
  startY: number;
}

/**
 * Minimum swipe distance in pixels
 */
const SWIPE_THRESHOLD = 30;

/**
 * Hook for touch/swipe controls
 */
export function useTouchControl(): void {
  const gameStatus = useGameStore(state => state.gameStatus);
  const changeDirection = useGameStore(state => state.changeDirection);
  const resumeGame = useGameStore(state => state.resumeGame);
  const startGame = useGameStore(state => state.startGame);
  const resetGame = useGameStore(state => state.resetGame);

  const touchState = useRef<TouchState | null>(null);
  const lastTapTime = useRef<number>(0);

  const getDirectionFromSwipe = useCallback((deltaX: number, deltaY: number): Direction | null => {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) {
      return null;
    }

    if (absX > absY) {
      return deltaX > 0 ? 'right' : 'left';
    }
    return deltaY > 0 ? 'down' : 'up';
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent): void => {
    const touch = event.touches[0];
    touchState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
    };
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent): void => {
      if (!touchState.current) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchState.current.startX;
      const deltaY = touch.clientY - touchState.current.startY;
      const now = Date.now();

      // Prevent double-tap from triggering direction change
      if (now - lastTapTime.current < 300) {
        touchState.current = null;
        return;
      }

      const direction = getDirectionFromSwipe(deltaX, deltaY);

      if (direction) {
        // Tap detected - change direction
        if (gameStatus === 'playing') {
          changeDirection(direction);
          lastTapTime.current = now;
        }
      } else if (gameStatus === 'idle' || gameStatus === 'gameover') {
        // Tap on screen to start
        resetGame();
        startGame();
      } else if (gameStatus === 'paused') {
        // Tap to resume
        resumeGame();
      }

      touchState.current = null;
    },
    [gameStatus, changeDirection, getDirectionFromSwipe, resetGame, startGame, resumeGame]
  );

  useEffect(() => {
    const element = document.body;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);
}

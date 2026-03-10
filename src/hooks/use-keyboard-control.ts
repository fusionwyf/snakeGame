import { useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/game-store';
import type { Direction } from '@/types';

/**
 * Map of key codes to directions
 */
const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: 'up',
  KeyW: 'up',
  Keyw: 'up',
  ArrowDown: 'down',
  KeyS: 'down',
  Keys: 'down',
  ArrowLeft: 'left',
  KeyA: 'left',
  Keya: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  Keyd: 'right',
};

/**
 * Hook for keyboard controls
 */
export function useKeyboardControl(): void {
  const gameStatus = useGameStore(state => state.gameStatus);
  const changeDirection = useGameStore(state => state.changeDirection);
  const pauseGame = useGameStore(state => state.pauseGame);
  const resumeGame = useGameStore(state => state.resumeGame);
  const startGame = useGameStore(state => state.startGame);
  const resetGame = useGameStore(state => state.resetGame);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      // Prevent default for game keys
      if (event.code in KEY_TO_DIRECTION || event.code === 'Space') {
        event.preventDefault();
      }

      const direction = KEY_TO_DIRECTION[event.code];

      if (direction) {
        // Handle direction change
        if (gameStatus === 'playing') {
          changeDirection(direction);
        }
      } else if (event.code === 'Space') {
        // Handle pause/resume
        if (gameStatus === 'playing') {
          pauseGame();
        } else if (gameStatus === 'paused') {
          resumeGame();
        } else if (gameStatus === 'idle' || gameStatus === 'gameover') {
          resetGame();
          startGame();
        }
      }
    },
    [gameStatus, changeDirection, pauseGame, resumeGame, startGame, resetGame]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

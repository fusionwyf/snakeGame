import { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/game-store';
import { CANVAS_SIZE, CELL_SIZE } from '@/game/constants';
import type { Segment, Food } from '@/types';

interface GameCanvasProps {
  onFoodEaten?: () => void;
}

/**
 * Draw neon glow effect
 */
const drawGlow = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void => {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 1.5);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.5, color + '80');
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(x - size * 1.5, y - size * 1.5, size * 3, size * 3);
};

/**
 * Draw snake segment with neon effect
 */
const drawSnakeSegment = (
  ctx: CanvasRenderingContext2D,
  segment: Segment,
  index: number,
  total: number,
  theme: 'dark' | 'light'
): void => {
  const { x, y } = segment.position;
  const px = x * CELL_SIZE;
  const py = y * CELL_SIZE;
  const padding = 1;
  const size = CELL_SIZE - padding * 2;

  // Color gradient from head to tail
  const hue = theme === 'dark' ? 180 : 200; // Cyan hue
  const saturation = 100;
  const lightness = Math.max(30, 70 - (index / total) * 30);
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  // Draw glow
  if (theme === 'dark') {
    drawGlow(ctx, px + CELL_SIZE / 2, py + CELL_SIZE / 2, size, '#00f5ff');
  }

  // Draw body
  ctx.fillStyle = color;
  ctx.shadowColor = theme === 'dark' ? '#00f5ff' : '#0088aa';
  ctx.shadowBlur = theme === 'dark' ? 15 : 8;
  ctx.beginPath();
  ctx.roundRect(px + padding, py + padding, size, size, 4);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Draw eyes on head
  if (index === 0) {
    const eyeSize = size * 0.2;
    const eyeOffset = size * 0.25;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 5;

    // Position eyes based on direction
    const eyePositions = getEyePositions(segment.direction, px, py, size, eyeOffset);
    ctx.beginPath();
    ctx.arc(eyePositions[0].x, eyePositions[0].y, eyeSize, 0, Math.PI * 2);
    ctx.arc(eyePositions[1].x, eyePositions[1].y, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
};

/**
 * Get eye positions based on direction
 */
const getEyePositions = (
  direction: string,
  px: number,
  py: number,
  size: number,
  offset: number
): { x: number; y: number }[] => {
  const centerX = px + size / 2;
  const centerY = py + size / 2;
  const eyeSpacing = size * 0.25;

  switch (direction) {
    case 'up':
      return [
        { x: centerX - eyeSpacing, y: py + offset },
        { x: centerX + eyeSpacing, y: py + offset },
      ];
    case 'down':
      return [
        { x: centerX - eyeSpacing, y: py + size - offset },
        { x: centerX + eyeSpacing, y: py + size - offset },
      ];
    case 'left':
      return [
        { x: px + offset, y: centerY - eyeSpacing },
        { x: px + offset, y: centerY + eyeSpacing },
      ];
    case 'right':
      return [
        { x: px + size - offset, y: centerY - eyeSpacing },
        { x: px + size - offset, y: centerY + eyeSpacing },
      ];
    default:
      return [
        { x: centerX - eyeSpacing, y: py + offset },
        { x: centerX + eyeSpacing, y: py + offset },
      ];
  }
};

/**
 * Draw food with pulse effect
 */
const drawFood = (ctx: CanvasRenderingContext2D, food: Food, theme: 'dark' | 'light'): void => {
  const { position, color, pulsePhase } = food;
  const px = position.x * CELL_SIZE + CELL_SIZE / 2;
  const py = position.y * CELL_SIZE + CELL_SIZE / 2;

  // Pulse animation
  const pulse = Math.sin(pulsePhase) * 0.2 + 1;
  const size = (CELL_SIZE / 2 - 2) * pulse;

  // Draw glow
  if (theme === 'dark') {
    drawGlow(ctx, px, py, size * 1.5, color);
  }

  // Draw food
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = theme === 'dark' ? 20 : 10;
  ctx.beginPath();
  ctx.arc(px, py, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Inner glow
  const innerGradient = ctx.createRadialGradient(px, py, 0, px, py, size);
  innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  innerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
  innerGradient.addColorStop(1, 'transparent');
  ctx.fillStyle = innerGradient;
  ctx.beginPath();
  ctx.arc(px, py, size, 0, Math.PI * 2);
  ctx.fill();
};

/**
 * Draw grid background
 */
const drawGrid = (ctx: CanvasRenderingContext2D, gridSize: number, theme: 'dark' | 'light'): void => {
  ctx.strokeStyle = theme === 'dark' ? 'rgba(0, 245, 255, 0.03)' : 'rgba(0, 136, 170, 0.05)';
  ctx.lineWidth = 1;

  for (let i = 0; i <= gridSize; i++) {
    const pos = i * CELL_SIZE;
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, CANVAS_SIZE);
    ctx.stroke();
    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(CANVAS_SIZE, pos);
    ctx.stroke();
  }
};

/**
 * Main game canvas component
 */
export function GameCanvas({ onFoodEaten }: GameCanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastRenderTimeRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const gameLoopRef = useRef<number>(0);
  const lastScoreRef = useRef<number>(0);
  const onFoodEatenRef = useRef(onFoodEaten);

  // Update ref when callback changes
  useEffect(() => {
    onFoodEatenRef.current = onFoodEaten;
  }, [onFoodEaten]);

  const snake = useGameStore(state => state.snake);
  const food = useGameStore(state => state.food);
  const gameStatus = useGameStore(state => state.gameStatus);
  const update = useGameStore(state => state.update);

  const theme = ((): 'dark' | 'light' => {
    const root = document.documentElement;
    return (root.getAttribute('data-theme') as 'dark' | 'light') || 'dark';
  })();

  const draw = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Calculate delta time for rendering (separate from update timing)
      const deltaRender = timestamp - lastRenderTimeRef.current;
      lastRenderTimeRef.current = timestamp;

      // Clear canvas
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw grid
      drawGrid(ctx, 20, theme);

      // Draw food with pulse (animate using render delta)
      const pulseFood = {
        ...food,
        pulsePhase: food.pulsePhase + deltaRender * 0.005,
      };
      drawFood(ctx, pulseFood, theme);

      // Draw snake
      snake.forEach((segment, index) => {
        drawSnakeSegment(ctx, segment, index, snake.length, theme);
      });

      // Check for food eaten
      const currentScore = useGameStore.getState().score;
      if (currentScore > lastScoreRef.current && onFoodEatenRef.current) {
        onFoodEatenRef.current();
        lastScoreRef.current = currentScore;
      }
    },
    [snake, food, theme]
  );

  const gameLoop = useCallback(
    (timestamp: number) => {
      const state = useGameStore.getState();

      if (state.gameStatus === 'playing') {
        const deltaUpdate = timestamp - lastUpdateTimeRef.current;

        if (deltaUpdate >= state.speed) {
          update();
          lastUpdateTimeRef.current = timestamp;
        }
      }

      draw(timestamp);
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    },
    [update, draw]
  );

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        // Reset time when page becomes visible again
        const now = performance.now();
        lastRenderTimeRef.current = now;
        lastUpdateTimeRef.current = now;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const now = performance.now();
    lastRenderTimeRef.current = now;
    lastUpdateTimeRef.current = now;
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop]);

  // Reset score ref when game restarts
  useEffect(() => {
    if (gameStatus === 'playing') {
      lastScoreRef.current = useGameStore.getState().score;
    }
  }, [gameStatus]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className="game-canvas"
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
        aspectRatio: '1',
      }}
    />
  );
}

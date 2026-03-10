import type { GameConfig, Direction, Position } from '@/types';

/**
 * Game configuration constants
 */
export const GAME_CONFIG: GameConfig = {
  gridSize: 20,
  initialSpeed: 150,
  speedIncrement: 5,
  maxSpeed: 50,
  initialSnakeLength: 3,
};

/**
 * Canvas dimensions
 */
export const CANVAS_SIZE = 600;

/**
 * Cell size in pixels
 */
export const CELL_SIZE = CANVAS_SIZE / GAME_CONFIG.gridSize;

/**
 * Direction vectors
 */
export const DIRECTION_VECTORS: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

/**
 * Opposite directions (for collision prevention)
 */
export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

/**
 * Neon colors for food
 */
export const FOOD_COLORS = [
  '#00f5ff', // Cyan
  '#ff00ff', // Magenta
  '#ff2a6d', // Pink
  '#39ff14', // Green
  '#f5e100', // Yellow
];

/**
 * Speed thresholds for difficulty
 */
export const SPEED_THRESHOLDS = [
  { score: 0, speed: 150 },
  { score: 5, speed: 130 },
  { score: 10, speed: 110 },
  { score: 20, speed: 90 },
  { score: 35, speed: 70 },
  { score: 50, speed: 50 },
];

/**
 * High score key for localStorage
 */
export const HIGH_SCORE_KEY = 'snake-game-high-score';

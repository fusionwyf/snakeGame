import { create } from 'zustand';
import type { GameStore, Direction, Segment, Food, Position } from '@/types';
import {
  GAME_CONFIG,
  DIRECTION_VECTORS,
  OPPOSITE_DIRECTIONS,
  FOOD_COLORS,
  SPEED_THRESHOLDS,
  HIGH_SCORE_KEY,
} from '@/game/constants';

/**
 * Get random food position not occupied by snake
 */
const getRandomFoodPosition = (snake: Segment[]): Position => {
  const occupiedPositions = new Set(snake.map(s => `${s.position.x},${s.position.y}`));
  let position: Position;

  do {
    position = {
      x: Math.floor(Math.random() * GAME_CONFIG.gridSize),
      y: Math.floor(Math.random() * GAME_CONFIG.gridSize),
    };
  } while (occupiedPositions.has(`${position.x},${position.y}`));

  return position;
};

/**
 * Get random food color
 */
const getRandomFoodColor = (): string => {
  return FOOD_COLORS[Math.floor(Math.random() * FOOD_COLORS.length)];
};

/**
 * Get speed based on score
 */
const getSpeedFromScore = (score: number): number => {
  for (let i = SPEED_THRESHOLDS.length - 1; i >= 0; i--) {
    if (score >= SPEED_THRESHOLDS[i].score) {
      return SPEED_THRESHOLDS[i].speed;
    }
  }
  return GAME_CONFIG.initialSpeed;
};

/**
 * Get initial snake segments
 */
const getInitialSnake = (): Segment[] => {
  const startX = Math.floor(GAME_CONFIG.gridSize / 2);
  const startY = Math.floor(GAME_CONFIG.gridSize / 2);
  const segments: Segment[] = [];

  for (let i = 0; i < GAME_CONFIG.initialSnakeLength; i++) {
    segments.push({
      position: { x: startX - i, y: startY },
      direction: 'right',
    });
  }

  return segments;
};

/**
 * Get initial food
 */
const getInitialFood = (snake: Segment[]): Food => {
  return {
    position: getRandomFoodPosition(snake),
    color: getRandomFoodColor(),
    pulsePhase: 0,
  };
};

/**
 * Load high score from localStorage
 */
const loadHighScore = (): number => {
  try {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
};

/**
 * Save high score to localStorage
 */
const saveHighScore = (score: number): void => {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  } catch {
    // Ignore localStorage errors
  }
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  snake: getInitialSnake(),
  food: getInitialFood(getInitialSnake()),
  direction: 'right',
  nextDirection: 'right',
  score: 0,
  highScore: loadHighScore(),
  gameStatus: 'idle',
  speed: GAME_CONFIG.initialSpeed,
  gridSize: GAME_CONFIG.gridSize,

  // Actions
  initGame: () => {
    const snake = getInitialSnake();
    const food = getInitialFood(snake);
    set({
      snake,
      food,
      direction: 'right',
      nextDirection: 'right',
      score: 0,
      gameStatus: 'idle',
      speed: GAME_CONFIG.initialSpeed,
    });
  },

  startGame: () => {
    const snake = getInitialSnake();
    const food = getInitialFood(snake);
    set({
      snake,
      food,
      direction: 'right',
      nextDirection: 'right',
      score: 0,
      gameStatus: 'playing',
      speed: GAME_CONFIG.initialSpeed,
    });
  },

  pauseGame: () => {
    const { gameStatus } = get();
    if (gameStatus === 'playing') {
      set({ gameStatus: 'paused' });
    }
  },

  resumeGame: () => {
    const { gameStatus } = get();
    if (gameStatus === 'paused') {
      set({ gameStatus: 'playing' });
    }
  },

  resetGame: () => {
    const { score, highScore } = get();
    if (score > highScore) {
      saveHighScore(score);
      set({ highScore: score });
    }
    get().initGame();
  },

  changeDirection: (direction: Direction) => {
    const { direction: currentDirection } = get();
    if (OPPOSITE_DIRECTIONS[direction] !== currentDirection) {
      set({ nextDirection: direction });
    }
  },

  update: () => {
    const { snake, nextDirection, food, gameStatus } = get();

    if (gameStatus !== 'playing') return;

    // Update direction
    const newDirection = nextDirection;

    // Calculate new head position
    const head = snake[0];
    const vector = DIRECTION_VECTORS[newDirection];
    const newHead: Position = {
      x: head.position.x + vector.x,
      y: head.position.y + vector.y,
    };

    // Check wall collision
    if (newHead.x < 0 || newHead.x >= GAME_CONFIG.gridSize || newHead.y < 0 || newHead.y >= GAME_CONFIG.gridSize) {
      get().gameOver();
      return;
    }

    // Check self collision
    const hasSelfCollision = snake.some(
      segment => segment.position.x === newHead.x && segment.position.y === newHead.y
    );

    if (hasSelfCollision) {
      get().gameOver();
      return;
    }

    // Move snake
    const newSnake: Segment[] = [
      { position: newHead, direction: newDirection },
      ...snake.map((s, i) => ({
        ...s,
        direction: i === 0 ? newDirection : snake[i - 1].direction,
      })),
    ];

    // Check food collision
    if (newHead.x === food.position.x && newHead.y === food.position.y) {
      // Grow snake (don't remove tail)
      get().eatFood();
    } else {
      // Remove tail
      newSnake.pop();
    }

    set({
      snake: newSnake,
      direction: newDirection,
    });
  },

  eatFood: () => {
    const { snake, score } = get();
    const newScore = score + 1;
    const newSpeed = getSpeedFromScore(newScore);
    const newFood = getInitialFood(snake);

    set({
      score: newScore,
      speed: newSpeed,
      food: newFood,
    });
  },

  gameOver: () => {
    const { score, highScore } = get();
    if (score > highScore) {
      saveHighScore(score);
      set({ gameStatus: 'gameover', highScore: score });
    } else {
      set({ gameStatus: 'gameover' });
    }
  },
}));

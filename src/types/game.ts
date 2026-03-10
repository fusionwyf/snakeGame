/**
 * 2D position on the game grid
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Direction of snake movement
 */
export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * Snake segment (body part)
 */
export interface Segment {
  position: Position;
  direction: Direction;
}

/**
 * Food item on the game grid
 */
export interface Food {
  position: Position;
  color: string;
  pulsePhase: number;
}

/**
 * Game status
 */
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

/**
 * Theme type
 */
export type Theme = 'dark' | 'light';

/**
 * Game configuration
 */
export interface GameConfig {
  gridSize: number;
  initialSpeed: number;
  speedIncrement: number;
  maxSpeed: number;
  initialSnakeLength: number;
}

/**
 * Particle for effects
 */
export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

/**
 * Game state for rendering
 */
export interface GameState {
  snake: Segment[];
  food: Food;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  gameStatus: GameStatus;
  speed: number;
  gridSize: number;
}

/**
 * Store actions
 */
export interface GameActions {
  initGame: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  changeDirection: (direction: Direction) => void;
  update: () => void;
  eatFood: () => void;
  gameOver: () => void;
}

/**
 * Complete store type
 */
export type GameStore = GameState & GameActions;

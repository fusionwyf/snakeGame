import { useGameStore } from '@/store/game-store';
import { useTheme } from '@/hooks/use-theme';

/**
 * Start menu component
 */
export function StartMenu(): JSX.Element {
  const gameStatus = useGameStore(state => state.gameStatus);
  const startGame = useGameStore(state => state.startGame);
  const highScore = useGameStore(state => state.highScore);
  const { theme } = useTheme();

  if (gameStatus !== 'idle') return <></>;

  return (
    <div className="start-menu-overlay">
      <div className="start-menu">
        <h1 className={`game-title ${theme === 'dark' ? 'glow-text' : ''}`}>NEON SNAKE</h1>
        <p className="game-subtitle">CYBERPUNK EDITION</p>

        <div className="title-decoration">
          <span className="line"></span>
          <span className="dot"></span>
          <span className="line"></span>
        </div>

        {highScore > 0 && (
          <div className="high-score-display">
            <span className="label">BEST SCORE</span>
            <span className="value">{highScore}</span>
          </div>
        )}

        <button className="neon-button start-button" onClick={startGame}>
          START GAME
        </button>

        <div className="controls-hint">
          <p>Use Arrow Keys or WASD to move</p>
          <p>Space to pause</p>
        </div>
      </div>
    </div>
  );
}

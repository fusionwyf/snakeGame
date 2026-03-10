import { useGameStore } from '@/store/game-store';
import { useTheme } from '@/hooks/use-theme';

/**
 * Game over component
 */
export function GameOver(): JSX.Element {
  const gameStatus = useGameStore(state => state.gameStatus);
  const score = useGameStore(state => state.score);
  const highScore = useGameStore(state => state.highScore);
  const resetGame = useGameStore(state => state.resetGame);
  const startGame = useGameStore(state => state.startGame);
  const { theme } = useTheme();

  if (gameStatus !== 'gameover') return <></>;

  const isNewHighScore = score >= highScore && score > 0;

  const handleRestart = (): void => {
    resetGame();
    startGame();
  };

  return (
    <div className="gameover-overlay">
      <div className="gameover-content">
        <h2 className={`gameover-title ${theme === 'dark' ? 'glow-text-pink' : ''}`}>GAME OVER</h2>

        {isNewHighScore && (
          <div className="new-high-score">
            <span className={`badge ${theme === 'dark' ? 'glow-text-yellow' : ''}`}>NEW HIGH SCORE!</span>
          </div>
        )}

        <div className="final-score">
          <span className="label">FINAL SCORE</span>
          <span className={`value ${theme === 'dark' ? 'glow-text' : ''}`}>{score}</span>
        </div>

        <div className="score-breakdown">
          <div className="breakdown-item">
            <span className="label">BEST</span>
            <span className="value">{highScore}</span>
          </div>
        </div>

        <button className="neon-button restart-button" onClick={handleRestart}>
          PLAY AGAIN
        </button>

        <p className="hint">Press SPACE to restart</p>
      </div>
    </div>
  );
}

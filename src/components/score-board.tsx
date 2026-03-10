import { useGameStore } from '@/store/game-store';
import { useTheme } from '@/hooks/use-theme';

/**
 * Score board component
 */
export function ScoreBoard(): JSX.Element {
  const score = useGameStore(state => state.score);
  const highScore = useGameStore(state => state.highScore);
  const speed = useGameStore(state => state.speed);
  const { theme } = useTheme();

  return (
    <div className="score-board">
      <div className="score-item">
        <span className="score-label">SCORE</span>
        <span className={`score-value ${theme === 'dark' ? 'glow-text' : ''}`}>
          {score.toString().padStart(4, '0')}
        </span>
      </div>
      <div className="score-item">
        <span className="score-label">HIGH</span>
        <span className="score-value high-score">{highScore.toString().padStart(4, '0')}</span>
      </div>
      <div className="score-item speed">
        <span className="score-label">SPEED</span>
        <span className="speed-value">{Math.round(1000 / speed)}x</span>
      </div>
    </div>
  );
}

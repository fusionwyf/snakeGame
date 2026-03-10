import { useGameStore } from '@/store/game-store';

/**
 * Pause overlay component
 */
export function PauseOverlay(): JSX.Element {
  const gameStatus = useGameStore(state => state.gameStatus);

  if (gameStatus !== 'paused') return <></>;

  return (
    <div className="pause-overlay">
      <div className="pause-content">
        <h2 className="pause-title glow-text">PAUSED</h2>
        <p className="pause-hint">Press SPACE to resume</p>
      </div>
    </div>
  );
}

import { ScoreBoard } from '@/components/score-board';
import { StartMenu } from '@/components/start-menu';
import { GameOver } from '@/components/game-over';
import { PauseOverlay } from '@/components/pause-overlay';
import { ThemeToggle } from '@/components/theme-toggle';
import { useKeyboardControl } from '@/hooks/use-keyboard-control';
import { useTouchControl } from '@/hooks/use-touch-control';

/**
 * Main game UI component
 */
export function GameUI(): JSX.Element {
  // Initialize controls
  useKeyboardControl();
  useTouchControl();

  return (
    <div className="game-ui">
      <div className="ui-top">
        <ScoreBoard />
        <ThemeToggle />
      </div>
      <StartMenu />
      <GameOver />
      <PauseOverlay />
    </div>
  );
}

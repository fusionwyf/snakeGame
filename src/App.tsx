import { GameCanvas } from '@/components/game-canvas';
import { GameUI } from '@/components/game-ui';
import { ParticleLayer } from '@/components/particle-layer';
import { ThemeProvider } from '@/hooks/use-theme';

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <div className="game-container">
        <GameCanvas />
        <ParticleLayer />
        <GameUI />
      </div>
    </ThemeProvider>
  );
}

export default App;

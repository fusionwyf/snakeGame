import { useRef, useEffect, useCallback } from 'react';
import { createParticleSystem, type ParticleSystem } from '@/utils/particle-system';
import { useGameStore } from '@/store/game-store';
import { CANVAS_SIZE } from '@/game/constants';

interface ParticleLayerProps {
  onFoodEaten?: () => void;
}

/**
 * Particle layer for visual effects
 */
export function ParticleLayer({ onFoodEaten }: ParticleLayerProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleSystemRef = useRef<ParticleSystem>(createParticleSystem());
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastScoreRef = useRef<number>(0);
  const onFoodEatenRef = useRef(onFoodEaten);

  useEffect(() => {
    onFoodEatenRef.current = onFoodEaten;
  }, [onFoodEaten]);

  const gameStatus = useGameStore(state => state.gameStatus);
  const food = useGameStore(state => state.food);
  const gridSize = useGameStore(state => state.gridSize);

  const theme = (() => {
    const root = document.documentElement;
    return (root.getAttribute('data-theme') as 'dark' | 'light') || 'dark';
  })();

  // Check for food eaten and spawn particles
  useEffect(() => {
    if (gameStatus === 'playing') {
      const currentScore = useGameStore.getState().score;
      if (currentScore > lastScoreRef.current && onFoodEatenRef.current) {
        // Spawn particles at food position
        particleSystemRef.current.spawn(food.position, food.color, 15, CANVAS_SIZE, gridSize);
        lastScoreRef.current = currentScore;
      }
    }
  }, [gameStatus, food, gridSize]);

  const draw = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Calculate delta time
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Update particles
      particleSystemRef.current.update(deltaTime);

      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw particles
      const particles = particleSystemRef.current.getParticles();
      particles.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        const size = particle.size * alpha;

        // Glow effect
        if (theme === 'dark') {
          const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, size * 2);
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(0.5, particle.color + '80');
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fillRect(particle.x - size * 2, particle.y - size * 2, size * 4, size * 4);
        }

        // Particle core
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    },
    [theme]
  );

  const loop = useCallback(
    (timestamp: number) => {
      draw(timestamp);
      animationRef.current = requestAnimationFrame(loop);
    },
    [draw]
  );

  useEffect(() => {
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [loop]);

  // Reset when game restarts
  useEffect(() => {
    if (gameStatus === 'playing') {
      lastScoreRef.current = useGameStore.getState().score;
      particleSystemRef.current.clear();
    }
  }, [gameStatus]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className="particle-layer"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '100%',
        maxHeight: '100%',
        aspectRatio: '1',
        pointerEvents: 'none',
      }}
    />
  );
}

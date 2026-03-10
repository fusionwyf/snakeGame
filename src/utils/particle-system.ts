import type { Particle, Position } from '@/types';

/**
 * Particle system for effects
 */
export class ParticleSystem {
  private particles: Map<string, Particle> = new Map();
  private idCounter = 0;

  /**
   * Create a unique particle ID
   */
  private createId(): string {
    return `particle-${++this.idCounter}-${Date.now()}`;
  }

  /**
   * Spawn particles at a position
   */
  spawn(position: Position, color: string, count: number = 12, canvasSize: number, gridSize: number): void {
    const cellSize = canvasSize / gridSize;
    const centerX = position.x * cellSize + cellSize / 2;
    const centerY = position.y * cellSize + cellSize / 2;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3;
      const id = this.createId();

      this.particles.set(id, {
        id,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        color,
        size: 3 + Math.random() * 3,
      });
    }
  }

  /**
   * Update all particles
   */
  update(deltaTime: number): void {
    const decay = deltaTime * 0.002;

    for (const [id, particle] of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.98;
      particle.vy *= 0.98;
      particle.life -= decay;

      if (particle.life <= 0) {
        this.particles.delete(id);
      }
    }
  }

  /**
   * Get all particles for rendering
   */
  getParticles(): Particle[] {
    return Array.from(this.particles.values());
  }

  /**
   * Get particle count
   */
  getCount(): number {
    return this.particles.size;
  }

  /**
   * Clear all particles
   */
  clear(): void {
    this.particles.clear();
  }
}

/**
 * Create a new particle system instance
 */
export const createParticleSystem = (): ParticleSystem => {
  return new ParticleSystem();
};

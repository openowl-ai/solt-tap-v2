import Phaser from 'phaser';
import { COLORS } from '../constants';

export class RippleEffect {
  private scene: Phaser.Scene;
  private x: number;
  private y: number;
  private rings: Phaser.GameObjects.Arc[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;
  }

  play(duration: number = 200): Promise<void> {
    return new Promise((resolve) => {
      const ringCount = 3;
      const delay = duration / ringCount;

      for (let i = 0; i < ringCount; i++) {
        const ring = this.scene.add.circle(this.x, this.y, 25);
        ring.setDepth(1);
        this.rings.push(ring);

        // Set initial state
        ring.setScale(1);
        ring.setAlpha(0.4);
        ring.setStrokeStyle(2, COLORS.primary);
        ring.setFillStyle(COLORS.primary, 0.1);

        // Animation
        this.scene.tweens.add({
          targets: ring,
          scale: 3,
          alpha: 0,
          duration: duration,
          delay: i * delay,
          ease: 'Cubic.easeOut',
          onComplete: () => {
            ring.destroy();
            if (i === ringCount - 1) {
              resolve();
            }
          }
        });
      }
    });
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  destroy(): void {
    this.rings.forEach(ring => ring.destroy());
    this.rings = [];
  }
}

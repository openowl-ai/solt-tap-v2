import Phaser from 'phaser';
import { COLORS } from '../constants';

export class GlowEffect {
  private scene: Phaser.Scene;
  private glow: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    
    // Create glow circle
    this.glow = scene.add.circle(x, y, 35);
    this.glow.setDepth(0);
    this.glow.setFillStyle(COLORS.primary, 0.15);
  }

  pulse(): void {
    this.scene.tweens.add({
      targets: this.glow,
      alpha: { from: 0.15, to: 0.25 },
      scale: { from: 0.9, to: 1.2 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  setVisible(visible: boolean): void {
    this.glow.setVisible(visible);
  }

  setPosition(x: number, y: number): void {
    this.glow.setPosition(x, y);
  }

  destroy(): void {
    this.glow.destroy();
  }
}

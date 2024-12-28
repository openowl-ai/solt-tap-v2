import Phaser from 'phaser';
import { COLORS, GAME_CONFIG } from '../constants';

export class TransitionManager {
  private scene: Phaser.Scene;
  private levelText: Phaser.GameObjects.Text;
  private overlay: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.setupOverlay();
    this.setupLevelText();
  }

  private setupOverlay() {
    this.overlay = this.scene.add.rectangle(
      0, 0,
      this.scene.cameras.main.width,
      this.scene.cameras.main.height,
      0x000000, 0
    );
    this.overlay.setOrigin(0);
    this.overlay.setDepth(100);
  }

  private setupLevelText() {
    this.levelText = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY,
      '',
      GAME_CONFIG.levelTextStyle
    );
    this.levelText.setOrigin(0.5);
    this.levelText.setDepth(101);
    this.levelText.setAlpha(0);
  }

  showLevelStart(level: number): Promise<void> {
    return new Promise((resolve) => {
      // Fade in overlay
      this.scene.tweens.add({
        targets: this.overlay,
        alpha: 0.7,
        duration: 500,
        onComplete: () => {
          // Show level text
          this.levelText.setText(`Level ${level}`);
          this.scene.tweens.add({
            targets: this.levelText,
            alpha: 1,
            duration: 500,
            onComplete: () => {
              // Wait and fade everything out
              this.scene.time.delayedCall(GAME_CONFIG.levelStartDelay, () => {
                this.scene.tweens.add({
                  targets: [this.overlay, this.levelText],
                  alpha: 0,
                  duration: 500,
                  onComplete: resolve
                });
              });
            }
          });
        }
      });
    });
  }

  showSuccess(): Promise<void> {
    return new Promise((resolve) => {
      this.levelText.setText('Perfect!');
      this.levelText.setColor('#00FF00');
      
      this.scene.tweens.add({
        targets: this.levelText,
        alpha: 1,
        duration: 300,
        yoyo: true,
        onComplete: () => {
          this.levelText.setColor(GAME_CONFIG.levelTextStyle.color);
          resolve();
        }
      });
    });
  }

  showFailure(): Promise<void> {
    return new Promise((resolve) => {
      this.overlay.setAlpha(0.7);
      this.levelText.setText('Try Again!');
      this.levelText.setColor('#FF0000');
      this.levelText.setScale(1);
      
      this.scene.tweens.add({
        targets: this.levelText,
        alpha: 1,
        scale: 1.2,
        duration: 500,
        onComplete: () => {
          this.scene.time.delayedCall(1000, () => {
            this.scene.tweens.add({
              targets: [this.overlay, this.levelText],
              alpha: 0,
              scale: 1,
              duration: 500,
              onComplete: () => {
                this.levelText.setColor(GAME_CONFIG.levelTextStyle.color);
                resolve();
              }
            });
          });
        }
      });
    });
  }
}

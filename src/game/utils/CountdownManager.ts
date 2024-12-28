import Phaser from 'phaser';
import { COLORS } from '../constants';

export class CountdownManager {
  private scene: Phaser.Scene;
  private countdownText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.countdownText = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY,
      '',
      {
        fontSize: '64px',
        color: '#14F195',
        fontFamily: 'Arial'
      }
    ).setOrigin(0.5).setDepth(1000).setAlpha(0);
  }

  async showCountdown(): Promise<void> {
    return new Promise<void>((resolve) => {
      const countdown = async (num: number) => {
        if (num === 0) {
          this.countdownText.setText('GO!');
          this.countdownText.setColor('#9945FF');
        } else {
          this.countdownText.setText(num.toString());
          this.countdownText.setColor('#14F195');
        }

        // Show and scale animation
        this.scene.tweens.add({
          targets: this.countdownText,
          alpha: 1,
          scale: 1.2,
          duration: 200,
          onComplete: () => {
            // Fade out animation
            this.scene.tweens.add({
              targets: this.countdownText,
              alpha: 0,
              scale: 1,
              duration: 300,
              onComplete: () => {
                if (num > 0) {
                  countdown(num - 1);
                } else {
                  resolve();
                }
              }
            });
          }
        });
      };

      countdown(3);
    });
  }

  resize(width: number, height: number) {
    this.countdownText.setPosition(width / 2, height / 2);
  }
}

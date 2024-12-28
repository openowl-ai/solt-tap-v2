import Phaser from 'phaser';
    import { COLORS } from '../constants';
    import { Logger } from '../../utils/Logger';

    export class Circle {
      private scene: Phaser.Scene;
      private baseCircle: Phaser.GameObjects.Arc;
      private innerCircle: Phaser.GameObjects.Arc;
      private logger: Logger;
      private isExpertMode: boolean;
      private x: number;
      private y: number;
      private radius: number;
      private isActive = false;
      private hitAreaMargin: number = 0.20;
      private rippleEffect: RippleEffect;

      constructor(scene: Phaser.Scene, x: number, y: number, isExpertMode: boolean) {
        this.scene = scene;
        this.isExpertMode = isExpertMode;
        this.logger = new Logger('Circle');
        this.x = x;
        this.y = y;
        this.radius = 25;
        this.isActive = false;

        // Create circles in inactive state
        this.baseCircle = scene.add.circle(x, y, this.radius);
        this.baseCircle.setDepth(2);
        this.innerCircle = scene.add.circle(x, y, 22);
        this.innerCircle.setDepth(3);
        this.rippleEffect = new RippleEffect(scene, x, y);
        
        // Initialize state
        this.setInactiveState();
        this.setVisible(!isExpertMode);
        
        this.logger.info(`${isExpertMode ? 'Expert' : 'Novice'} mode circle created, setting ${isExpertMode ? 'invisible' : 'visible'}`);

        this.setupInputHandlers();
      }

      private setupInputHandlers(): void {
        this.baseCircle.setInteractive();
        this.baseCircle.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
          if (this.baseCircle.visible) {
            this.playTapAnimation();
          }
        });
      }

      setInactiveState(): void {
        this.isActive = false;
        this.baseCircle.setStrokeStyle(3, COLORS.secondary);
        this.baseCircle.setFillStyle(COLORS.secondary, 0.1);
        this.innerCircle.setFillStyle(COLORS.primary, 0.2);
      }

      setActiveState(): void {
        this.isActive = true;
        this.baseCircle.setStrokeStyle(3, COLORS.primary);
        this.baseCircle.setFillStyle(COLORS.primary, 0.3);
        this.innerCircle.setFillStyle(COLORS.secondary, 0.8);
      }

      async activate(duration: number = 500): Promise<void> {
        this.logger.info(`Activating circle at x: ${this.x}, y: ${this.y}`);
        this.setVisible(false);
        await new Promise(resolve => {
          this.scene.time.delayedCall(100, () => {
            this.setVisible(true);
            this.setActiveState();
            this.scene.time.delayedCall(duration, () => {
              if (this.isExpertMode) {
                this.setVisible(false);
              } else {
                this.setInactiveState();
              }
              resolve();
            });
          });
        });
      }

      async playTapAnimation(duration: number = 200): Promise<void> {
        this.logger.info('Playing tap animation');
        if (!this.baseCircle.visible) {
          this.logger.warn('Tap animation skipped, circle not visible');
          return;
        }
        this.setActiveState();
        
        // Play ripple effect
        await this.rippleEffect.play(duration);
        
        // Reset state after animation
        if (!this.isExpertMode) {
          this.setInactiveState();
        } else {
          this.setVisible(false);
        }
      }

      setExpertModeVisibility(visible: boolean): void {
        if (this.isExpertMode) {
          this.logger.info(`Setting expert mode circle visibility to ${visible}`);
          this.setVisible(visible);
          if (visible) {
            this.setActiveState();
          } else {
            this.setInactiveState();
          }
        }
      }

      setVisible(visible: boolean): void {
        this.logger.info(`Setting circle visibility to ${visible}`);
        this.baseCircle.setVisible(visible);
        this.innerCircle.setVisible(visible);
      }

      setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.baseCircle.setPosition(x, y);
        this.innerCircle.setPosition(x, y);
        this.rippleEffect.setPosition(x, y);
      }

      isPointInside(x: number, y: number): boolean {
        const distance = Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
        return distance <= this.radius * (1 + this.hitAreaMargin);
      }

      destroy(): void {
        this.baseCircle.destroy();
        this.innerCircle.destroy();
        this.rippleEffect.destroy();
      }
    }

    class RippleEffect {
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
          const maxScale = 3 + (duration / 200);

          for (let i = 0; i < ringCount; i++) {
            const ring = this.scene.add.circle(this.x, this.y, 25);
            ring.setDepth(1);
            this.rings.push(ring);

            // Set initial state
            ring.setScale(1);
            ring.setAlpha(0.4);
            ring.setStrokeStyle(2, i === 0 ? COLORS.primary : COLORS.secondary);
            ring.setFillStyle(i === 0 ? COLORS.primary : COLORS.secondary, 0.1);

            // Animation
            this.scene.tweens.add({
              targets: ring,
              scale: maxScale,
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

import Phaser from 'phaser';
    import { Pattern, DifficultyMode } from '../types';
    import { AudioManager } from './audioManager';
    import { Circle } from '../components/Circle';
    import { Logger } from '../../utils/Logger';

    export class PatternManager {
      private scene: Phaser.Scene;
      private audioManager: AudioManager;
      private circles: Circle[];
      private difficulty: DifficultyMode;
      private logger: Logger;

      constructor(scene: Phaser.Scene, circles: Circle[], audioManager: AudioManager, difficulty: DifficultyMode) {
        this.scene = scene;
        this.circles = circles;
        this.audioManager = audioManager;
        this.difficulty = difficulty;
        this.logger = new Logger('PatternManager');
        
        if (this.difficulty === 'expert') {
          this.circles.forEach(circle => circle.setVisible(false));
        }
      }

      async showPattern(patterns: Pattern[]): Promise<void> {
        this.logger.info('Showing pattern:', patterns);
        
        for (const pattern of patterns) {
          const circle = this.circles[pattern.index];
      
          // Play sound slightly before visual feedback
          const soundPromise = this.audioManager.playTapSound(pattern.index);
          this.logger.info(`Activating circle ${pattern.index} with type ${pattern.type} and duration ${pattern.duration}`);
      
          if (this.difficulty === 'expert') {
            circle.setExpertModeVisibility(true); // Show circle in expert mode
          }
      
          const duration = pattern.type === 'hold' ? (pattern.duration || 500) : 500;
          circle.activate(duration);
      
          await Promise.all([
            soundPromise,
            new Promise(resolve => this.scene.time.delayedCall(pattern.type === 'hold' ? pattern.duration : 500, resolve))
          ]);
      
          if (this.difficulty === 'expert') {
            circle.setExpertModeVisibility(false); // Hide circle in expert mode after delay
          }
      
          // Wait for the circle to be activated before moving to the next one
          await new Promise(resolve => this.scene.time.delayedCall(500, resolve));
        }
      }

      async highlightCircle(index: number, type: Pattern['type'], duration: number = 200) {
        const circle = this.circles[index];
        
        // Synchronize visual and audio feedback
        const soundPromise = this.audioManager.playTapSound(index);
        await Promise.all([
          circle.playTapAnimation(duration),
          soundPromise
        ]);
      }
    }

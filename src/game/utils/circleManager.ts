import Phaser from 'phaser';
    import { Circle } from '../components/Circle';
    import { GAME_CONFIG } from '../constants';

    export class CircleManager {
      private scene: Phaser.Scene;
      private circles: Circle[] = [];
      private isExpertMode: boolean;

      constructor(scene: Phaser.Scene, isExpertMode: boolean) {
        this.scene = scene;
        this.isExpertMode = isExpertMode;
      }

      createCircles(width: number, height: number): Circle[] {
        const positions = this.generatePositions(width, height);
        
        this.circles = positions.map(pos => 
          new Circle(this.scene, pos.x, pos.y, this.isExpertMode)
        );
        
        return this.circles;
      }

      private generatePositions(width: number, height: number): Array<{x: number, y: number}> {
        const positions: Array<{x: number, y: number}> = [];
        
        for (let i = 0; i < GAME_CONFIG.circleCount; i++) {
          let validPosition = false;
          let pos;
          
          do {
            pos = {
              x: Phaser.Math.Between(GAME_CONFIG.circlePadding, width - GAME_CONFIG.circlePadding),
              y: Phaser.Math.Between(GAME_CONFIG.circlePadding, height - GAME_CONFIG.circlePadding)
            };
            
            validPosition = positions.every(existing => 
              Phaser.Math.Distance.Between(existing.x, existing.y, pos.x, pos.y) > 
              GAME_CONFIG.minCircleSpacing
            );
          } while (!validPosition);
          
          positions.push(pos);
        }
        
        return positions;
      }

      resize(width: number, height: number): void {
        const positions = this.generatePositions(width, height);
        this.circles.forEach((circle, index) => {
          circle.setPosition(positions[index].x, positions[index].y);
        });
      }

      destroy(): void {
        this.circles.forEach(circle => circle.destroy());
        this.circles = [];
      }
    }

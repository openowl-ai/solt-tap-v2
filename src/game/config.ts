import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';
import { MenuScene } from './scenes/MenuScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 320,
      height: 480
    },
    max: {
      width: 1920,
      height: 1080
    }
  },
  scene: [MenuScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  }
};

import Phaser from 'phaser';
    import { COLORS, GAME_CONFIG } from '../constants';
    import { DifficultyMode } from '../types';

    export class MenuScene extends Phaser.Scene {
      constructor() {
        super({ key: 'MenuScene' });
      }

      create() {
        const { width, height } = this.cameras.main;
        
        // Title
        const title = this.add.text(width / 2, height / 3, 'Rhythm Game', {
          fontSize: '48px',
          color: '#14F195',
          fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Create mode selection buttons
        this.createModeButton(width / 2, height / 2, 'Novice Mode', 'novice');
        this.createModeButton(width / 2, height / 2 + GAME_CONFIG.menuButtonHeight + 20, 'Expert Mode', 'expert');

        // Instructions
        const instructions = this.add.text(width / 2, height * 0.8, 
          'Novice: Circles always visible\nExpert: Circles only visible when active', {
          fontSize: '24px',
          color: '#9945FF',
          fontFamily: 'Arial',
          align: 'center'
        }).setOrigin(0.5);
      }

      private createModeButton(x: number, y: number, text: string, mode: DifficultyMode) {
        const button = this.add.rectangle(
          x,
          y,
          GAME_CONFIG.menuButtonWidth,
          GAME_CONFIG.menuButtonHeight,
          COLORS.button
        );

        const buttonText = this.add.text(x, y, text, GAME_CONFIG.menuTextStyle)
          .setOrigin(0.5);

        button.setInteractive()
          .on('pointerover', () => button.setAlpha(0.8))
          .on('pointerout', () => button.setAlpha(1))
          .on('pointerdown', () => this.startGame(mode));
      }

      private startGame(mode: DifficultyMode) {
        this.scene.start('MainScene', { difficulty: mode });
      }
    }

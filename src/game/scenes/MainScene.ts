import Phaser from 'phaser';
import { Pattern, DifficultyMode } from '../types';
import { COLORS, GAME_CONFIG } from '../constants';
import { PatternGenerator } from '../utils/patternGenerator';
import { AudioManager } from '../utils/audioManager';
import { RewardSystem } from '../utils/rewardSystem';
import { CircleManager } from '../utils/circleManager';
import { TransitionManager } from '../utils/transitionManager';
import { BackgroundManager } from '../utils/BackgroundManager';
import { UIManager } from '../utils/UIManager';
import { PatternManager } from '../utils/PatternManager';
import { HitDetection } from '../utils/hitDetection';
import { CountdownManager } from '../utils/CountdownManager';
import { Logger } from '../../utils/Logger';
import { Circle } from '../components/Circle';

export class MainScene extends Phaser.Scene {
    private patterns: Pattern[] = [];
    private playerSequence: Pattern[] = [];
    private circles: Circle[] = [];
    private isShowingPattern = false;
    private currentLevel: number = 1;
    private audioManager: AudioManager;
    private rewardSystem: RewardSystem;
    private circleManager: CircleManager;
    private transitionManager: TransitionManager;
    private backgroundManager: BackgroundManager;
    private uiManager: UIManager;
    private patternManager: PatternManager;
    private countdownManager: CountdownManager;
    private canInput = false;
    private difficulty: DifficultyMode = 'novice';
    private logger: Logger;
    private pointerDownTime: number = 0;

    constructor() {
        super({ key: 'MainScene' });
        this.audioManager = new AudioManager();
        this.rewardSystem = new RewardSystem();
        this.logger = new Logger('MainScene');
    }

    init(data: { difficulty: DifficultyMode, devMode?: boolean, devLevel?: number, longPressEnabled?: boolean }) {
        this.difficulty = data.difficulty;
        this.currentLevel = 1;
        this.patterns = [];
        this.playerSequence = [];
        this.isShowingPattern = false;
        this.canInput = false;
    }

    create() {
        this.setupManagers();
        this.setupEventListeners();
        this.startNewLevel();

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.pointerDownTime = pointer.downTime;
            this.handlePointerDown(pointer);
        });

        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            this.handlePointerUp(pointer);
        });
    }

    private setupManagers() {
        this.backgroundManager = new BackgroundManager(this);
        this.circleManager = new CircleManager(this, this.difficulty === 'expert');
        this.circles = this.circleManager.createCircles(
            this.cameras.main.width,
            this.cameras.main.height
        );

        this.transitionManager = new TransitionManager(this);
        this.uiManager = new UIManager(
            this,
            () => this.handleTryAgain(),
            () => this.returnToMenu()
        );

        this.patternManager = new PatternManager(
            this,
            this.circles,
            this.audioManager,
            this.difficulty
        );

        this.countdownManager = new CountdownManager(this);
    }

    private setupEventListeners() {
        // Set up resize handler
        this.scale.on('resize', this.handleResize, this);
    }

    private handleResize = (gameSize: Phaser.Structs.Size) => {
        const width = gameSize.width;
        const height = gameSize.height;

        this.cameras.main.setViewport(0, 0, width, height);
        this.backgroundManager?.resize(width, height);
        this.circleManager?.resize(width, height);
        this.uiManager?.resize(width, height);
        this.countdownManager?.resize(width, height);
    }

    private async startNewLevel() {
        try {
            const response = await fetch('/api/game/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ difficulty: this.difficulty })
            });
    
            if (!response.ok) {
                throw new Error('Failed to start a new game');
            }
    
            const data = await response.json();
            this.patterns = data.pattern;
            this.playerSequence = [];
            this.canInput = false;
    
            this.uiManager.updateLevel(this.currentLevel);
            this.uiManager.updateTokens(this.rewardSystem.getTokenBalance());
    
            await this.transitionManager.showLevelStart(this.currentLevel);
            await this.showPattern();
            this.canInput = true;
        } catch (error) {
            this.logger.error('Error starting a new level:', error);
        }
    }

    private async showPattern() {
        this.isShowingPattern = true;
        this.canInput = false;
        this.logger.info('showPattern called');
        await this.patternManager.showPattern(this.patterns);
        this.isShowingPattern = false;
        this.canInput = true;
    }

    private handlePointerDown(pointer: Phaser.Input.Pointer) {
        if (!this.canInput || this.isShowingPattern) {
            this.logger.info('Pointer down ignored - input locked');
            return;
        }

        this.logger.info(`Pointer down at x: ${pointer.x}, y: ${pointer.y}`);

        let clickedCircleIndex = -1;
        for (let i = 0; i < this.circles.length; i++) {
            const circle = this.circles[i];
            if (circle.isPointInside(pointer.x, pointer.y)) {
                clickedCircleIndex = i;
                break;
            }
        }

        if (clickedCircleIndex === -1) {
            this.logger.info('Pointer down outside of any circle');
            return;
        }

        const currentPattern = this.patterns[this.playerSequence.length];
        
    }

    private async handlePointerUp(pointer: Phaser.Input.Pointer) {
        if (!this.canInput || this.isShowingPattern) {
            this.logger.info('Pointer up ignored - input locked');
            return;
        }

        this.logger.info(`Pointer up at x: ${pointer.x}, y: ${pointer.y}`);

        let clickedCircleIndex = -1;
        for (let i = 0; i < this.circles.length; i++) {
            const circle = this.circles[i];
            if (circle.isPointInside(pointer.x, pointer.y)) {
                clickedCircleIndex = i;
                break;
            }
        }

        if (clickedCircleIndex === -1) {
            this.logger.info('Pointer up outside of any circle');
            return;
        }

        const duration = pointer.upTime - this.pointerDownTime;

        

        this.handleCircleClick(clickedCircleIndex, pointer, duration);
    }

    private async handleCircleClick(index: number, pointer: Phaser.Input.Pointer, duration: number) {
        this.logger.info(`Handling click for circle index: ${index}, duration: ${duration}`);

        // Play the sound when a circle is clicked
        this.audioManager.playTapSound(index);

        // Immediately show the circle when clicked
        const circle = this.circles[index];
        circle.setVisible(true);
        circle.setActiveState();
        circle.playTapAnimation();

        const currentPattern = this.patterns[this.playerSequence.length];

        if (!currentPattern) {
            this.logger.warn('No current pattern found');
            return;
        }

        const playerPattern: Pattern = {
            index,
            type: currentPattern.type,
            ...(currentPattern.type === 'hold' && { duration: currentPattern.duration }),
            ...(currentPattern.type === 'rapid' && { count: currentPattern.count })
        };

        this.playerSequence.push(playerPattern);

        if (index !== currentPattern.index) {
            this.logger.info(`Incorrect circle clicked. Expected: ${currentPattern.index}, Actual: ${index}`);
            await this.handleFailure();
            return;
        }

        this.logger.info(`Correct circle clicked. Expected: ${currentPattern.index}, Actual: ${index}`);

        if (this.playerSequence.length === this.patterns.length) {
            await this.handleSuccess();
        }
    }

    private async handleSuccess() {
        this.canInput = false;
        await this.transitionManager.showSuccess();
        const reward = this.rewardSystem.calculateReward(this.currentLevel, true);
        this.currentLevel++;
        this.logger.info(`Level ${this.currentLevel - 1} completed, starting level ${this.currentLevel}`);
        this.uiManager.updateTokens(this.rewardSystem.getTokenBalance());
        await this.startNewLevel();
    }

    private async handleFailure() {
        try {
            this.canInput = false;
            this.isShowingPattern = true;

            // Show failure message
            await this.transitionManager.showFailure();
            
            // Reset player state
            this.playerSequence = [];
            
            // Reset circles
            this.circles.forEach(circle => {
                circle.setActiveState(false);
                circle.setVisible(this.difficulty === 'novice');
            });

            // Wait before restarting level
            await new Promise(resolve => this.time.delayedCall(1000, resolve));
            
            // Restart level with new pattern
            await this.startNewLevel();

            // Re-enable input after level restart
            this.isShowingPattern = false;
            this.canInput = true;
        } catch (error) {
            console.error('Error in handleFailure:', error);
            this.isShowingPattern = false;
            this.canInput = true;
        }
    }

    private async handleTryAgain() {
        if (this.isShowingPattern) return;

        if (this.rewardSystem.deductTryAgainCost()) {
            this.uiManager.updateTokens(this.rewardSystem.getTokenBalance());
            this.playerSequence = [];
            this.canInput = false;

            // Reset the current level to the same level
            this.logger.info(`Retrying level ${this.currentLevel}`);
            this.patterns = PatternGenerator.generate(this.currentLevel, GAME_CONFIG.circleCount, this.difficulty);

            await this.countdownManager.showCountdown();
            await this.showPattern();
            this.canInput = true;
        }
    }

    private returnToMenu() {
        this.scene.start('MenuScene');
    }

    update() {
        this.backgroundManager?.update();
    }
}

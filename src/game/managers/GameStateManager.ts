import { EventEmitter } from 'events';
import { PatternController } from '../controllers/PatternController';
import { ButtonController } from '../controllers/ButtonController';
import { PatternValidator } from '../validators/PatternValidator';
import { Pattern, GameState } from '../types';

export class GameStateManager extends EventEmitter {
  private patternController: PatternController;
  private buttonController: ButtonController;
  private playerSequence: Pattern[] = [];
  private currentLevel: number = 1;
  private canInput: boolean = false;

  constructor(
    patternController: PatternController,
    buttonController: ButtonController
  ) {
    super();
    this.patternController = patternController;
    this.buttonController = buttonController;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.buttonController.on('tryAgainInitiated', () => {
      this.resetPlayerSequence();
      this.emit('prepareReplay');
    });

    this.patternController.on('patternShowingChanged', (isShowing: boolean) => {
      this.canInput = !isShowing;
      this.buttonController.setEnabled(!isShowing);
    });
  }

  handleInput(input: Pattern): void {
    if (!this.canInput) return;

    const currentPattern = this.patternController.getCurrentPattern();
    const currentIndex = this.playerSequence.length;

    if (currentIndex >= currentPattern.length) return;

    this.playerSequence.push(input);
    
    const isValid = PatternValidator.validateSingleInput(
      currentPattern[currentIndex],
      input
    );

    if (!isValid) {
      this.patternController.updateGameState({ levelFailed: true });
      this.emit('patternFailed');
      this.canInput = false;
      return;
    }

    if (this.playerSequence.length === currentPattern.length) {
      this.patternController.updateGameState({ levelCompleted: true });
      this.emit('patternCompleted');
      this.advanceLevel();
    }
  }

  private advanceLevel(): void {
    this.currentLevel++;
    this.resetPlayerSequence();
    this.emit('levelAdvanced', this.currentLevel);
  }

  private resetPlayerSequence(): void {
    this.playerSequence = [];
  }

  getCurrentLevel(): number {
    return this.currentLevel;
  }

  getPlayerSequence(): Pattern[] {
    return [...this.playerSequence];
  }

  getGameState(): GameState {
    return this.patternController.getGameState();
  }
}

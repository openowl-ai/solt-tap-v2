import { EventEmitter } from 'events';
import { Pattern, GameState, DifficultyMode } from '../types';
import { PatternGenerator } from '../utils/patternGenerator';
import { GAME_CONFIG } from '../constants';

export class PatternController extends EventEmitter {
  private currentPattern: Pattern[] = [];
  private gameState: GameState;
  private isShowingPattern = false;

  constructor(difficulty: DifficultyMode) {
    super();
    this.gameState = {
      difficulty,
      score: 0,
      bestScore: 0,
      isPlaying: false,
      levelFailed: false,
      levelCompleted: false
    };
  }

  generateNewPattern(level: number): Pattern[] {
    this.currentPattern = PatternGenerator.generate(level, GAME_CONFIG.circleCount, this.gameState.difficulty);
    this.emit('patternGenerated', this.currentPattern);
    return this.currentPattern;
  }

  getCurrentPattern(): Pattern[] {
    return this.currentPattern;
  }

  setShowingPattern(isShowing: boolean): void {
    this.isShowingPattern = isShowing;
    this.emit('patternShowingChanged', isShowing);
  }

  isPatternShowing(): boolean {
    return this.isShowingPattern;
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  updateGameState(newState: Partial<GameState>): void {
    this.gameState = { ...this.gameState, ...newState };
    this.emit('gameStateChanged', this.gameState);
  }

  reset(): void {
    this.currentPattern = [];
    this.isShowingPattern = false;
    this.emit('reset');
  }
}

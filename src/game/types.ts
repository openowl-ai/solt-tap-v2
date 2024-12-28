export type PatternType = 'tap' | 'hold' | 'rapid';
export type DifficultyMode = 'novice' | 'expert';

export interface Pattern {
  index: number;
  type: PatternType;
  duration?: number; // For hold patterns
  count?: number;    // For rapid tap patterns
}

export interface CircleConfig {
  x: number;
  y: number;
  radius: number;
  color: number;
}

export interface GameState {
  difficulty: DifficultyMode;
  score: number;
  bestScore: number;
  isPlaying: boolean;
}

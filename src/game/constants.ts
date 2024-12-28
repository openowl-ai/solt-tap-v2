export const COLORS = {
  primary: 0x14F195,    // Solana green
  secondary: 0x9945FF,  // Solana purple
  inactive: 0x333333,
  background: 0x000000,
  success: 0x00FF00,    // Success green
  error: 0xFF0000,      // Error red
  button: 0x14F195,     // Button color
  menuText: 0xFFFFFF    // Menu text color
};

export const AudioNotes = {
  tap: [261.63, 329.63, 392.00, 493.88],
  hold: [523.25, 659.25, 783.99, 987.77],
  rapid: [130.81, 164.81, 196.00, 246.94]
};

export const REWARDS = {
  baseTokens: 10,
  multiplierPerLevel: 1.5,
  bonusForPerfect: 50,
  tryAgainCost: 5      // Cost to try again
};

export const GAME_CONFIG = {
  circleCount: 4,
  speedMultiplier: 1.1,  // Speed increases per level
  basePatternDelay: 500, // Base delay between patterns
  minPatternDelay: 200,  // Minimum delay between patterns
  minCircleSpacing: 100,
  circlePadding: 100,
  circleRadius: 40,
  levelTransitionDelay: 2000,    // Time between levels in ms
  patternShowDelay: 500,         // Delay between showing each pattern
  levelStartDelay: 1500,         // Delay before starting new level
  menuButtonWidth: 200,
  menuButtonHeight: 50,
  menuButtonSpacing: 20,
  levelTextStyle: {
    fontSize: '64px',
    color: '#14F195',
    fontFamily: 'Arial'
  },
  menuTextStyle: {
    fontSize: '32px',
    color: '#FFFFFF',
    fontFamily: 'Arial'
  }
};

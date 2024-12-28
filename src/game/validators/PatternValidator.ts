import { Pattern } from '../types';

export class PatternValidator {
  static validatePattern(expected: Pattern[], actual: Pattern[]): boolean {
    if (actual.length > expected.length) return false;

    return actual.every((pattern, index) => 
      this.comparePatterns(pattern, expected[index])
    );
  }

  static validateSingleInput(expected: Pattern, actual: Pattern): boolean {
    return this.comparePatterns(expected, actual);
  }

  private static comparePatterns(pattern1: Pattern, pattern2: Pattern): boolean {
    if (pattern1.index !== pattern2.index) return false;
    if (pattern1.type !== pattern2.type) return false;
    
    const tolerance = 100; // 100ms tolerance for timing
    
    switch (pattern1.type) {
      case 'hold':
        return Math.abs((pattern1.duration || 0) - (pattern2.duration || 0)) <= tolerance;
      case 'rapid':
        return pattern1.count === pattern2.count;
      default:
        return true;
    }

    switch (pattern1.type) {
      case 'hold':
        return pattern1.duration === pattern2.duration;
      case 'rapid':
        return pattern1.count === pattern2.count;
      default:
        return true;
    }
  }
}

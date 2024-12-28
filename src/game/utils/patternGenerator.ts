import { Pattern, PatternType } from '../types';
    import { Logger } from '../../utils/Logger';

    export class PatternGenerator {
      private static logger = new Logger('PatternGenerator');

      static generate(level: number, circleCount: number, difficulty: DifficultyMode = 'novice'): Pattern[] {
        if (level < 1) {
          PatternGenerator.logger.error('Invalid level:', level);
          level = 1;
        }
        
        if (circleCount < 1) {
          PatternGenerator.logger.error('Invalid circle count:', circleCount);
          circleCount = 4;
        }

        const patterns: Pattern[] = [];
        let patternLength = level === 1 ? 3 : Math.min(3 + Math.floor(level / 2), 10);
        if (level == 2) {
          patternLength = 4;
        }

        
        for (let i = 0; i < patternLength; i++) {
          const type = this.getPatternType(level, difficulty);
          const index = Math.floor(Math.random() * circleCount);
          
          const pattern: Pattern = {
            index,
            type
          };

          patterns.push(pattern);
          PatternGenerator.logger.info(`Generated pattern for level ${level}: ${JSON.stringify(pattern)}`);
        }
        
        return patterns;
      }

      private static getPatternType(level: number, difficulty: DifficultyMode): PatternType {
        PatternGenerator.logger.info(`getPatternType level: ${level}`);
        if (level === 1) return 'tap';
        if (level === 2) return Math.random() < 0.9 ? 'tap' : 'hold';
        if (level < 5) return Math.random() < 0.7 ? 'tap' : 'hold';
        if (level < 8) return Math.random() < 0.6 ? 'tap' : Math.random() < 0.8 ? 'hold' : 'rapid';
        return Math.random() < 0.4 ? 'tap' : Math.random() < 0.7 ? 'hold' : 'rapid';

        const rand = Math.random();
        if (level === 2) {
          PatternGenerator.logger.info(`Level 2 pattern type: ${rand < 0.95 ? 'tap' : 'hold'}`);
          return 'tap';
        }
        if (level < 5) {
          PatternGenerator.logger.info(`Level ${level} pattern type: ${rand < 0.8 ? 'tap' : 'hold'}`);
          return 'tap'; // More taps in early levels
        }
        
        PatternGenerator.logger.info(`Level ${level} pattern type: ${rand < 0.6 ? 'tap' : rand < 0.9 ? 'hold' : 'rapid'}`);
        return 'tap';
      }
    }

import TelegramBot from 'node-telegram-bot-api';
import { Logger } from '../../utils/Logger';

export class TelegramService {
  private bot: TelegramBot;
  private logger: Logger;

  constructor(botToken: string) {
    this.bot = new TelegramBot(botToken);
    this.logger = new Logger('TelegramService');
  }

  async updateScore(userId: number, score: number): Promise<void> {
    try {
      await this.bot.setGameScore(userId, score, { force: true });
      this.logger.info(`Updated score for user ${userId}: ${score}`);
    } catch (error) {
      this.logger.error('Error updating score:', error);
      throw new Error('Failed to update score via Telegram API');
    }
  }
}

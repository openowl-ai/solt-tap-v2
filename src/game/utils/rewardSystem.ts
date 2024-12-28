import { REWARDS } from '../constants';
import { TelegramService } from '../services/TelegramService';

export class RewardSystem {
  private tokenBalance: number = 0;
  private telegramService: TelegramService;
  private userId?: number;

  constructor() {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.error('Telegram bot token is not set. Score updates will be disabled.');
    }
    this.telegramService = new TelegramService(botToken || '');
    this.userId = Number(new URLSearchParams(window.location.search).get('userId'));
  }

  calculateReward(level: number, isPerfect: boolean): number {
    const baseReward = REWARDS.baseTokens * Math.pow(REWARDS.multiplierPerLevel, level - 1);
    const reward = isPerfect ? baseReward + REWARDS.bonusForPerfect : baseReward;
    this.tokenBalance += reward;
    
    if (this.userId) {
      this.telegramService.updateScore(this.userId, this.tokenBalance);
    }
    
    return reward;
  }

  deductTryAgainCost(): boolean {
    if (this.tokenBalance >= REWARDS.tryAgainCost) {
      this.tokenBalance -= REWARDS.tryAgainCost;
      return true;
    }
    return false;
  }

  getTokenBalance(): number {
    return this.tokenBalance;
  }
}

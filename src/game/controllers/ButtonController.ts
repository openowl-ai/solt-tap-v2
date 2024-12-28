import { EventEmitter } from 'events';
import { RewardSystem } from '../utils/rewardSystem';

export class ButtonController extends EventEmitter {
  private rewardSystem: RewardSystem;
  private isEnabled: boolean = true;

  constructor(rewardSystem: RewardSystem) {
    super();
    this.rewardSystem = rewardSystem;
  }

  async handleTryAgain(): Promise<boolean> {
    if (!this.isEnabled) return false;

    if (this.rewardSystem.deductTryAgainCost()) {
      this.emit('tryAgainInitiated');
      return true;
    }

    this.emit('insufficientTokens');
    return false;
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    this.emit('enabledChanged', enabled);
  }

  isButtonEnabled(): boolean {
    return this.isEnabled;
  }
}

import { SoundManager } from '../audio/SoundManager';

export class AudioManager {
  private soundManager: SoundManager;
  
  constructor() {
    this.soundManager = new SoundManager();
  }

  playTapSound(index: number) {
    this.soundManager.playDotSound(index);
  }

  playHoldSound(index: number) {
    this.soundManager.playDotSound(index);
  }

  playRapidSound(index: number) {
    this.soundManager.playDotSound(index);
  }

  cleanup() {
    this.soundManager.cleanup();
  }
}

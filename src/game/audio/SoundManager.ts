import * as Tone from 'tone';
    import { Logger } from '../../utils/Logger';

    export class SoundManager {
      private synth: Tone.PolySynth;
      private notes: string[];
      private logger: Logger;
      private isInitialized = false;

      constructor() {
        this.logger = new Logger('SoundManager');
        // Expand the notes array with more tones
        this.notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5'];
      }

      private async initializeSynth() {
        if (this.isInitialized) return;
        
        try {
          await Tone.start();
          Tone.context.lookAhead = 0.01;

          this.synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'sine' },
            envelope: {
              attack: 0.005,
              decay: 0.1,
              sustain: 0.3,
              release: 0.5
            },
            volume: -12
          }).toDestination();

          this.isInitialized = true;
        } catch (error) {
          this.logger.error('Error initializing sound manager:', error);
        }
      }

      async playDotSound(dotIndex: number): Promise<void> {
        try {
          if (!this.isInitialized) {
            await this.initializeSynth();
          }
          
          const note = this.notes[dotIndex % this.notes.length];
          this.synth?.triggerAttackRelease(note, '0.2', Tone.now());
        } catch (error) {
          this.logger.error('Error playing dot sound:', error);
        }
      }

      cleanup(): void {
        if (this.synth) {
          this.synth.dispose();
        }
        this.isInitialized = false;
      }
    }

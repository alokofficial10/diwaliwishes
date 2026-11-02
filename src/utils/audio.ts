/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API ambient festive melody generator (No external MP3s required)
class FestiveAudioService {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private masterGain: GainNode | null = null;
  public isMuted = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft temple bell / diya chime sound
  public playChime(freq = 880, duration = 1.2) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(freq, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Play sparkling firecracker pop / sparkle sound effect
  public playSparkle() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2400;
      filter.Q.value = 3.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
    } catch {
      // Ignore
    }
  }

  private muteListeners: ((muted: boolean) => void)[] = [];

  public onMuteChange(listener: (muted: boolean) => void) {
    this.muteListeners.push(listener);
    return () => {
      this.muteListeners = this.muteListeners.filter((l) => l !== listener);
    };
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.muteListeners.forEach((l) => l(this.isMuted));
    return this.isMuted;
  }
}

export const festiveAudio = new FestiveAudioService();

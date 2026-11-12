class SkySoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private isAmbientEnabled: boolean = true;
  private volume: number = 0.5;
  private ambientGain: GainNode | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;

  constructor() {
    this.isMuted = true;
    this.isAmbientEnabled = true;
    this.volume = 0.5;
  }

  private initContext() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.initContext();
      this.playChime(587.33, 880);
      this.updateAmbient();
    } else {
      this.stopAmbient();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setAmbientEnabled(enabled: boolean) {
    this.isAmbientEnabled = enabled;
    if (enabled && !this.isMuted) {
      this.initContext();
      this.updateAmbient();
    } else {
      this.stopAmbient();
    }
  }

  public getAmbientEnabled(): boolean {
    return this.isAmbientEnabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx) {
      const targetGain = !this.isMuted && this.isAmbientEnabled ? this.volume * 0.06 : 0;
      this.ambientGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.08);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  private updateAmbient() {
    if (this.isMuted || !this.isAmbientEnabled) {
      this.stopAmbient();
      return;
    }

    this.initContext();
    if (!this.ctx) return;

    if (!this.ambientSource) {
      try {
        // Create 4 seconds of looping gentle atmospheric breeze (pink noise buffer)
        const bufferSize = this.ctx.sampleRate * 4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
          b6 = white * 0.115926;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        // Gentle lowpass filter for atmospheric wind sound
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(320, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.setTargetAtTime(this.volume * 0.06, this.ctx.currentTime, 0.3);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        source.start();
        this.ambientSource = source;
        this.ambientGain = gain;
      } catch {
        // Audio playback fails gracefully
      }
    } else if (this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(this.volume * 0.06, this.ctx.currentTime, 0.1);
    }
  }

  private stopAmbient() {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
      setTimeout(() => {
        if (this.ambientSource) {
          try {
            this.ambientSource.stop();
            this.ambientSource.disconnect();
          } catch {}
          this.ambientSource = null;
        }
      }, 200);
    }
  }

  public playTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.025);

      gain.gain.setValueAtTime(0.015 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.026);
    } catch {
      // Audio playback fails gracefully
    }
  }

  public playChime(freq1: number = 523.25, freq2: number = 783.99) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Note 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq1, now);
      gain1.gain.setValueAtTime(0.03 * this.volume, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.26);

      // Note 2
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq2, now + 0.06);
      gain2.gain.setValueAtTime(0.025 * this.volume, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.36);
    } catch {
      // Audio playback fails gracefully
    }
  }
}

export const skySound = new SkySoundManager();

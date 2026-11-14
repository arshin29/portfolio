// Dynamic Multi-Track Ambient Audio System matching Thoufik reference exactly
// Tracks:
// 1. /sky/breeze-ambience.mp3 - Continuous wind breeze looping
// 2. /sky/birds-ambience.mp3 - Daylight birds chirping (plays during dawn/daytime)
// 3. /sky/night-ambience.mp3 - Crickets and night insects (plays at night, solarAltitude < -6)
// 4. /sky/rain-ambience.mp3 - Rain sound when raining
// 5. /sky/thunder-rumble.mp3 - Thunder rumbles
// 6. /sky/fireworks/burst-01..06.mp3 - Authentic firework burst sound effects

class SkySoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private isAmbientEnabled: boolean = true;
  private volume: number = 0.5;
  private hasUserInteracted: boolean = false;
  private pendingUnmute: boolean = false;

  // Audio nodes
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private effectsGain: GainNode | null = null;

  // Track buffers
  private trackBuffers: Map<string, AudioBuffer> = new Map();
  private loadingTracks: Set<string> = new Set();

  // Active playing sources
  private activeLoops: Map<string, { source: AudioBufferSourceNode; gain: GainNode }> = new Map();
  private birdTimer: any = null;
  private nightTimer: any = null;

  // Fireworks audio
  private fireworkBuffers: AudioBuffer[] = [];
  private fireworksLoaded: boolean = false;

  // Current weather & time state
  private currentSettings: {
    solarAltitude?: number;
    light?: number;
    rain?: number;
    wind?: number;
    cloud?: number;
  } = { solarAltitude: -20, light: 0.2, rain: 0, wind: 5, cloud: 0.2 };

  constructor() {
    this.isMuted = true;
    this.isAmbientEnabled = true;
    this.volume = 0.5;
    this.listenForGesture();
  }

  private listenForGesture() {
    if (typeof window === "undefined") return;
    const onGesture = () => {
      this.hasUserInteracted = true;
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      window.removeEventListener("touchstart", onGesture);

      if (this.pendingUnmute && !this.isMuted) {
        this.pendingUnmute = false;
        this.initContext();
        this.syncAmbience();
      }
    };
    window.addEventListener("pointerdown", onGesture, { passive: true });
    window.addEventListener("keydown", onGesture, { passive: true });
    window.addEventListener("touchstart", onGesture, { passive: true });
  }

  private initContext() {
    if (typeof window === "undefined") return;
    if (!this.hasUserInteracted) return;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        const comp = this.ctx.createDynamicsCompressor();
        comp.threshold.value = -12;
        comp.ratio.value = 4;
        comp.connect(this.ctx.destination);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(comp);

        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.value = 1;
        this.ambientGain.connect(this.masterGain);

        this.effectsGain = this.ctx.createGain();
        this.effectsGain.gain.value = 1;
        this.effectsGain.connect(this.masterGain);

        // Preload fireworks
        this.loadFireworks();
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  private async loadBuffer(url: string): Promise<AudioBuffer | null> {
    if (this.trackBuffers.has(url)) return this.trackBuffers.get(url)!;
    if (this.loadingTracks.has(url)) return null;
    this.loadingTracks.add(url);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      if (!this.ctx) return null;
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.trackBuffers.set(url, audioBuffer);
      return audioBuffer;
    } catch {
      return null;
    } finally {
      this.loadingTracks.delete(url);
    }
  }

  private async loadFireworks() {
    if (this.fireworksLoaded || !this.ctx) return;
    this.fireworksLoaded = true;
    for (let i = 1; i <= 6; i++) {
      const num = String(i).padStart(2, "0");
      this.loadBuffer(`/sky/fireworks/burst-${num}.mp3`).then((buf) => {
        if (buf) this.fireworkBuffers.push(buf);
      });
    }
  }

  public setWeatherState(settings: {
    solarAltitude?: number;
    light?: number;
    rain?: number;
    wind?: number;
    cloud?: number;
  }) {
    this.currentSettings = { ...this.currentSettings, ...settings };
    this.syncAmbience();
  }

  public setMuted(muted: boolean, fromUserClick: boolean = false) {
    this.isMuted = muted;
    if (fromUserClick) {
      this.hasUserInteracted = true;
    }

    if (!muted) {
      if (!this.hasUserInteracted) {
        // User hasn't clicked anything yet (e.g. auto-restored from localStorage)
        // Wait for first user gesture before activating AudioContext
        this.pendingUnmute = true;
      } else {
        this.initContext();
        this.playChime(587.33, 880);
        this.syncAmbience();
      }
    } else {
      this.pendingUnmute = false;
      this.stopAllAmbience();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setAmbientEnabled(enabled: boolean) {
    this.isAmbientEnabled = enabled;
    if (enabled && !this.isMuted) {
      this.initContext();
      this.syncAmbience();
    } else {
      this.stopAllAmbience();
    }
  }

  public getAmbientEnabled(): boolean {
    return this.isAmbientEnabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.08);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  // Calculate target volumes based on solarAltitude, light, and rain
  private calculateLevels() {
    const { solarAltitude = 0, light = 0.5, rain = 0 } = this.currentSettings;

    const isNight = solarAltitude < -6 || light < 0.35;
    const isDay = !isNight;
    const isRain = rain > 0.05;

    // Weights matching Thoufik's formula
    return {
      breeze: isRain ? 0.35 : 0.6,
      rain: isRain ? Math.min(1, rain * 1.2) : 0,
      birds: isDay && !isRain ? Math.max(0, (solarAltitude + 6) / 45) * 0.75 : 0,
      night: isNight && !isRain ? 0.7 : 0,
    };
  }

  private async startLoopTrack(name: string, url: string, targetGain: number) {
    if (this.isMuted || !this.isAmbientEnabled || !this.ctx) return;

    let loop = this.activeLoops.get(name);
    if (!loop) {
      const buffer = await this.loadBuffer(url);
      if (!buffer || !this.ctx || this.isMuted || !this.isAmbientEnabled) return;

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 1.2);

      source.connect(gain).connect(this.ambientGain!);
      source.start(0, Math.random() * buffer.duration);

      loop = { source, gain };
      this.activeLoops.set(name, loop);
    } else {
      loop.gain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 1.2);
    }
  }

  // Periodic random birds chirping shots (daytime)
  private scheduleBirds() {
    clearTimeout(this.birdTimer);
    if (this.isMuted || !this.isAmbientEnabled || !this.ctx) return;

    const levels = this.calculateLevels();
    if (levels.birds <= 0.05) return;

    const delay = 3000 + Math.random() * 6000;
    this.birdTimer = setTimeout(async () => {
      const curLevels = this.calculateLevels();
      if (curLevels.birds > 0.05 && this.ctx && !this.isMuted) {
        const buffer = await this.loadBuffer("/sky/birds-ambience.mp3");
        if (buffer && this.ctx && this.ambientGain) {
          const src = this.ctx.createBufferSource();
          src.buffer = buffer;
          const gain = this.ctx.createGain();
          const targetVol = curLevels.birds * (0.6 + Math.random() * 0.5);
          gain.gain.setValueAtTime(0, this.ctx.currentTime);
          gain.gain.linearRampToValueAtTime(targetVol, this.ctx.currentTime + 0.8);

          // Random phrase segment
          const start = Math.random() * Math.max(0, buffer.duration - 4);
          const duration = 2.5 + Math.random() * 3.5;
          gain.gain.setValueAtTime(targetVol, this.ctx.currentTime + duration - 0.8);
          gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);

          src.connect(gain).connect(this.ambientGain);
          src.start(0, start, duration);
        }
      }
      this.scheduleBirds();
    }, delay);
  }

  private syncAmbience() {
    if (this.isMuted || !this.isAmbientEnabled) {
      this.stopAllAmbience();
      return;
    }

    this.initContext();
    if (!this.ctx) return;

    const levels = this.calculateLevels();

    // 1. Breeze (constant atmospheric wind)
    this.startLoopTrack("breeze", "/sky/breeze-ambience.mp3", levels.breeze * 0.45);

    // 2. Rain ambience (when raining)
    if (levels.rain > 0) {
      this.startLoopTrack("rain", "/sky/rain-ambience.mp3", levels.rain * 0.7);
    } else {
      const rainLoop = this.activeLoops.get("rain");
      if (rainLoop) rainLoop.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 1.0);
    }

    // 3. Night crickets ambience (when night)
    if (levels.night > 0) {
      this.startLoopTrack("night", "/sky/night-ambience.mp3", levels.night * 0.55);
    } else {
      const nightLoop = this.activeLoops.get("night");
      if (nightLoop) nightLoop.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 1.0);
    }

    // 4. Daytime birds
    this.scheduleBirds();
  }

  private stopAllAmbience() {
    clearTimeout(this.birdTimer);
    clearTimeout(this.nightTimer);
    if (!this.ctx) return;

    for (const [name, loop] of this.activeLoops) {
      try {
        loop.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
        setTimeout(() => {
          try {
            loop.source.stop();
            loop.source.disconnect();
          } catch {}
        }, 300);
      } catch {}
    }
    this.activeLoops.clear();
  }

  // Play reference firework burst audio
  public playFireworkSound() {
    if (this.isMuted || !this.isAmbientEnabled) return;
    this.hasUserInteracted = true;
    this.initContext();
    if (!this.ctx) return;

    try {
      if (this.fireworkBuffers.length > 0) {
        // Pick one of Thoufik's real audio burst recordings
        const idx = Math.floor(Math.random() * this.fireworkBuffers.length);
        const buf = this.fireworkBuffers[idx];
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        src.playbackRate.value = 0.94 + Math.random() * 0.12;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.85 * this.volume;

        src.connect(gain).connect(this.effectsGain || this.ctx.destination);
        src.start(0);
      } else {
        // Fallback acoustic pop
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);
        gain.gain.setValueAtTime(0.2 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch {}
  }

  public playTick() {
    if (this.isMuted) return;
    this.hasUserInteracted = true;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1800, now);
      gain.gain.setValueAtTime(0.02 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.026);
    } catch {}
  }

  public playChime(freq1: number = 523.25, freq2: number = 783.99) {
    if (this.isMuted) return;
    this.hasUserInteracted = true;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq1, now);
      gain1.gain.setValueAtTime(0.04 * this.volume, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc1.connect(gain1).connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.26);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq2, now + 0.06);
      gain2.gain.setValueAtTime(0.03 * this.volume, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc2.connect(gain2).connect(this.ctx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.36);
    } catch {}
  }
}

export const skySound = new SkySoundManager();

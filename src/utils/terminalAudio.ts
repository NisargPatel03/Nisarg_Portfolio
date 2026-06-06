class TerminalSoundFX {
  private ctx: AudioContext | null = null;
  public enabled = false;
  public isAmbientPlaying = false;
  private ambientGain: GainNode | null = null;
  private ambientNodes: AudioNode[] = [];

  private init() {
    if (!this.ctx) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      } catch (e) {
        console.warn('Web Audio API not supported in this browser:', e);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      // Mechanical switch click (very short pitch envelope)
      osc.frequency.setValueAtTime(800 + Math.random() * 300, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn('Error playing click sound:', e);
    }
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      gain.connect(this.ctx.destination);

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5
      osc.connect(gain);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn('Error playing success chime:', e);
    }
  }

  startAmbient() {
    if (this.isAmbientPlaying) return;
    this.init();
    if (!this.ctx) return;

    this.isAmbientPlaying = true;
    try {
      const now = this.ctx.currentTime;
      
      // Create Ambient Master Gain Node (very soft volume)
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.04, now + 2.0); // Smooth 2s fade-in
      masterGain.connect(this.ctx.destination);
      this.ambientGain = masterGain;

      // Create Low-pass Filter for warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);
      filter.Q.setValueAtTime(3.0, now);
      filter.connect(masterGain);

      // Create deep drone saw/triangle oscillators
      const freqs = [73.42, 73.82, 110.00, 146.83, 174.61]; // D2, Detuned D2, A2, D3, F3
      const oscillators: OscillatorNode[] = [];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        osc.type = idx < 3 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        
        // Soften individual oscillator volumes
        const oscGain = this.ctx!.createGain();
        oscGain.gain.setValueAtTime(idx < 3 ? 0.25 : 0.35, now);
        
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start(now);
        oscillators.push(osc);
      });

      // Create LFO (Low Frequency Oscillator) to modulate filter frequency
      // Modulates filter between ~150Hz and ~350Hz every 12 seconds
      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.08, now); // 0.08 Hz

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(150, now); // modulation depth of 150 Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency); // Modulate cutoff frequency directly!
      lfo.start(now);

      // Store references for cleanup
      this.ambientNodes = [...oscillators, lfo, lfoGain, filter];
    } catch (e) {
      console.warn('Error starting ambient soundtrack:', e);
      this.isAmbientPlaying = false;
    }
  }

  stopAmbient() {
    if (!this.isAmbientPlaying) return;
    this.isAmbientPlaying = false;

    if (this.ambientGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        // Smooth fade-out to prevent clicks
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
        this.ambientGain.gain.linearRampToValueAtTime(0, now + 1.0); // 1s fade-out
        
        // Stop oscillators after fade-out
        const nodesToStop = [...this.ambientNodes];
        setTimeout(() => {
          nodesToStop.forEach(node => {
            try {
              if (node instanceof OscillatorNode) {
                node.stop();
                node.disconnect();
              } else {
                node.disconnect();
              }
            } catch (err) {
              // Ignore already stopped/disconnected nodes
            }
          });
        }, 1100);
      } catch (e) {
        console.warn('Error stopping ambient soundtrack:', e);
      }
    }
    this.ambientNodes = [];
    this.ambientGain = null;
  }
}

export const soundFX = new TerminalSoundFX();

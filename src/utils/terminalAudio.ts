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

  playCrtTransition() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      // High frequency static pop/zap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(9000, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);
      
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(4000, now);
      filter.Q.setValueAtTime(1.5, now);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.15);
      
      // Low frequency electronic click/pop
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(120, now);
      subOsc.frequency.linearRampToValueAtTime(30, now + 0.15);
      
      subGain.gain.setValueAtTime(0.12, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      
      subOsc.start(now);
      subOsc.stop(now + 0.15);
    } catch (e) {
      console.warn('Error playing CRT transition sound:', e);
    }
  }

  startAmbient() {
    if (this.isAmbientPlaying) return;
    this.init();
    if (!this.ctx) return;

    this.isAmbientPlaying = true;
    
    // Explicitly handle async AudioContext resume state
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.playAmbientNotes();
      }).catch((err) => {
        console.warn('Failed to resume AudioContext for ambient loop:', err);
        this.isAmbientPlaying = false;
      });
    } else {
      this.playAmbientNotes();
    }
  }

  private playAmbientNotes() {
    if (!this.ctx || !this.isAmbientPlaying) return;

    try {
      const now = this.ctx.currentTime;
      
      // Create Ambient Master Gain Node (audible yet background level)
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.12, now + 1.5); // Smooth 1.5s fade-in
      masterGain.connect(this.ctx.destination);
      this.ambientGain = masterGain;

      // Create Low-pass Filter for warm cybernetic tone
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, now); // Set higher cutoff for mid-range audibility
      filter.Q.setValueAtTime(2.0, now);
      filter.connect(masterGain);

      // Shifted frequencies up one octave for laptop/phone speaker audibility:
      // D3 (146.8Hz), Detuned D3 (147.3Hz), A3 (220Hz), D4 (293.6Hz), F4 (349.2Hz), A4 (440Hz)
      const freqs = [146.83, 147.33, 220.00, 293.66, 349.23, 440.00];
      const oscillators: OscillatorNode[] = [];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        osc.type = idx < 3 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        
        // Soften individual oscillator volumes
        const oscGain = this.ctx!.createGain();
        oscGain.gain.setValueAtTime(idx < 3 ? 0.2 : 0.3, now);
        
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start(now);
        oscillators.push(osc);
      });

      // Create LFO (Low Frequency Oscillator) to modulate filter frequency
      // Modulates filter cutoff between 300Hz and 700Hz every 12 seconds
      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.08, now); // 0.08 Hz

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(200, now); // modulation depth of 200 Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency); // Modulate cutoff frequency directly!
      lfo.start(now);

      // Store references for cleanup
      this.ambientNodes = [...oscillators, lfo, lfoGain, filter];
    } catch (e) {
      console.warn('Error playing ambient notes:', e);
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

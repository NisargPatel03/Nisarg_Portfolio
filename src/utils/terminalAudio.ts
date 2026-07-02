class TerminalSoundFX {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  public enabled = true;
  public isAmbientPlaying = false;
  private ambientGain: GainNode | null = null;
  private ambientNodes: AudioNode[] = [];
  private oscillators: OscillatorNode[] = [];
  private filterNode: BiquadFilterNode | null = null;
  private preloaderHumNode: OscillatorNode | null = null;
  private preloaderHumGain: GainNode | null = null;
  constructor() {
    if (typeof window !== 'undefined') {
      const resumeAudio = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().then(() => {
            window.removeEventListener('click', resumeAudio);
            window.removeEventListener('keydown', resumeAudio);
          }).catch(err => console.warn(err));
        } else if (!this.ctx) {
          this.init();
        }
      };
      window.addEventListener('click', resumeAudio, { passive: true });
      window.addEventListener('keydown', resumeAudio, { passive: true });
    }
  }

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
    if (this.ctx && !this.analyser) {
      try {
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256; // Responsive time-domain resolution
        this.analyser.connect(this.ctx.destination);
      } catch (e) {
        console.warn('Failed to create AnalyserNode:', e);
      }
    }
  }

  public getAudioContext(): AudioContext | null {
    this.init();
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode | null {
    this.init();
    return this.analyser;
  }

  public getAnalyserData(array: Uint8Array) {
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(array as any);
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
      gain.connect(this.analyser || this.ctx.destination);

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
      gain.connect(this.analyser || this.ctx.destination);

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

  private alarmInterval: any = null;

  public playError() {
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.setValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.analyser || this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Error playing error chime:', e);
    }
  }

  public playLockdownAlarm() {
    this.init();
    if (!this.ctx) return;

    this.stopLockdownAlarm(); // Clear any existing alarm

    let count = 0;
    const triggerSiren = () => {
      if (!this.ctx || count >= 30) {
        this.stopLockdownAlarm();
        return;
      }
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.linearRampToValueAtTime(750, now + 0.38);
        osc.frequency.linearRampToValueAtTime(450, now + 0.75);

        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

        osc.connect(gain);
        gain.connect(this.analyser || this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.8);
        count++;
      } catch (e) {
        console.warn('Error playing siren cycle:', e);
      }
    };

    triggerSiren();
    this.alarmInterval = setInterval(triggerSiren, 1000);
  }

  public stopLockdownAlarm() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
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
      masterGain.connect(this.analyser || this.ctx.destination);
      this.ambientGain = masterGain;

      // Create Low-pass Filter for warm cybernetic tone
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, now); // Set higher cutoff for mid-range audibility
      filter.Q.setValueAtTime(2.0, now);
      filter.connect(masterGain);
      this.filterNode = filter;

      // Shifted frequencies up one octave for laptop/phone speaker audibility:
      const freqs = [146.83, 147.33, 220.00, 293.66, 349.23, 440.00];
      this.oscillators = [];

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
        this.oscillators.push(osc);
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
      this.ambientNodes = [...this.oscillators, lfo, lfoGain, filter];
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
    this.oscillators = [];
    this.filterNode = null;
    this.ambientGain = null;
  }

  public setAmbientThemeForSection(label: string) {
    if (!this.isAmbientPlaying || !this.ctx || this.oscillators.length === 0) return;

    const now = this.ctx.currentTime;

    // Define chord frequencies and low-pass filter base cutoffs for each section label
    let freqs = [146.83, 147.33, 220.00, 293.66, 349.23, 440.00]; // Default: D minor (SYS_BOOT)
    let filterCutoff = 500;

    switch (label) {
      case 'SYS_BOOT': // Hero
        freqs = [146.83, 147.33, 220.00, 293.66, 349.23, 440.00]; // D minor
        filterCutoff = 500;
        break;
      case 'BIO_NET': // Skills
      case 'CERT_VER': // Certifications
        freqs = [164.81, 165.31, 246.94, 329.63, 392.00, 493.88]; // E minor (bright, clean tech sound)
        filterCutoff = 650;
        break;
      case 'SYS_ARCH': // Architecture
      case '3D_DECK': // Projects
        freqs = [130.81, 131.31, 196.00, 261.63, 311.13, 392.00]; // C minor (moody, structured blueprint sound)
        filterCutoff = 450;
        break;
      case 'BIO_CORE': // About
      case 'GIT_TREE': // Work
      case 'SANDBOX': // Services
        freqs = [174.61, 175.11, 261.63, 349.23, 440.00, 523.25]; // F major (warm, harmonious chord)
        filterCutoff = 550;
        break;
      case 'COM_UPLINK': // Contact
        freqs = [196.00, 196.50, 293.66, 392.00, 493.88, 587.33]; // G major (hopeful, high-frequency resolution)
        filterCutoff = 700;
        break;
      default:
        return;
    }

    // Exponentially transition active oscillators to the new chord!
    this.oscillators.forEach((osc, idx) => {
      if (idx < freqs.length) {
        try {
          osc.frequency.setValueAtTime(osc.frequency.value, now);
          osc.frequency.exponentialRampToValueAtTime(freqs[idx], now + 2.0); // 2-second glide
        } catch (e) {
          try {
            osc.frequency.linearRampToValueAtTime(freqs[idx], now + 2.0);
          } catch (err) {}
        }
      }
    });

    // Modulate filter cutoff frequency smoothly
    if (this.filterNode) {
      try {
        this.filterNode.frequency.setValueAtTime(this.filterNode.frequency.value, now);
        this.filterNode.frequency.exponentialRampToValueAtTime(filterCutoff, now + 2.0);
      } catch (e) {
        try {
          this.filterNode.frequency.linearRampToValueAtTime(filterCutoff, now + 2.0);
        } catch (err) {}
      }
    }
  }

  startPreloaderHum() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      this.preloaderHumNode = this.ctx.createOscillator();
      this.preloaderHumGain = this.ctx.createGain();

      this.preloaderHumNode.type = 'sine';
      this.preloaderHumNode.frequency.setValueAtTime(55, now); // Low A1 note

      // Low pass filter to make it a deep, industrial bass hum
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, now);

      this.preloaderHumGain.gain.setValueAtTime(0.0, now);
      this.preloaderHumGain.gain.linearRampToValueAtTime(0.15, now + 1.0); // Smooth fade in

      this.preloaderHumNode.connect(filter);
      filter.connect(this.preloaderHumGain);
      this.preloaderHumGain.connect(this.analyser || this.ctx.destination);

      this.preloaderHumNode.start(now);
    } catch (e) {
      console.warn('Error starting preloader hum:', e);
    }
  }

  stopPreloaderHum() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (this.preloaderHumGain && this.preloaderHumNode) {
        this.preloaderHumGain.gain.setValueAtTime(this.preloaderHumGain.gain.value, now);
        this.preloaderHumGain.gain.linearRampToValueAtTime(0.0, now + 0.5); // Smooth fade out
        
        const nodeToStop = this.preloaderHumNode;
        setTimeout(() => {
          try {
            nodeToStop.stop();
          } catch (err) {}
        }, 600);
      }
    } catch (e) {
      console.warn('Error stopping preloader hum:', e);
    }
  }

  playGridSnap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.analyser || this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      console.warn('Error playing grid snap sound:', e);
    }
  }

  playMetallicLock() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      gain.connect(this.analyser || this.ctx.destination);

      // Create multiple frequencies to simulate metal resonance
      const freqs = [180, 290, 430, 680];
      freqs.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 0.9, now + 0.6); // Pitch drop
        
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 0.6);
      });
    } catch (e) {
      console.warn('Error playing metallic lock sound:', e);
    }
  }

  playSwoosh() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.analyser || this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {
      console.warn('Error playing swoosh sound:', e);
    }
  }

  playScannerPing() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1500, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.analyser || this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Error playing scanner ping sound:', e);
    }
  }

  playSonarPing(panValue: number = 0) {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const gain2 = this.ctx.createGain();

      // Configure panning node for spatial audio feedback
      let dest: AudioNode = this.analyser || this.ctx.destination;
      if (this.ctx.createStereoPanner) {
        try {
          const panner = this.ctx.createStereoPanner();
          panner.pan.setValueAtTime(Math.max(-1.0, Math.min(1.0, panValue)), now);
          panner.connect(dest);
          dest = panner;
        } catch (err) {
          console.warn('StereoPannerNode configuration failed:', err);
        }
      }

      // Primary oscillator (high frequency sonar sweep)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 1.4);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(gain);
      gain.connect(dest);

      // Secondary oscillator (lower metallic resonator body)
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(700, now);
      osc2.frequency.exponentialRampToValueAtTime(140, now + 1.4);

      gain2.gain.setValueAtTime(0.03, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc2.connect(gain2);
      gain2.connect(dest);

      osc.start(now);
      osc.stop(now + 1.4);
      osc2.start(now);
      osc2.stop(now + 1.4);
    } catch (e) {
      console.warn('Error playing sonar ping sound:', e);
    }
  }
}

export const soundFX = new TerminalSoundFX();

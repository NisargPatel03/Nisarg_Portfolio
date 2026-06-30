import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Web Audio API Synthesizer for high-tech blade swoosh/slash sound
const playSlashSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // 1. White Noise Buffer
    const bufferSize = ctx.sampleRate * 0.45; // 0.45 seconds duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;
    
    // 2. Bandpass Filter with sweeps
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 8;
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 0.15);
    filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.4);
    
    // 3. Gain node for volume envelope
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 0.08); // sweep up
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4); // decay
    
    // 4. Resonance filter boost for sci-fi laser hum
    const peakFilter = ctx.createBiquadFilter();
    peakFilter.type = 'peaking';
    peakFilter.frequency.setValueAtTime(800, ctx.currentTime);
    peakFilter.gain.setValueAtTime(10, ctx.currentTime);
    
    // Connect nodes
    noiseNode.connect(filter);
    filter.connect(peakFilter);
    peakFilter.connect(gain);
    gain.connect(ctx.destination);
    
    noiseNode.start();
    noiseNode.stop(ctx.currentTime + 0.45);
  } catch (err) {
    console.error('Web Audio Synth Error:', err);
  }
};

export const KatanaWipe: React.FC = () => {
  const [phase, setPhase] = useState<'idle' | 'slashing' | 'closed' | 'opening'>('idle');

  useEffect(() => {
    const handleStart = () => {
      playSlashSound();
      setPhase('slashing');
      
      // Auto-advance to closed state shortly after the slash flashes
      const timer = setTimeout(() => {
        setPhase('closed');
      }, 150);

      return () => clearTimeout(timer);
    };

    const handleOpen = () => {
      setPhase('opening');
      
      // Reset back to idle after opening completes
      const timer = setTimeout(() => {
        setPhase('idle');
      }, 500);

      return () => clearTimeout(timer);
    };

    window.addEventListener('katana-cut-start', handleStart);
    window.addEventListener('katana-cut-open', handleOpen);

    return () => {
      window.removeEventListener('katana-cut-start', handleStart);
      window.removeEventListener('katana-cut-open', handleOpen);
    };
  }, []);

  if (phase === 'idle') return null;

  // Render variables
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#00f3ff';

  return (
    <div className="fixed inset-0 w-screen h-screen z-[10008] pointer-events-none overflow-hidden select-none">
      {/* 1. LASER FLASHES (During slashing phase) */}
      <AnimatePresence>
        {phase === 'slashing' && (
          <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Primary Slash: Top-Right to Bottom-Left */}
            <motion.line
              x1="100"
              y1="0"
              x2="0"
              y2="100"
              stroke={accentColor}
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 1 }}
              animate={{ pathLength: 1, opacity: [1, 1, 0] }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
            {/* Secondary Counter Slash: Top-Left to Bottom-Right */}
            <motion.line
              x1="0"
              y1="0"
              x2="100"
              y2="100"
              stroke="#ff00c7"
              strokeWidth="0.8"
              initial={{ pathLength: 0, opacity: 1 }}
              animate={{ pathLength: 1, opacity: [1, 1, 0] }}
              transition={{ duration: 0.15, ease: 'easeOut', delay: 0.02 }}
            />
          </svg>
        )}
      </AnimatePresence>

      {/* 2. DIAGONAL CUT CURTAINS */}
      <svg
        className="absolute inset-0 w-full h-full z-10 pointer-events-auto"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Top-Left Panel (Triangle M 0 0 L 100 0 L 0 100 Z) */}
        <motion.path
          d="M 0 0 L 100 0 L 0 100 Z"
          fill="rgba(10, 10, 10, 0.98)"
          stroke={accentColor}
          strokeWidth="0.15"
          className="backdrop-blur-md"
          style={{ transformOrigin: 'top left' }}
          initial={{ x: '-100%', y: '-100%' }}
          animate={
            phase === 'closed'
              ? { x: '0%', y: '0%' }
              : phase === 'opening'
              ? { x: '-100%', y: '-100%' }
              : { x: '-100%', y: '-100%' }
          }
          transition={{
            duration: phase === 'opening' ? 0.45 : 0.3,
            ease: phase === 'opening' ? 'easeIn' : 'easeOut',
          }}
        />

        {/* Bottom-Right Panel (Triangle M 100 0 L 100 100 L 0 100 Z) */}
        <motion.path
          d="M 100 0 L 100 100 L 0 100 Z"
          fill="rgba(10, 10, 10, 0.98)"
          stroke="#ff00c7"
          strokeWidth="0.15"
          className="backdrop-blur-md"
          style={{ transformOrigin: 'bottom right' }}
          initial={{ x: '100%', y: '100%' }}
          animate={
            phase === 'closed'
              ? { x: '0%', y: '0%' }
              : phase === 'opening'
              ? { x: '100%', y: '100%' }
              : { x: '100%', y: '100%' }
          }
          transition={{
            duration: phase === 'opening' ? 0.45 : 0.3,
            ease: phase === 'opening' ? 'easeIn' : 'easeOut',
          }}
        />
      </svg>

      {/* 3. TELEMETRY STATUS LABELS (Fades when screen is closed) */}
      <AnimatePresence>
        {phase === 'closed' && (
          <div className="absolute inset-0 flex flex-col justify-center items-center z-30 font-mono pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.15 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span className="text-[10px] sm:text-xs tracking-[0.25em] text-white font-bold uppercase">
                  SECTION_SWAP // ACTIVE
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] tracking-[0.4em] opacity-40 text-amber-500 font-glow uppercase">
                DIFFERENTIAL_GLITCH_ALIGNMENT
              </span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

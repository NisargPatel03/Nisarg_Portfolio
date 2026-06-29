import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { soundFX } from '../utils/terminalAudio';

interface PreloaderProps {
  onStart: () => void;
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onStart, onComplete }) => {
  const [started, setStarted] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);

  // Fast coordinate stream & percentage ticker
  useEffect(() => {
    if (!started) return;

    soundFX.startPreloaderHum();

    // Sound clicks for grid assembly
    const clickInterval = setInterval(() => {
      soundFX.playGridSnap();
    }, 150);

    // Percentage loading ticker
    const pctInterval = setInterval(() => {
      setLoadingPercent((prev) => {
        if (prev >= 100) {
          clearInterval(pctInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 28);

    // End drawing phase
    const drawingTimer = setTimeout(() => {
      clearInterval(clickInterval);
      soundFX.playMetallicLock();
    }, 2800);

    // Final drift/complete phase
    const exitTimer = setTimeout(() => {
      soundFX.stopPreloaderHum();
      onComplete();
    }, 3800);

    return () => {
      clearInterval(clickInterval);
      clearInterval(pctInterval);
      clearTimeout(drawingTimer);
      clearTimeout(exitTimer);
    };
  }, [started, onComplete]);

  const handleInit = () => {
    if (started) return;
    setStarted(true);
    onStart();
  };

  return (
    <div 
      onClick={handleInit}
      className={`fixed inset-0 z-[10000] bg-[#0C0C0C] flex flex-col justify-center items-center font-mono select-none overflow-hidden text-[#D7E2EA] ${
        !started ? 'cursor-pointer' : ''
      }`}
    >
      {/* Click anywhere activation overlay */}
      {!started && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          <div className="px-8 py-5 border border-[#00f3ff]/20 bg-black/50 backdrop-blur-md text-[#00f3ff] rounded-xl font-orbitron tracking-widest text-xs shadow-[0_0_40px_rgba(0,243,255,0.08)] flex flex-col items-center gap-3">
            <span className="animate-pulse">ENGAGE NEURAL LINK</span>
            <span className="text-[9px] opacity-60 tracking-normal font-mono uppercase">
              Click anywhere to initialize system audio
            </span>
          </div>
        </div>
      )}

      {/* Visual background lines & axes */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      {/* Drawing and coordinate crosshairs */}
      <div className="absolute w-full h-[1px] bg-white/[0.03] top-1/2 left-0 pointer-events-none" />
      <div className="absolute h-full w-[1px] bg-white/[0.03] left-1/2 top-0 pointer-events-none" />

      {/* Main vector animation viewport */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Animated Target Outer Reticle */}
        <motion.div
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: 360, opacity: started ? 0.15 : 0.05 }}
          transition={{ duration: 10, ease: 'linear', repeat: Infinity }}
          className="absolute w-[460px] h-[460px] border border-dashed border-[#00f3ff] rounded-full pointer-events-none"
        />

        <div className="w-[380px] h-[280px] pointer-events-none" />
      </div>

      {/* Loading Progress Bar & percentage */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center w-[280px]">
        <div className="flex justify-between w-full text-[0.7rem] opacity-60 mb-2">
          <span>COMPILING BUILD</span>
          <span>{loadingPercent}%</span>
        </div>
        <div className="w-full h-[3px] bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${loadingPercent}%` }}
            className="h-full bg-gradient-to-r from-[#00f3ff] to-[#ff00c7]"
          />
        </div>
      </div>
    </div>
  );
};

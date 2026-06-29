import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { soundFX } from '../utils/terminalAudio';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [coordinates, setCoordinates] = useState({ x: 0.15, y: 0.82 });
  const [loadingPercent, setLoadingPercent] = useState(0);

  // Fast coordinate stream & percentage ticker
  useEffect(() => {
    soundFX.startPreloaderHum();

    // Sound clicks for grid assembly
    const clickInterval = setInterval(() => {
      soundFX.playGridSnap();
    }, 150);

    // Dynamic coordinates change
    const coordInterval = setInterval(() => {
      setCoordinates({
        x: Number((Math.random() * 0.99).toFixed(2)),
        y: Number((Math.random() * 0.99).toFixed(2)),
      });
    }, 100);

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
      clearInterval(coordInterval);
      onComplete();
    }, 3800);

    return () => {
      clearInterval(clickInterval);
      clearInterval(coordInterval);
      clearInterval(pctInterval);
      clearTimeout(drawingTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[10000] bg-[#0C0C0C] flex flex-col justify-center items-center font-mono select-none overflow-hidden text-[#D7E2EA]">
      {/* Visual background lines & axes */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="absolute bottom-4 left-6 right-6 flex justify-between text-[0.65rem] opacity-35 tracking-widest pointer-events-none">
        <span>SYS_CORE: ONLINE</span>
        <span>MEM_ALLOC: OK</span>
        <span>SYS_SPEED: 4.80GHz</span>
        <span>BOOT_MODULE: ACTIVE</span>
      </div>

      <div className="absolute top-20 bottom-20 right-6 flex flex-col justify-between text-[0.65rem] opacity-35 text-right pointer-events-none">
        <span>NODE_X: {coordinates.x}</span>
        <span>NODE_Y: {coordinates.y}</span>
        <span>CLOCK_REF: {Date.now() % 10000}</span>
        <span>SEC_GATE: LOCK</span>
      </div>

      {/* Drawing and coordinate crosshairs */}
      <div className="absolute w-full h-[1px] bg-white/[0.03] top-1/2 left-0 pointer-events-none" />
      <div className="absolute h-full w-[1px] bg-white/[0.03] left-1/2 top-0 pointer-events-none" />

      {/* Main vector animation viewport */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Animated Target Outer Reticle */}
        <motion.div
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: 360, opacity: 0.15 }}
          transition={{ duration: 10, ease: 'linear', repeat: Infinity }}
          className="absolute w-[400px] h-[400px] border border-dashed border-[#00f3ff] rounded-full pointer-events-none"
        />

        <div className="w-[340px] h-[260px] pointer-events-none" />
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

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { soundFX } from '../utils/terminalAudio';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isDrawingComplete, setIsDrawingComplete] = useState(false);
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
      setIsDrawingComplete(true);
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
      
      {/* Outer Viewport Ruler Grid */}
      <div className="absolute top-4 left-6 right-6 flex justify-between text-[0.65rem] opacity-35 tracking-widest pointer-events-none">
        <span>COL_A // [0x01]</span>
        <span>COL_B // [0x02]</span>
        <span>COL_C // [0x03]</span>
        <span>COL_D // [0x04]</span>
        <span>COL_E // [0x05]</span>
        <span>COL_F // [0x06]</span>
        <span>COL_G // [0x07]</span>
        <span>COL_H // [0x08]</span>
      </div>

      <div className="absolute bottom-4 left-6 right-6 flex justify-between text-[0.65rem] opacity-35 tracking-widest pointer-events-none">
        <span>SYS_CORE: ONLINE</span>
        <span>MEM_ALLOC: OK</span>
        <span>SYS_SPEED: 4.80GHz</span>
        <span>BOOT_MODULE: ACTIVE</span>
      </div>

      {/* Side axis rules */}
      <div className="absolute top-20 bottom-20 left-6 flex flex-col justify-between text-[0.65rem] opacity-35 pointer-events-none">
        <span>R_1 // [Z_MIN]</span>
        <span>R_2</span>
        <span>R_3</span>
        <span>R_4</span>
        <span>R_5</span>
        <span>R_6</span>
        <span>R_7</span>
        <span>R_8 // [Z_MAX]</span>
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
          className="absolute w-[240px] h-[240px] border border-dashed border-[#00f3ff] rounded-full pointer-events-none"
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-[180px] h-[180px] flex items-center justify-center"
        >
          {/* Custom drawing SVG Monogram */}
          <svg
            width="160"
            height="120"
            viewBox="0 0 160 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_0_12px_rgba(0,243,255,0.45)]"
          >
            {/* Grid references inside SVG */}
            <line x1="20" y1="60" x2="140" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1="80" y1="15" x2="80" y2="105" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

            {/* Letter 'N' vector path */}
            <motion.path
              d="M 35 90 L 35 30 L 75 90 L 75 30"
              stroke="#00f3ff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.2 }}
              style={isDrawingComplete ? {
                fill: 'rgba(0, 243, 255, 0.08)',
                transition: 'fill 0.8s ease-in-out',
              } : undefined}
            />

            {/* Letter 'P' vector path */}
            <motion.path
              d="M 95 90 L 95 30 L 125 30 C 135 30 135 60 125 60 L 95 60"
              stroke="#ff00c7"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.2 }}
              style={isDrawingComplete ? {
                fill: 'rgba(255, 0, 199, 0.08)',
                transition: 'fill 0.8s ease-in-out',
              } : undefined}
            />
          </svg>
        </motion.div>

        {/* Dynamic status coordinates floating tags */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-[#00f3ff] text-xs font-semibold tracking-widest uppercase">
            {isDrawingComplete ? 'SYSTEM INITIALIZED' : 'ANALYZING MATRIX VECTORS'}
          </span>
          <div className="flex gap-4 mt-2 text-[0.7rem] text-[#D7E2EA]/50">
            <span>N_NODE: [0.15, 0.82]</span>
            <span>P_NODE: [0.72, -0.45]</span>
          </div>
        </div>
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

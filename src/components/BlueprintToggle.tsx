import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundFX } from '../utils/terminalAudio';

interface BlueprintToggleProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

export const BlueprintToggle: React.FC<BlueprintToggleProps> = ({ isActive, onToggle }) => {
  const [isAiCloneOpen, setIsAiCloneOpen] = useState(false);
  const [isHudCollapsed, setIsHudCollapsed] = useState(true);

  useEffect(() => {
    const handleStateChange = (e: any) => {
      setIsAiCloneOpen(e.detail.isOpen);
    };
    const handleHudStateChange = (e: any) => {
      setIsHudCollapsed(e.detail.isCollapsed);
    };
    window.addEventListener('aiCloneStateChange', handleStateChange);
    window.addEventListener('hudStateChange', handleHudStateChange);
    return () => {
      window.removeEventListener('aiCloneStateChange', handleStateChange);
      window.removeEventListener('hudStateChange', handleHudStateChange);
    };
  }, []);

  const handleToggle = () => {
    const newState = !isActive;
    onToggle(newState);
    
    // Play dual mechanical clunk sounds for weight
    soundFX.playClick();
    setTimeout(() => {
      soundFX.playClick();
    }, 50);
  };

  return (
    <AnimatePresence>
      {!isAiCloneOpen && isHudCollapsed && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed top-24 right-6 z-[999] md:top-28 md:right-8 select-none"
          onClick={handleToggle}
          title="Toggle CAD Blueprint Wireframe Mode"
        >
      {/* Mobile View: Compact Glassmorphic Pill */}
      <div 
        className={`flex md:hidden items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-lg ${
          isActive 
            ? 'border-[#00f3ff] bg-[#040d1a]/95 text-[#00f3ff] shadow-[0_0_12px_rgba(0,243,255,0.35)]' 
            : 'border-white/10 bg-[#121212]/95 text-[#D7E2EA] hover:border-white/20'
        }`}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
        <span className="font-mono text-[9px] font-extrabold tracking-widest uppercase">
          {isActive ? 'CAD MODE' : 'NORM MODE'}
        </span>
      </div>

      {/* Desktop View: Heavy Industrial Metal Backplate */}
      <div 
        className="hidden md:flex w-[84px] h-[135px] rounded-lg border-2 border-neutral-700/80 shadow-[0_12px_28px_rgba(0,0,0,0.7),_inset_0_1px_2px_rgba(255,255,255,0.15)] flex-col items-center justify-between py-2 relative cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #2e2e2e 0%, #151515 50%, #1c1c1c 100%)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.4)',
        }}
      >
        {/* Screw Heads in four corners */}
        <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-400 shadow-inner flex items-center justify-center">
          <div className="w-[4px] h-[1px] bg-neutral-900 transform rotate-45" />
        </div>
        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-400 shadow-inner flex items-center justify-center">
          <div className="w-[4px] h-[1px] bg-neutral-900 transform -rotate-12" />
        </div>
        <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-400 shadow-inner flex items-center justify-center">
          <div className="w-[4px] h-[1px] bg-neutral-900 transform rotate-90" />
        </div>
        <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-400 shadow-inner flex items-center justify-center">
          <div className="w-[4px] h-[1px] bg-neutral-900 transform rotate-[130deg]" />
        </div>

        {/* Hazard warning stripes at the top */}
        <div className="w-full h-1 bg-stripes flex overflow-hidden opacity-60 absolute top-[10px] left-0">
          <div 
            className="w-full h-full"
            style={{
              background: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 4px, #000 4px, #000 8px)'
            }}
          />
        </div>

        {/* Text Header */}
        <div className="flex flex-col items-center mt-2.5">
          <span className="font-mono text-[7px] text-neutral-400 tracking-widest font-extrabold leading-none">
            SYS_GRID
          </span>
          <span className="font-mono text-[6px] text-neutral-500/80 tracking-wide mt-0.5 leading-none">
            OVERRIDE
          </span>
        </div>

        {/* Status Indicators (LEDs) */}
        <div className="flex gap-2.5 my-1">
          {/* Green/Red Active LED */}
          <div className="flex flex-col items-center gap-0.5">
            <div 
              className={`w-1.5 h-1.5 rounded-full border border-black/40 transition-all duration-300 ${
                isActive 
                  ? 'bg-cyan-400 shadow-[0_0_8px_#00ffff,_0_0_12px_#00ffff]' 
                  : 'bg-cyan-950/60'
              }`}
            />
            <span className="font-mono text-[5px] text-neutral-500">CAD</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div 
              className={`w-1.5 h-1.5 rounded-full border border-black/40 transition-all duration-300 ${
                !isActive 
                  ? 'bg-amber-500 shadow-[0_0_6px_#f59e0b]' 
                  : 'bg-amber-950/60'
              }`}
            />
            <span className="font-mono text-[5px] text-neutral-500">NORM</span>
          </div>
        </div>

        {/* Outer Bezel surrounding the Switch Slot */}
        <div 
          className="w-7 h-16 rounded bg-neutral-900 border border-neutral-700/60 p-[1.5px] flex items-center justify-center shadow-inner"
          style={{ perspective: '80px' }}
        >
          {/* Inner dark Switch Slot */}
          <div className="w-full h-full rounded bg-neutral-950 border border-black shadow-[inset_0_3px_6px_rgba(0,0,0,0.85)] flex items-center justify-center relative overflow-visible">
            {/* 3D Toggle Lever Shaft */}
            <div 
              className="w-2 h-9 rounded-sm relative origin-center transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] flex flex-col justify-end"
              style={{
                transform: isActive 
                  ? 'rotateX(-28deg) translateY(6px) translateZ(8px)' 
                  : 'rotateX(28deg) translateY(-6px) translateZ(8px)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Metal Cylinder Body */}
              <div 
                className="w-full h-full rounded-sm bg-gradient-to-r from-neutral-400 via-neutral-200 to-neutral-500 shadow-md relative"
                style={{
                  boxShadow: isActive
                    ? '0 -2px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
                    : '0 2px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
              >
                {/* 3D Spherical Knob at the tip */}
                <div 
                  className="w-4 h-4 rounded-full absolute left-1/2 -translate-x-1/2 shadow-[0_3px_5px_rgba(0,0,0,0.4)]"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #a3a3a3 50%, #404040 100%)',
                    top: isActive ? 'auto' : '-3px',
                    bottom: isActive ? '-3px' : 'auto',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Label Decal */}
        <div className="flex flex-col items-center mb-1.5">
          <span 
            className={`font-mono text-[7px] font-black tracking-wider transition-colors duration-300 ${
              isActive ? 'text-cyan-400 drop-shadow-[0_0_3px_rgba(6,182,212,0.4)]' : 'text-neutral-500'
            }`}
          >
            {isActive ? 'CAD_WIRE' : 'NORM_SYS'}
          </span>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
  );
};

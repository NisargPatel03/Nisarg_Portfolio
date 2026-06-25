import React, { useState } from 'react';
import { soundFX } from '../utils/terminalAudio';
import { ShieldAlert } from 'lucide-react';

export const EmergencyButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleShieldClick = () => {
    setIsOpen(!isOpen);
    soundFX.playClick();
  };

  const handleBtnClick = () => {
    if (!isOpen) return;
    soundFX.playClick();
    if ((window as any).triggerMeltdown) {
      (window as any).triggerMeltdown();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 my-10 relative z-40">
      {/* Industrial Warning Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-2 border-yellow-500/40 bg-yellow-500/10 rounded-xl animate-pulse">
        <ShieldAlert className="w-5 h-5 text-yellow-500" />
        <span className="font-mono text-xs text-yellow-500 font-bold uppercase tracking-widest">
          SYSTEM CORE REACTOR STATUS: ACTIVE
        </span>
      </div>

      {/* Button Housing Chassis */}
      <div 
        className="w-[200px] h-[200px] rounded-3xl p-4 flex flex-col items-center justify-center relative shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
        style={{
          background: 'repeating-linear-gradient(45deg, #121212, #121212 15px, #1a1a1a 15px, #1a1a1a 30px)',
          border: '6px solid #eab308' // Yellow warning border
        }}
      >
        {/* Yellow-Black hazard tape overlay */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-20 border-4 border-yellow-500" />

        {/* Warning label */}
        <span className="absolute top-3 font-mono text-[9px] text-yellow-500/80 font-bold tracking-widest uppercase">
          [ DANGER: HIGH VOLTAGE ]
        </span>

        {/* Inner metal button cavity */}
        <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-b from-neutral-800 to-neutral-900 border-4 border-neutral-700/80 flex items-center justify-center relative shadow-inner overflow-visible">
          
          {/* Glowing red button */}
          <button
            type="button"
            disabled={!isOpen}
            onClick={handleBtnClick}
            className={`w-[80px] h-[80px] rounded-full bg-gradient-to-b from-red-500 to-red-700 border-2 border-red-800 flex items-center justify-center font-mono text-[10px] font-black uppercase text-red-100 tracking-wider shadow-[0_5px_15px_rgba(239,68,68,0.4)] select-none transition-all duration-300 ${
              isOpen 
                ? 'cursor-pointer hover:from-red-400 hover:to-red-600 hover:shadow-[0_0_25px_rgba(239,68,68,0.8)] active:scale-95 active:shadow-inner' 
                : 'opacity-80 cursor-default'
            }`}
          >
            <span>MELT<br/>DOWN</span>
          </button>

          {/* 3D Glass Flip Shield Cover */}
          <div
            onClick={handleShieldClick}
            className="absolute inset-[-6px] rounded-full cursor-pointer transition-all duration-700 select-none flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0.4) 100%)',
              backdropFilter: 'blur(3px)',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 10px rgba(255,255,255,0.1)',
              transformOrigin: 'top',
              transform: isOpen 
                ? 'perspective(600px) rotateX(-120deg) translateY(-20px) scale(0.98)' 
                : 'perspective(600px) rotateX(0deg)',
              opacity: isOpen ? 0.35 : 1,
              pointerEvents: 'auto',
              zIndex: 30
            }}
          >
            {/* Warning decal on glass */}
            <div 
              className="px-2 py-0.5 border border-red-500/40 bg-red-950/40 rounded text-red-500 text-[8px] font-black uppercase tracking-widest animate-pulse select-none text-center"
              style={{ transform: 'translateZ(15px)' }}
            >
              LIFT SHIELD
            </div>
          </div>
        </div>

        {/* Warning label */}
        <span className="absolute bottom-3 font-mono text-[9px] text-red-500 font-bold tracking-widest uppercase animate-pulse">
          [ DO NOT PRESS ]
        </span>
      </div>
    </div>
  );
};

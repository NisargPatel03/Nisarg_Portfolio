import React, { useState, useEffect, useRef } from 'react';

interface CursorTrailProps {
  enabled: boolean;
}

export const CursorTrail: React.FC<CursorTrailProps> = ({ enabled }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled]);

  // Spring animation loop
  useEffect(() => {
    if (!enabled) return;

    const animateTrail = () => {
      setTrail((prev) => {
        // Simple spring interpolation: trail moves 15% closer to position every frame
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        
        // If distance is tiny, stop updating to save CPU
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          return position;
        }

        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      requestRef.current = requestAnimationFrame(animateTrail);
    };

    requestRef.current = requestAnimationFrame(animateTrail);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [position, enabled]);

  if (!enabled || !isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 select-none hidden md:block"
      style={{
        left: `${trail.x}px`,
        top: `${trail.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Sleek retro crosshair */}
      <div 
        className="relative w-8 h-8 flex items-center justify-center transition-all duration-300"
        style={{ color: 'var(--accent-color, #00ff41)' }}
      >
        {/* Horizontal crosshair line */}
        <div className="absolute w-4 h-[1px] bg-current opacity-40" />
        {/* Vertical crosshair line */}
        <div className="absolute h-4 w-[1px] bg-current opacity-40" />
        {/* Center glowing dot */}
        <div className="w-1 h-1 rounded-full bg-current shadow-[0_0_8px_currentColor]" />

        {/* Telemetry coordinate readout */}
        <div 
          className="absolute left-6 top-6 bg-[#0c0c0cd9] border border-white/10 px-2 py-1 rounded-md text-[8px] font-mono whitespace-nowrap flex flex-col gap-0.5 shadow-md"
          style={{ 
            borderColor: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--accent-color, #00ff41)',
            textShadow: '0 0 4px var(--accent-glow, rgba(0, 255, 65, 0.4))'
          }}
        >
          <span>SYS_PTR: ACTIVE</span>
          <span className="text-[#D7E2EA]/50 font-bold">X: {Math.round(trail.x)}PX</span>
          <span className="text-[#D7E2EA]/50 font-bold">Y: {Math.round(trail.y)}PX</span>
        </div>
      </div>
    </div>
  );
};

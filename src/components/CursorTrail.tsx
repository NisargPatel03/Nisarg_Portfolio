import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CursorTrailProps {
  enabled: boolean;
}

export const CursorTrail: React.FC<CursorTrailProps> = ({ enabled }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'button' | 'input' | 'project'>('default');
  const requestRef = useRef<number | null>(null);

  // Global class toggle on documentElement to hide default cursor
  useEffect(() => {
    if (enabled && isVisible) {
      document.documentElement.classList.add('custom-cursor-active');
    } else {
      document.documentElement.classList.remove('custom-cursor-active');
    }
    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [enabled, isVisible]);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Dynamically detect type of element under the cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('input') ||
          target.closest('textarea')
        ) {
          setCursorType('input');
        } else if (
          target.closest('.project-deck-card') ||
          target.closest('.terminal-project-card') ||
          target.closest('.preview-mockup-wrap')
        ) {
          setCursorType('project');
        } else if (
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.classList.contains('cursor-pointer') ||
          window.getComputedStyle(target).cursor === 'pointer'
        ) {
          setCursorType('button');
        } else {
          setCursorType('default');
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
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

  const renderSVG = () => {
    switch (cursorType) {
      case 'button':
        return (
          <motion.svg
            key="button-cursor"
            initial={{ scale: 0.6, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.6, rotate: 45, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            width="40"
            height="40"
            viewBox="0 0 40 40"
            className="overflow-visible"
          >
            {/* Target Crosshair */}
            <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" className="opacity-80" />
            <line x1="20" y1="2" x2="20" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="30" x2="20" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="2" y1="20" x2="10" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="30" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="20" cy="20" r="2" fill="currentColor" />
          </motion.svg>
        );
      case 'input':
        return (
          <motion.svg
            key="input-cursor"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            width="40"
            height="40"
            viewBox="0 0 40 40"
            className="overflow-visible"
          >
            {/* Coordinate bracket */}
            <path d="M 12 8 L 28 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M 12 32 L 28 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="8" x2="20" y2="32" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          </motion.svg>
        );
      case 'project':
        return (
          <motion.svg
            key="project-cursor"
            initial={{ scale: 0.5, rotate: 90, opacity: 0 }}
            animate={{ scale: 1.1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.5, rotate: -90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            width="48"
            height="48"
            viewBox="0 0 48 48"
            className="overflow-visible"
          >
            {/* Viewport frame brackets */}
            <path d="M 8 16 L 8 8 L 16 8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 32 8 L 40 8 L 40 16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 8 32 L 8 40 L 16 40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 32 40 L 40 40 L 40 32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Central small scope cross */}
            <path d="M 20 24 L 28 24 M 24 20 L 24 28" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" fill="none" className="opacity-60" />
          </motion.svg>
        );
      default:
        return (
          <motion.svg
            key="default-cursor"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            width="40"
            height="40"
            viewBox="0 0 40 40"
            className="overflow-visible"
          >
            {/* Rotating dashed ring and center dot */}
            <motion.circle
              cx="20"
              cy="20"
              r="12"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="6 3"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            />
            <circle cx="20" cy="20" r="3" fill="currentColor" />
          </motion.svg>
        );
    }
  };

  return (
    <div
      className="fixed pointer-events-none z-50 select-none hidden md:block"
      style={{
        left: `${trail.x}px`,
        top: `${trail.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="relative w-12 h-12 flex items-center justify-center transition-all duration-300"
        style={{ color: 'var(--accent-color, #00ff41)' }}
      >
        <AnimatePresence mode="wait">
          {renderSVG()}
        </AnimatePresence>

        {/* Telemetry coordinate readout */}
        <div
          className="absolute left-10 top-10 bg-[#0c0c0cd9] border border-white/10 px-2 py-1 rounded-md text-[8px] font-mono whitespace-nowrap flex flex-col gap-0.5 shadow-md"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--accent-color, #00ff41)',
            textShadow: '0 0 4px var(--accent-glow, rgba(0, 255, 65, 0.4))',
          }}
        >
          <span>SYS_PTR: {cursorType.toUpperCase()}</span>
          <span className="text-[#D7E2EA]/50 font-bold">X: {Math.round(trail.x)}PX</span>
          <span className="text-[#D7E2EA]/50 font-bold">Y: {Math.round(trail.y)}PX</span>
        </div>
      </div>
    </div>
  );
};

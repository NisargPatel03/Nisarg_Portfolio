import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { soundFX } from '../utils/terminalAudio';

interface GlitchHeaderProps {
  text: string;
  lightMode?: boolean;
}

export const GlitchHeader: React.FC<GlitchHeaderProps> = ({ text, lightMode = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Keyframes for three color layers (Cyan, Magenta, Yellow/Green)
  const cyanX = isHovered ? [0, -4, 3, -3, 2, -2, 0] : 0;
  const cyanY = isHovered ? [0, 2, -2, 3, -1, 1, 0] : 0;

  const magentaX = isHovered ? [0, 4, -3, 2, -2, 3, 0] : 0;
  const magentaY = isHovered ? [0, -2, 3, -2, 2, -1, 0] : 0;

  const greenX = isHovered ? [0, -2, 2, -4, 3, -1, 0] : 0;
  const greenY = isHovered ? [0, 3, -1, 2, -3, 2, 0] : 0;

  const mainX = isHovered ? [0, -1, 1, -1, 0] : 0;
  const mainY = isHovered ? [0, 1, -1, 1, 0] : 0;

  // Variants for scroll drawing
  const mainTextVariants = {
    hidden: {
      strokeDasharray: 500,
      strokeDashoffset: 500,
      fillOpacity: 0,
      stroke: lightMode ? '#005577' : 'var(--accent-color, #00f3ff)',
    },
    visible: {
      strokeDashoffset: 0,
      fillOpacity: 1,
      stroke: 'transparent',
      transition: {
        strokeDashoffset: { duration: 1.6, ease: 'easeInOut' as const },
        fillOpacity: { delay: 1.2, duration: 0.5, ease: 'easeOut' as const },
        stroke: { delay: 1.5, duration: 0.3 },
      },
    },
  };

  const glowLayersVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 1.3,
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-pointer select-none w-full max-w-[850px] mx-auto flex justify-center items-center overflow-visible"
    >
      <motion.svg
        viewBox="0 0 1000 160"
        className="w-full overflow-visible"
        style={{ height: 'auto', maxHeight: '160px' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        onViewportEnter={() => {
          soundFX.playScannerPing();
        }}
      >
        {/* Layer 1: Green Glow */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-none stroke-[#00ff41]/50 font-black uppercase tracking-wider"
          style={{
            fontSize: 'clamp(3.8rem, 8vw, 100px)',
            fontFamily: 'var(--font-glow, "Orbitron", "Inter", sans-serif)',
            strokeWidth: '3px',
          }}
          variants={glowLayersVariants}
          animate={isHovered ? { x: greenX, y: greenY } : undefined}
          transition={isHovered ? { duration: 0.24, ease: 'linear', repeat: Infinity } : undefined}
        >
          {text}
        </motion.text>

        {/* Layer 2: Cyan Glow */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-none stroke-[#00ffff]/60 font-black uppercase tracking-wider"
          style={{
            fontSize: 'clamp(3.8rem, 8vw, 100px)',
            fontFamily: 'var(--font-glow, "Orbitron", "Inter", sans-serif)',
            strokeWidth: '3px',
          }}
          variants={glowLayersVariants}
          animate={isHovered ? { x: cyanX, y: cyanY } : undefined}
          transition={isHovered ? { duration: 0.18, ease: 'linear', repeat: Infinity } : undefined}
        >
          {text}
        </motion.text>

        {/* Layer 3: Magenta Glow */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-none stroke-[#ff0055]/50 font-black uppercase tracking-wider"
          style={{
            fontSize: 'clamp(3.8rem, 8vw, 100px)',
            fontFamily: 'var(--font-glow, "Orbitron", "Inter", sans-serif)',
            strokeWidth: '3px',
          }}
          variants={glowLayersVariants}
          animate={isHovered ? { x: magentaX, y: magentaY } : undefined}
          transition={isHovered ? { duration: 0.22, ease: 'linear', repeat: Infinity } : undefined}
        >
          {text}
        </motion.text>

        {/* Layer 4: Main Foreground Text */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className={`${lightMode ? 'fill-[#0C0C0C]' : 'fill-white'} font-black uppercase tracking-wider`}
          style={{
            fontSize: 'clamp(3.8rem, 8vw, 100px)',
            fontFamily: 'var(--font-glow, "Orbitron", "Inter", sans-serif)',
            strokeWidth: '1.5px',
          }}
          variants={mainTextVariants}
          animate={isHovered ? { x: mainX, y: mainY } : undefined}
          transition={isHovered ? { duration: 0.15, ease: 'linear', repeat: Infinity } : undefined}
        >
          {text}
        </motion.text>
      </motion.svg>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';

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

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-pointer select-none w-full max-w-[850px] mx-auto flex justify-center items-center overflow-visible"
    >
      <svg
        viewBox="0 0 1000 160"
        className="w-full overflow-visible"
        style={{ height: 'auto', maxHeight: '160px' }}
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
          animate={{ x: greenX, y: greenY }}
          transition={{ duration: 0.24, ease: 'linear', repeat: isHovered ? Infinity : 0 }}
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
          animate={{ x: cyanX, y: cyanY }}
          transition={{ duration: 0.18, ease: 'linear', repeat: isHovered ? Infinity : 0 }}
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
          animate={{ x: magentaX, y: magentaY }}
          transition={{ duration: 0.22, ease: 'linear', repeat: isHovered ? Infinity : 0 }}
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
          }}
          animate={{ x: mainX, y: mainY }}
          transition={{ duration: 0.15, ease: 'linear', repeat: isHovered ? Infinity : 0 }}
        >
          {text}
        </motion.text>
      </svg>
    </div>
  );
};

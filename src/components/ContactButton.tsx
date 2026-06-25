import React from 'react';
import { motion } from 'framer-motion';

interface ContactButtonProps {
  className?: string;
  onClick?: () => void;
}

export const ContactButton: React.FC<ContactButtonProps> = ({ className = '', onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      if ((window as any).triggerWarpScroll) {
        (window as any).triggerWarpScroll('contact');
      } else {
        const contactSec = document.getElementById('contact');
        if (contactSec) {
          contactSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={`relative rounded-full text-white font-medium uppercase tracking-widest select-none overflow-hidden active:scale-95 transition-transform duration-100 px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base ${className}`}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* 2px white outline with -3px offset represented as a absolute positioned inset layer */}
      <span className="absolute inset-[3px] rounded-full border-2 border-white pointer-events-none opacity-80" />
      <span className="relative z-10">Contact Me</span>
    </motion.button>
  );
};

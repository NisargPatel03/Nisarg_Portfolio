import React from 'react';
import { motion } from 'framer-motion';

interface LiveProjectButtonProps {
  link?: string;
  label?: string;
  className?: string;
  onClick?: () => void;
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  link,
  label = 'Live Project',
  className = '',
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={`rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest select-none transition-all px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.button>
  );
};

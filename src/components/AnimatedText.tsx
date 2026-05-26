import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '', style }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  
  // Track scroll position of the paragraph element
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const characters = text.split('');
  const totalChars = characters.length;

  return (
    <p ref={containerRef} className={className} style={style}>
      {characters.map((char, index) => (
        <Char
          key={index}
          char={char}
          index={index}
          total={totalChars}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  );
};

interface CharProps {
  char: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

const Char: React.FC<CharProps> = ({ char, index, total, scrollYProgress }) => {
  // Stagger start and end ranges smoothly across the 0-1 scroll progress
  // We add a slight overlap (multiplying range) so letters blend smoothly together.
  const start = index / total;
  const end = Math.min(1, (index + 2.5) / total);
  
  // Transform scroll progress to opacity from 0.2 to 1
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block">
      {/* Invisible placeholder to preserve layout and typography bounds */}
      <span className="opacity-0 select-none pointer-events-none whitespace-pre">
        {char}
      </span>
      {/* Absolute positioned animated character */}
      <motion.span
        style={{ opacity }}
        className="absolute top-0 left-0 h-full w-full whitespace-pre"
      >
        {char}
      </motion.span>
    </span>
  );
};

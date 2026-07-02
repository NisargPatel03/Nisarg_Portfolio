import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { soundFX } from '../utils/terminalAudio';

interface DrawSectionHeaderProps {
  text: string;
  /** Use dark text+stroke for light-background sections (e.g. ServicesSection) */
  lightMode?: boolean;
  className?: string;
}

/**
 * Apple-style scroll-triggered SVG cursive text-writing animation.
 *
 * How it works:
 *  1. The title is rendered as SVG <text> using "Dancing Script" (cursive).
 *  2. We measure the text's computed stroke perimeter via getComputedTextLength()
 *     and set strokeDasharray = strokeDashoffset = that value.
 *  3. When the element enters the viewport (whileInView), Framer Motion
 *     animates strokeDashoffset → 0, making the outline appear to be
 *     "drawn" from left to right like handwriting.
 *  4. After the trace completes (~2.4 s), the solid fill fades in and the
 *     neon stroke gently fades out, leaving clean text behind.
 *  5. A Web Audio scanner ping fires on entry for tactile audio feedback.
 */
export const DrawSectionHeader: React.FC<DrawSectionHeaderProps> = ({
  text,
  lightMode = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef      = useRef<SVGTextElement>(null);
  const [dashLen, setDashLen] = useState<number>(3000);

  const isInView = useInView(containerRef, { once: true, margin: '-80px 0px' });
  const hasPlayed = useRef(false);

  // Measure actual text stroke length after font loads
  useEffect(() => {
    const measure = () => {
      if (textRef.current) {
        try {
          const len = textRef.current.getComputedTextLength();
          if (len > 0) setDashLen(Math.ceil(len * 3.2)); // ×3.2 covers full perimeter
        } catch {
          // font not yet loaded — retry
        }
      }
    };
    measure();
    // Retry after font may have loaded
    const t = setTimeout(measure, 600);
    return () => clearTimeout(t);
  }, [text]);

  // Play audio ping exactly once when section enters view
  useEffect(() => {
    if (isInView && !hasPlayed.current) {
      hasPlayed.current = true;
      soundFX.playScannerPing();
    }
  }, [isInView]);

  /* ─── colour palette ────────────────────────────────────────────── */
  const strokeColor = lightMode
    ? 'rgba(0, 40, 80, 0.9)'
    : 'var(--accent-color, #00f3ff)';

  const glowColor = lightMode
    ? 'rgba(0, 85, 119, 0.25)'
    : 'rgba(0, 243, 255, 0.35)';

  const fillColor = lightMode ? '#0C0C0C' : '#ffffff';

  /* ─── Framer Motion variants ────────────────────────────────────── */
  const traceVariants = {
    hidden: { strokeDashoffset: dashLen, opacity: 1 },
    visible: {
      strokeDashoffset: 0,
      transition: { duration: 2.4, ease: 'easeInOut' as const, delay: 0.1 },
    },
  };

  // Layer C: invisible before viewport, briefly flashes at full opacity
  // right after the stroke finishes drawing (~2.4 s), then fades out
  // as the fill (Layer D) takes over. Keyframe times are fractions of
  // the total 3.4 s sequence: 0=start, 0.74≈2.5 s, 0.85≈2.9 s, 1=3.4 s.
  const strokeFadeVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0, 0, 1, 0] as number[],
      transition: {
        times: [0, 0.73, 0.83, 1],
        duration: 3.4,
        ease: 'easeOut' as const,
      },
    },
  };

  const fillVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' as const, delay: 2.2 },
    },
  };

  /* ─── accent underline ──────────────────────────────────────────── */
  const underlineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' as const, delay: 2.7 },
    },
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none w-full max-w-[860px] mx-auto flex flex-col items-center justify-center overflow-visible ${className}`}
    >
      {/* ── SVG drawing canvas ──────────────────────────────────── */}
      <svg
        viewBox="0 0 1000 210"
        className="w-full overflow-visible"
        style={{ height: 'auto', maxHeight: '210px' }}
        aria-label={text}
      >
        <defs>
          {/* Neon blur glow */}
          <filter id={`draw-glow-${text.replace(/\s/g, '')}`} x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft glow halo behind the stroke */}
          <filter id={`draw-halo-${text.replace(/\s/g, '')}`} x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feFlood floodColor={glowColor} result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Layer A: wide background halo (decorative glow blob) ── */}
        {/* fontSize="155" is in SVG user units — scales with container width,
            e.g. 155 × (375/1000) = 58 px on mobile, 155 × 0.86 = 133 px desktop */}
        <motion.text
          x="50%"
          y="52%"
          textAnchor="middle"
          dominantBaseline="central"
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fontSize="155"
          filter={`url(#draw-halo-${text.replace(/\s/g, '')})`}
          style={{
            fontFamily: '"Dancing Script", cursive',
            fontWeight: 700,
            strokeDasharray: dashLen,
          }}
          variants={traceVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {text}
        </motion.text>

        {/* ── Layer B: crisp neon stroke trace ─────────────────────── */}
        <motion.text
          ref={textRef}
          x="50%"
          y="52%"
          textAnchor="middle"
          dominantBaseline="central"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fontSize="155"
          filter={`url(#draw-glow-${text.replace(/\s/g, '')})`}
          style={{
            fontFamily: '"Dancing Script", cursive',
            fontWeight: 700,
            strokeDasharray: dashLen,
          }}
          variants={traceVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        />

        {/* ── Layer C: stroke fade-out mask ─────────────────────────── */}
        <motion.text
          x="50%"
          y="52%"
          textAnchor="middle"
          dominantBaseline="central"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          fontSize="155"
          style={{
            fontFamily: '"Dancing Script", cursive',
            fontWeight: 700,
          }}
          variants={strokeFadeVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {text}
        </motion.text>

        {/* ── Layer D: solid fill reveal ────────────────────────────── */}
        <motion.text
          x="50%"
          y="52%"
          textAnchor="middle"
          dominantBaseline="central"
          fill={fillColor}
          stroke="none"
          fontSize="155"
          style={{
            fontFamily: '"Dancing Script", cursive',
            fontWeight: 700,
          }}
          variants={fillVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {text}
        </motion.text>
      </svg>

      {/* ── Decorative underline sweep ─────────────────────────────── */}
      <motion.div
        className="h-[2px] w-48 rounded-full mt-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${strokeColor}, transparent)`,
          originX: 0.5,
          boxShadow: `0 0 12px ${glowColor}`,
        }}
        variants={underlineVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      />
    </div>
  );
};

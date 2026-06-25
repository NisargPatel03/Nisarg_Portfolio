import React, { useState, useEffect, useRef } from 'react';

interface DecryptTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  triggerOnView?: boolean;
  hoverToScramble?: boolean;
  sectionId?: string; // Target section id to listen to for transition event
  style?: React.CSSProperties;
}

export const DecryptText: React.FC<DecryptTextProps> = ({
  text,
  className = '',
  delay = 0,
  duration = 600,
  triggerOnView = true,
  hoverToScramble = true,
  sectionId,
  style = {}
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasTriggeredOnScroll = useRef(false);

  const glyphs = '01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%-+=<>[]{}';

  const startDecryption = () => {
    setIsAnimating(true);
    const startTime = performance.now();
    const length = text.length;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Solve character counts progressively
      const resolvedCount = Math.floor(progress * length);

      let scrambled = '';
      for (let i = 0; i < length; i++) {
        if (i < resolvedCount) {
          scrambled += text[i];
        } else if (text[i] === ' ') {
          scrambled += ' ';
        } else {
          scrambled += glyphs[Math.floor(Math.random() * glyphs.length)];
        }
      }

      setDisplayText(scrambled);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Start with fully scrambled characters initially
    setDisplayText(text.replace(/[^\s]/g, () => glyphs[Math.floor(Math.random() * glyphs.length)]));

    // 1. Intersection Observer trigger (Viewport Scroll)
    let observer: IntersectionObserver | null = null;
    if (triggerOnView) {
      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && !hasTriggeredOnScroll.current) {
            hasTriggeredOnScroll.current = true;
            setTimeout(startDecryption, delay);
          }
        },
        { threshold: 0.1 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
    } else {
      // Immediate/timed trigger
      const timer = setTimeout(startDecryption, delay);
      return () => clearTimeout(timer);
    }

    // 2. Custom event trigger (Navigation link click transition)
    const handleDecryptEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (sectionId && customEvent.detail && customEvent.detail.id === sectionId) {
        setTimeout(startDecryption, delay);
      }
    };

    window.addEventListener('decrypt-section', handleDecryptEvent);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('decrypt-section', handleDecryptEvent);
    };
  }, [text, delay, triggerOnView, sectionId]);

  const handleMouseEnter = () => {
    if (hoverToScramble && !isAnimating) {
      startDecryption();
    }
  };

  return (
    <span
      ref={elementRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      style={{
        display: 'inline-block',
        ...style
      }}
    >
      {displayText}
    </span>
  );
};

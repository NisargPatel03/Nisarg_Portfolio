import React, { useEffect, useRef, useState } from 'react';
import { soundFX } from '../utils/terminalAudio';

export const CyberGrid: React.FC = () => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isWarping, setIsWarping] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const isWarpingRef = useRef(false);
  const isProgrammaticWarpRef = useRef(false);

  useEffect(() => {
    isWarpingRef.current = isWarping;
  }, [isWarping]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let warpTimeout: any;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = performance.now();
      const timeDiff = currentTime - lastTime;

      if (isProgrammaticWarpRef.current) {
        lastScrollY = currentScrollY;
        lastTime = currentTime;
        setScrollOffset(currentScrollY);
        return;
      }

      if (timeDiff > 0) {
        const velocity = Math.abs(currentScrollY - lastScrollY) / timeDiff;
        // If scrolling velocity exceeds 1.8 px/ms (fast speed), trigger temporary 3D warp
        if (velocity > 1.8) {
          setIsWarping(true);
          clearTimeout(warpTimeout);
          warpTimeout = setTimeout(() => {
            setIsWarping(false);
          }, 350);
        }
      }

      lastScrollY = currentScrollY;
      lastTime = currentTime;
      setScrollOffset(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Programmatic triggers from navigation clicks
    const handleWarpStart = () => {
      isProgrammaticWarpRef.current = true;
      setIsWarping(true);
    };
    const handleWarpEnd = () => {
      isProgrammaticWarpRef.current = false;
      setIsWarping(false);
    };

    window.addEventListener('grid-warp-start', handleWarpStart);
    window.addEventListener('grid-warp-end', handleWarpEnd);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('grid-warp-start', handleWarpStart);
      window.removeEventListener('grid-warp-end', handleWarpEnd);
      clearTimeout(warpTimeout);
    };
  }, []);

  useEffect(() => {
    let frameId: number;

    const updatePulse = () => {
      const analyser = soundFX.getAnalyser();
      if (analyser && gridRef.current && soundFX.enabled) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const intensity = average / 255;

        // Boost pulse scale and glow brightness during grid warp
        const warpMultiplier = isWarpingRef.current ? 1.8 : 1.0;
        const scale = 1 + intensity * 0.08 * warpMultiplier;
        const glowOpacity = (isWarpingRef.current ? 0.7 : 0.35) + intensity * 0.65;

        gridRef.current.style.setProperty('--grid-scale', scale.toString());
        gridRef.current.style.setProperty('--grid-glow', glowOpacity.toString());
      } else if (gridRef.current) {
        const fallbackGlow = isWarpingRef.current ? '0.7' : '0.35';
        gridRef.current.style.setProperty('--grid-scale', '1');
        gridRef.current.style.setProperty('--grid-glow', fallbackGlow);
      }

      frameId = requestAnimationFrame(updatePulse);
    };

    updatePulse();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      className="cyber-grid-wrapper"
      style={{
        transform: `translateY(${scrollOffset * 0.12}px)`,
      }}
    >
      <div
        ref={gridRef}
        className={`cyber-grid ${isWarping ? 'is-warping' : ''}`}
        style={{
          transform: isWarping
            ? `perspective(300px) rotateX(72deg) translateZ(80px) scale(calc(var(--grid-scale, 1) * 1.25))`
            : `scale(var(--grid-scale, 1))`,
          opacity: `var(--grid-glow, 0.35)`,
        }}
      />
    </div>
  );
};

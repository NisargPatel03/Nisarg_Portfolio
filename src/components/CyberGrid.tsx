import React, { useEffect, useRef, useState } from 'react';
import { soundFX } from '../utils/terminalAudio';

export const CyberGrid: React.FC = () => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let frameId: number;
    
    // Read frequencies from soundFX analyser and update grid transform variables
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
        
        // Map average amplitude to scaling factor and opacity multiplier
        const scale = 1 + intensity * 0.08;
        const glowOpacity = 0.35 + intensity * 0.65;
        
        gridRef.current.style.setProperty('--grid-scale', scale.toString());
        gridRef.current.style.setProperty('--grid-glow', glowOpacity.toString());
      } else if (gridRef.current) {
        gridRef.current.style.setProperty('--grid-scale', '1');
        gridRef.current.style.setProperty('--grid-glow', '0.35');
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
      ref={gridRef}
      className="cyber-grid"
      style={{
        transform: `translateY(${scrollOffset * 0.12}px) scale(var(--grid-scale, 1))`,
        opacity: `var(--grid-glow, 0.35)`,
      }}
    />
  );
};

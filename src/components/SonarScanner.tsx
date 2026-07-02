import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundFX } from '../utils/terminalAudio';

interface Ping {
  id: number;
  x: number;
  y: number;
}

export const SonarScanner: React.FC = () => {
  const [pings, setPings] = useState<Ping[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // 1. Filter out clicks on interactive elements
      const target = e.target as HTMLElement;
      if (
        !target ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('[role="button"]') ||
        target.closest('.no-sonar-trigger')
      ) {
        return;
      }

      // Capture absolute click positions
      const x = e.clientX;
      const y = e.clientY;
      const id = Date.now() + Math.random();

      // 2. Play Synthesized Spatial Sonar Ping
      const panValue = (x / window.innerWidth) * 2 - 1; // scale left/right to [-1.0, 1.0]
      soundFX.playSonarPing(panValue);

      // 3. Add to Visual Ripples state
      setPings((prev) => [...prev, { id, x, y }]);

      // 4. Scan for secret targets to illuminate
      const targets = document.querySelectorAll('.sonar-target');
      const waveSpeed = 900; // pixels per second wave propagation speed

      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const tx = rect.left + rect.width / 2;
        const ty = rect.top + rect.height / 2;
        
        // Compute Euclidean distance from click to target center
        const dx = tx - x;
        const dy = ty - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Limit the detection wave threshold to 1500px radius
        if (dist < 1500) {
          const delayMs = (dist / waveSpeed) * 1000;
          const htmlEl = el as HTMLElement;

          // Clear any pending timeouts scheduled from previous clicks on this node
          const pendingReveal = htmlEl.dataset.pendingReveal;
          if (pendingReveal) clearTimeout(parseInt(pendingReveal, 10));

          const pendingHide = htmlEl.dataset.pendingHide;
          if (pendingHide) clearTimeout(parseInt(pendingHide, 10));

          // Schedule illumination exactly when the wave front reaches the element
          const revealId = window.setTimeout(() => {
            htmlEl.classList.add('sonar-revealed');
            htmlEl.removeAttribute('data-pending-reveal');

            // Schedule the element to fade back into secrecy after 3.5 seconds
            const hideId = window.setTimeout(() => {
              htmlEl.classList.remove('sonar-revealed');
              htmlEl.removeAttribute('data-pending-hide');
            }, 3500);

            htmlEl.dataset.pendingHide = hideId.toString();
          }, delayMs);

          htmlEl.dataset.pendingReveal = revealId.toString();
        }
      });
    };

    window.addEventListener('click', handleClick, { passive: true });
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleAnimationComplete = (id: number) => {
    setPings((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none z-50">
      <AnimatePresence>
        {pings.map((ping) => (
          <motion.div
            key={ping.id}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.1, 0.8, 0.15, 1.0] }}
            onAnimationComplete={() => handleAnimationComplete(ping.id)}
            className="absolute rounded-full flex items-center justify-center"
            style={{
              left: ping.x,
              top: ping.y,
              x: '-50%',
              y: '-50%',
              width: '800px',
              height: '800px',
            }}
          >
            {/* Primary Neon Laser Sweep */}
            <div
              className="absolute inset-0 rounded-full border-2"
              style={{
                borderColor: 'var(--accent-color, #00f3ff)',
                boxShadow: '0 0 15px rgba(var(--accent-rgb, 0, 243, 255), 0.5), inset 0 0 15px rgba(var(--accent-rgb, 0, 243, 255), 0.3)',
              }}
            />
            {/* Secondary Dashed Propagation Ripple */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0.4 }}
              animate={{ scale: 1.0, opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute inset-6 rounded-full border border-dashed"
              style={{
                borderColor: 'rgba(var(--accent-rgb, 0, 243, 255), 0.4)',
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

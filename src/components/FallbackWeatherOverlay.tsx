import React, { useEffect, useRef, useState } from 'react';
import { climateService, type ClimateData } from '../utils/climateService';

interface FallbackWeatherOverlayProps {
  isGlShaderActive: boolean;
}

interface RainDrop {
  x: number;
  y: number;
  speedY: number;
  length: number;
  opacity: number;
}

interface SnowFlake {
  x: number;
  y: number;
  speedY: number;
  speedX: number;
  radius: number;
  opacity: number;
  swingRange: number;
  swingSpeed: number;
}

export const FallbackWeatherOverlay: React.FC<FallbackWeatherOverlayProps> = ({ isGlShaderActive }) => {
  const [climate, setClimate] = useState<ClimateData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Read climate service status
  useEffect(() => {
    const unsubscribe = climateService.subscribe((data) => {
      setClimate(data);
    });
    return unsubscribe;
  }, []);

  // Run particle canvas simulation when GL shader is disabled and weather is active
  useEffect(() => {
    if (isGlShaderActive || !climate) return;
    const showParticles = climate.isRainy || climate.isSnowy;
    if (!showParticles) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Resize listener
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize particles
    const rainDrops: RainDrop[] = [];
    const snowFlakes: SnowFlake[] = [];

    // Pre-populate particles based on viewport size
    const rainCount = Math.floor((width * height) / 15000);
    const snowCount = Math.floor((width * height) / 20000);

    if (climate.isRainy) {
      for (let i = 0; i < rainCount; i++) {
        rainDrops.push({
          x: Math.random() * width,
          y: Math.random() * height - height,
          speedY: 12 + Math.random() * 8,
          length: 15 + Math.random() * 15,
          opacity: 0.15 + Math.random() * 0.3,
        });
      }
    }

    if (climate.isSnowy) {
      for (let i = 0; i < snowCount; i++) {
        snowFlakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speedY: 0.8 + Math.random() * 1.2,
          speedX: -0.3 + Math.random() * 0.6,
          radius: 2 + Math.random() * 3.5,
          opacity: 0.25 + Math.random() * 0.5,
          swingRange: 10 + Math.random() * 20,
          swingSpeed: 0.01 + Math.random() * 0.02,
        });
      }
    }

    const startTime = performance.now();

    // Render loop
    const loop = () => {
      const time = (performance.now() - startTime) / 1000.0;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Rain
      if (climate.isRainy && rainDrops.length > 0) {
        ctx.strokeStyle = 'rgba(174, 219, 255, 0.45)';
        ctx.lineWidth = 1.2;
        for (let i = 0; i < rainDrops.length; i++) {
          const p = rainDrops[i];
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 1, p.y + p.length); // slightly diagonal fall
          ctx.stroke();

          // Move
          p.y += p.speedY;
          p.x -= 0.5; // wind drift

          // Reset when out of viewport
          if (p.y > height) {
            p.y = -p.length;
            p.x = Math.random() * width;
          }
        }
      }

      // 2. Draw Snow
      if (climate.isSnowy && snowFlakes.length > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        for (let i = 0; i < snowFlakes.length; i++) {
          const p = snowFlakes[i];
          
          // Sway movement using sine wave
          const swayX = Math.sin(time * p.swingSpeed * 60 + p.x) * 0.35;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          // Move
          p.y += p.speedY;
          p.x += p.speedX + swayX;

          // Reset when out of viewport
          if (p.y > height) {
            p.y = -p.radius * 2;
            p.x = Math.random() * width;
          }
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isGlShaderActive, climate]);

  // If WebGL canvas is handling it, do not render fallbacks
  if (isGlShaderActive || !climate) return null;

  return (
    <>
      {/* 2D Particle Canvas for fallback Rain/Snow */}
      {(climate.isRainy || climate.isSnowy) && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[1] mix-blend-screen"
          style={{ opacity: 0.85 }}
        />
      )}
    </>
  );
};

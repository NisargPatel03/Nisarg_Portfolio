import React, { useState, useEffect, useRef } from 'react';
import { FadeIn } from '../components/FadeIn';
import { Magnet } from '../components/Magnet';
import { ContactButton } from '../components/ContactButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGlitched, setIsGlitched] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Work Experience', id: 'work-experience' },
    { label: 'Projects', id: 'projects-section' },
    { label: 'Certifications', id: 'certifications' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    if ((window as any).triggerWarpScroll) {
      (window as any).triggerWarpScroll(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Periodic random heading glitch trigger
  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitched(true);
      setTimeout(() => {
        setIsGlitched(false);
      }, 300);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        triggerGlitch();
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // 3D Holographic Particle Grid animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    const COLS = 26;
    const ROWS = 20;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now() * 0.0012;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Extract active global accent theme color
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#FF00C7';

      const projPoints: { x: number; y: number; z: number }[][] = [];

      for (let r = 0; r < ROWS; r++) {
        const rowPoints: { x: number; y: number; z: number }[] = [];
        for (let c = 0; c < COLS; c++) {
          const x3d = (c - COLS / 2) * (canvas.width / COLS) * 0.95;
          const y3d = (r - ROWS / 2) * (canvas.height / ROWS) * 0.95;
          
          // Ripple depth wave formula
          const z3d = Math.sin(c * 0.35 + now) * Math.cos(r * 0.3 + now * 0.8) * 45;

          const perspective = 550;
          const scale = perspective / (perspective + z3d);
          let px = centerX + x3d * scale;
          let py = centerY + y3d * scale;

          // Pointer magnetic coordinate bending
          if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
            const dx = mouseRef.current.x - px;
            const dy = mouseRef.current.y - py;
            const dist = Math.hypot(dx, dy);
            if (dist < 160) {
              const factor = (160 - dist) / 160;
              px -= (dx / dist) * factor * 32;
              py -= (dy / dist) * factor * 32;
            }
          }

          rowPoints.push({ x: px, y: py, z: z3d });
        }
        projPoints.push(rowPoints);
      }

      // Render grid connections
      ctx.lineWidth = 0.6;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const pt = projPoints[r][c];

          if (c < COLS - 1) {
            const nextPt = projPoints[r][c + 1];
            ctx.strokeStyle = `${accentColor}0a`; // ~4% opacity
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(nextPt.x, nextPt.y);
            ctx.stroke();
          }

          if (r < ROWS - 1) {
            const downPt = projPoints[r + 1][c];
            ctx.strokeStyle = `${accentColor}0a`; // ~4% opacity
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(downPt.x, downPt.y);
            ctx.stroke();
          }

          // Node intersection dots
          ctx.fillStyle = `${accentColor}1c`; // ~11% opacity
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      frameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleMouseLeave = () => {
    mouseRef.current.x = null;
    mouseRef.current.y = null;
  };

  return (
    <section 
      id="hero" 
      className="h-screen flex flex-col justify-between relative overflow-hidden w-full select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Holographic Particle Grid Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50" />

      {/* 1. NAVBAR */}
      <FadeIn as="nav" y={-20} delay={0} duration={0.8} className="w-full z-30">
        <div className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8">
          {/* Logo Placeholder (Global Floating Monogram lands here) */}
          <div className="w-[50px] h-[40px] pointer-events-none" />
          
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="text-[#D7E2EA] font-medium uppercase tracking-wider text-xs sm:text-sm md:text-base lg:text-[1.1rem] hover:opacity-70 transition-opacity duration-200 font-orbitron font-glow"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden text-[#D7E2EA] hover:text-[#B600A8] transition-colors z-40 p-2"
            type="button"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </FadeIn>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[#0C0C0C] z-30 flex flex-col justify-center items-center gap-8 md:hidden backdrop-blur-xl bg-opacity-95"
          >
            {navItems.map((item, idx) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  handleNavClick(item.id);
                }}
                className="text-white font-extrabold uppercase tracking-widest text-lg sm:text-xl hover:text-[#B600A8] transition-colors font-orbitron"
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO PORTRAIT (Absolute center layering) */}
      <div className="absolute inset-0 flex justify-center items-end sm:items-end overflow-hidden pointer-events-none z-10">
        <FadeIn
          y={30}
          delay={0.6}
          duration={0.9}
          className="relative w-full h-full flex justify-center items-center sm:items-end pointer-events-auto"
        >
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
            className="absolute left-[40%] sm:left-1/2 -translate-x-1/2 bottom-1/2 translate-y-1/2 sm:translate-y-0 sm:bottom-0 w-[240px] sm:w-[340px] md:w-[420px] lg:w-[480px] xl:w-[500px]"
          >
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
              alt="Nisarg Patel Portrait"
              className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(182,0,168,0.15)] pointer-events-none"
            />
          </Magnet>
        </FadeIn>
      </div>

      {/* 3. HERO HEADING */}
      <div className="flex-grow flex items-center justify-center relative z-20 px-6 md:px-10">
        <div className="overflow-hidden w-full text-center mt-6 sm:mt-4 md:-mt-5">
          <FadeIn y={40} delay={0.15} duration={0.8}>
            <h1 
              className={`hero-heading font-black uppercase tracking-tighter leading-none whitespace-nowrap w-full font-orbitron font-interlaced ${isGlitched ? 'glitch-text' : ''}`}
              style={{ fontSize: 'clamp(1.8rem, 10vw, 165px)' }}
            >
              Hi, i&apos;m nisarg
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* 4. BOTTOM BAR */}
      <div className="w-full z-20 px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 flex justify-between items-end mt-auto gap-4">
        {/* Left: Bio Phrase */}
        <FadeIn y={20} delay={0.35} duration={0.8} className="text-left">
          <p 
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[280px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            a full-stack developer driven by crafting striking and unforgettable digital experiences
          </p>
        </FadeIn>

        {/* Right: Contact Call-to-action */}
        <FadeIn y={20} delay={0.5} duration={0.8}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
};

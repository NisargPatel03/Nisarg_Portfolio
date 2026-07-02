import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { HeroSection } from './sections/HeroSection';
import { MarqueeSection } from './sections/MarqueeSection';
import { ArchitectureSection } from './sections/ArchitectureSection';
import { AboutSection } from './sections/AboutSection';
import { WorkExperience } from './sections/WorkExperience';
import { ServicesSection } from './sections/ServicesSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { CertificationsSection } from './sections/CertificationsSection';
import { ContactSection } from './sections/ContactSection';
import { CommandPalette } from './components/CommandPalette';
import { MatrixRain } from './components/MatrixRain';
import { CursorTrail } from './components/CursorTrail';
import { soundFX } from './utils/terminalAudio';
import { DiagnosticsHUD } from './components/DiagnosticsHUD';
import { useRef } from 'react';
import { LiquidGlassCanvas } from './components/LiquidGlassCanvas';
import { CyberGrid } from './components/CyberGrid';
import { BiometricAuthScreen } from './components/BiometricAuthScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { MeltdownOverlay } from './components/MeltdownOverlay';
import { BlueprintToggle } from './components/BlueprintToggle';
import { BlueprintOverlay } from './components/BlueprintOverlay';
import { AiCloneTerminal } from './components/AiCloneTerminal';
import { Preloader } from './components/Preloader';
import { KatanaWipe } from './components/KatanaWipe';
import { SonarScanner } from './components/SonarScanner';


const SECTIONS = [
  { id: 'hero', label: 'SYS_BOOT' },
  { id: 'skills', label: 'BIO_NET' },
  { id: 'architecture', label: 'SYS_ARCH' },
  { id: 'about', label: 'BIO_CORE' },
  { id: 'work-experience', label: 'GIT_TREE' },
  { id: 'services', label: 'SANDBOX' },
  { id: 'projects-section', label: '3D_DECK' },
  { id: 'certifications', label: 'CERT_VER' },
  { id: 'contact', label: 'COM_UPLINK' }
];

function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [isSoundActive, setIsSoundActive] = useState(false);
  const [isAmbientActive, setIsAmbientActive] = useState(false);
  const [isCursorTrailActive, setIsCursorTrailActive] = useState(false);
  const [isHudActive, setIsHudActive] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(true);
  const [isMeltdownActive, setIsMeltdownActive] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'project' | 'toxic-radar' | 'vapor-matrix' | 'amber-console' | 'blueprint-arctic'>('project');
  const [isBlueprintMode, setIsBlueprintMode] = useState(false);
  const [isDrawingComplete, setIsDrawingComplete] = useState(false);
  const [isGlShaderActive, setIsGlShaderActive] = useState(false);

  useEffect(() => {
    const drawingTimer = setTimeout(() => {
      setIsDrawingComplete(true);
    }, 2800);

    const completeTimer = setTimeout(() => {
      setShowPreloader(false);
    }, 3800);

    return () => {
      clearTimeout(drawingTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isBlueprintMode) {
      root.classList.add('blueprint-mode-active');
    } else {
      root.classList.remove('blueprint-mode-active');
    }
  }, [isBlueprintMode]);

  useEffect(() => {
    const handleTourCommand = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { action, target, value } = customEvent.detail;

      if (action === 'scroll' && target) {
        if ((window as any).triggerWarpScroll) {
          (window as any).triggerWarpScroll(target);
        } else {
          const el = document.getElementById(target);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else if (action === 'toggleBlueprint') {
        setIsBlueprintMode(!!value);
      }
    };

    window.addEventListener('aiTourCommand', handleTourCommand);
    return () => {
      window.removeEventListener('aiTourCommand', handleTourCommand);
    };
  }, []);

  // Global mousemove position tracker for premium border light reflections
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.cyber-light-border') as HTMLElement;
      if (target) {
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        target.style.setProperty('--mouse-x', `${x}px`);
        target.style.setProperty('--mouse-y', `${y}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);




  const handleSetTheme = (theme: 'project' | 'toxic-radar' | 'vapor-matrix' | 'amber-console' | 'blueprint-arctic') => {
    const root = document.documentElement;
    root.className = theme === 'project' ? '' : `theme-${theme}`;

    if (theme === 'project') {
      root.style.removeProperty('--accent-color');
      root.style.removeProperty('--accent-glow');
      root.style.removeProperty('--accent-rgb');
    } else {
      const colors = {
        'toxic-radar': '#00ff41',
        'vapor-matrix': '#ff00c7',
        'amber-console': '#ffb000',
        'blueprint-arctic': '#0088ff',
      };
      const glows = {
        'toxic-radar': 'rgba(0, 255, 65, 0.4)',
        'vapor-matrix': 'rgba(255, 0, 199, 0.4)',
        'amber-console': 'rgba(255, 176, 0, 0.4)',
        'blueprint-arctic': 'rgba(0, 136, 255, 0.4)',
      };
      const rgbs = {
        'toxic-radar': '0, 255, 65',
        'vapor-matrix': '255, 0, 199',
        'amber-console': '255, 176, 0',
        'blueprint-arctic': '0, 136, 255',
      };
      root.style.setProperty('--accent-color', colors[theme]);
      root.style.setProperty('--accent-glow', glows[theme]);
      root.style.setProperty('--accent-rgb', rgbs[theme]);
    }
    setActiveTheme(theme);
  };

  const [activeSection, setActiveSection] = useState('SYS_BOOT');

  const activeSectionRef = useRef('SYS_BOOT');

  useEffect(() => {
    const handleScroll = () => {
      let currentActive = 'SYS_BOOT';
      let minDistance = Infinity;
      SECTIONS.forEach((sect) => {
        const el = document.getElementById(sect.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top);
          if (distance < minDistance) {
            minDistance = distance;
            currentActive = sect.label;
          }
        }
      });

      if (currentActive !== activeSectionRef.current) {
        activeSectionRef.current = currentActive;
        setActiveSection(currentActive);
        soundFX.setAmbientThemeForSection(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Synchronize global sound preference
    soundFX.enabled = isSoundActive;
  }, [isSoundActive]);

  useEffect(() => {
    if (isAmbientActive) {
      soundFX.startAmbient();
      soundFX.setAmbientThemeForSection(activeSectionRef.current);
    } else {
      soundFX.stopAmbient();
    }
    return () => {
      soundFX.stopAmbient();
    };
  }, [isAmbientActive]);

  useEffect(() => {
    // Initialize Lenis buttery-smooth momentum scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Premium exponential deceleration curve
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      delete (window as any).lenis;
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    (window as any).triggerWarpScroll = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
        window.dispatchEvent(new CustomEvent('katana-cut-start'));
        window.dispatchEvent(new CustomEvent('grid-warp-start'));
        soundFX.playClick();
        
        // Wait 300ms for panels to close and fully cover the screen
        setTimeout(() => {
          const lenisInstance = (window as any).lenis;
          if (lenisInstance) {
            lenisInstance.scrollTo(element, { immediate: true });
          } else {
            element.scrollIntoView();
          }

          // Wait briefly while in closed state, then trigger opening phase
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('katana-cut-open'));

            // After panels open, trigger end events to normalize particle speed
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('grid-warp-end'));
            }, 500);
          }, 200);
        }, 300);
      }
    };

    (window as any).triggerMeltdown = () => {
      setIsMeltdownActive(true);
      soundFX.playLockdownAlarm();
      const lenisInstance = (window as any).lenis;
      if (lenisInstance) {
        lenisInstance.stop();
      }
    };

    (window as any).stabilizeMeltdown = () => {
      setIsMeltdownActive(false);
      soundFX.stopLockdownAlarm();
      const lenisInstance = (window as any).lenis;
      if (lenisInstance) {
        lenisInstance.start();
      }
    };

    return () => {
      delete (window as any).triggerWarpScroll;
      delete (window as any).triggerMeltdown;
      delete (window as any).stabilizeMeltdown;
    };
  }, []);


  return (
    <div className="w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] overflow-x-clip select-none relative">
      {/* Boot Preloader Sequence */}
      <AnimatePresence>
        {showPreloader && (
          <Preloader onComplete={() => setShowPreloader(false)} />
        )}
      </AnimatePresence>

      {/* Onboarding Biometric Auth Scan Screen */}
      <AnimatePresence>
        {!showPreloader && showAuthScreen && (
          <BiometricAuthScreen
            onBypass={() => setShowAuthScreen(false)}
            onUnlock={() => {
              setIsMatrixActive(true);
              setIsHudActive(true);
              setIsSoundActive(true);
              setShowAuthScreen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating Global Logo (drifts from center preloader using layout physics) */}
      <motion.div
        layout
        style={showPreloader ? {
          position: 'fixed' as const,
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          width: '380px',
          height: '280px',
          zIndex: 10005,
        } : {
          position: 'fixed' as const,
          left: '24px',
          top: '24px',
          x: '0%',
          y: '0%',
          width: '55px',
          height: '42px',
          zIndex: 10005,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 13 }}
        className={`cursor-pointer hover:opacity-75 transition-opacity flex items-center justify-center ${
          showPreloader ? 'pointer-events-none' : ''
        } ${isMeltdownActive ? 'opacity-0 pointer-events-none' : ''}`}
        onClick={() => {
          if (!showPreloader && !showAuthScreen) {
            if ((window as any).triggerWarpScroll) {
              (window as any).triggerWarpScroll('hero');
            }
          }
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 320 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_0_16px_rgba(0,243,255,0.45)]"
        >
          {showPreloader && (
            <>
              <line x1="40" y1="120" x2="280" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              <line x1="170" y1="30" x2="170" y2="210" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            </>
          )}
          <motion.path
            d="M 70 180 L 70 60 L 150 180 L 150 60"
            stroke="var(--accent-color, #00f3ff)"
            initial={{ pathLength: 0, strokeWidth: showPreloader ? 23 : 13 }}
            animate={{ pathLength: 1, strokeWidth: showPreloader ? 23 : 13 }}
            strokeLinecap="round"
            strokeLinejoin="round"
            transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.2 }}
            style={isDrawingComplete ? {
              fill: 'rgba(0, 243, 255, 0.08)',
              transition: 'fill 0.8s ease-in-out',
            } : undefined}
          />
          <motion.path
            d="M 190 180 L 190 60 L 250 60 C 270 60 270 120 250 120 L 190 120"
            stroke={isBlueprintMode ? "var(--accent-color, #00f3ff)" : "#ff00c7"}
            initial={{ pathLength: 0, strokeWidth: showPreloader ? 23 : 13 }}
            animate={{ pathLength: 1, strokeWidth: showPreloader ? 23 : 13 }}
            strokeLinecap="round"
            strokeLinejoin="round"
            transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.2 }}
            style={isDrawingComplete ? {
              fill: 'rgba(255, 0, 199, 0.08)',
              transition: 'fill 0.8s ease-in-out',
            } : undefined}
          />
        </svg>
      </motion.div>

      {!showAuthScreen && (
        <>
          {isMeltdownActive && <MeltdownOverlay />}
          {isBlueprintMode && <BlueprintOverlay />}
          <BlueprintToggle isActive={isBlueprintMode} onToggle={setIsBlueprintMode} />
          <AiCloneTerminal isBlueprintMode={isBlueprintMode} />
          <KatanaWipe />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={isMeltdownActive ? 'meltdown-active' : ''}
          >
            {/* Parallax Audio-reactive Grid & WebGL Refraction */}
            {isGlShaderActive ? (
              <>
                <LiquidGlassCanvas activeTheme={activeTheme} isMatrixActive={isMatrixActive} />
                {/* Easter Egg Matrix digital rain layer (rendered hidden for WebGL sampling) */}
                <MatrixRain isGlActive={true} />

              </>
            ) : (
              <>
                <CyberGrid />
                {isMatrixActive && <MatrixRain isGlActive={false} />}
              </>
            )}

          {/* Cybernetic pointer coordinate trail */}
          <CursorTrail enabled={isCursorTrailActive} />

          {/* Sonar Ping Space Scanner Overlay */}
          <SonarScanner />

          {/* Real-time Diagnostics HUD sidebar */}
          <DiagnosticsHUD 
            enabled={isHudActive}
            isSoundActive={isSoundActive}
            isAmbientActive={isAmbientActive}
            isCursorTrailActive={isCursorTrailActive}
            isMatrixActive={isMatrixActive}
            activeSection={activeSection}
          />

          {/* Global command search shell */}
          <CommandPalette
            isMatrixActive={isMatrixActive}
            onToggleMatrix={() => setIsMatrixActive((prev) => !prev)}
            isSoundActive={isSoundActive}
            onToggleSound={() => setIsSoundActive((prev) => !prev)}
            isAmbientActive={isAmbientActive}
            onToggleAmbient={() => setIsAmbientActive((prev) => !prev)}
            isCursorTrailActive={isCursorTrailActive}
            onToggleCursorTrail={() => setIsCursorTrailActive((prev) => !prev)}
            isHudActive={isHudActive}
            onToggleHud={() => setIsHudActive((prev) => !prev)}
            isGlShaderActive={isGlShaderActive}
            onToggleGlShader={() => setIsGlShaderActive((prev) => !prev)}
            activeTheme={activeTheme}
            onChangeTheme={handleSetTheme}
          />

          {/* 1. HERO SECTION */}
          <HeroSection />

          {/* 2. MARQUEE SECTION */}
          <MarqueeSection />

          {/* 2b. SYSTEM ARCHITECTURE BLUEPRINT SECTION */}
          <ArchitectureSection />

          {/* 3. ABOUT SECTION */}
          <AboutSection />

          {/* 4. WORK EXPERIENCE TIMELINE */}
          <WorkExperience />

          {/* 5. SERVICES SECTION */}
          <ServicesSection />

          {/* 6. PROJECTS SECTION (Terminal CLI deploy) */}
          <ProjectsSection
            activeTheme={activeTheme}
            setActiveTheme={handleSetTheme}
            isBlueprintMode={isBlueprintMode}
          />

          {/* 7. CERTIFICATIONS FILTER BROWSER */}
          <CertificationsSection />

          {/* 9. CONTACT & FOOTER */}
          <ContactSection />
        </motion.div>
      </>
      )}
    </div>
  );
}

export default App;

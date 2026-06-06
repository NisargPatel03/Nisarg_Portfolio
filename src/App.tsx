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
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [isSoundActive, setIsSoundActive] = useState(false);
  const [isAmbientActive, setIsAmbientActive] = useState(false);
  const [isCursorTrailActive, setIsCursorTrailActive] = useState(false);
  const [isHudActive, setIsHudActive] = useState(false);

  const [isCrtTransitionEnabled, setIsCrtTransitionEnabled] = useState(true);
  const [isCrtTransitionActive, setIsCrtTransitionActive] = useState(false);
  const [activeSection, setActiveSection] = useState('SYS_BOOT');

  const lastTransitionTimeRef = useRef(0);
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
        const previousSection = activeSectionRef.current;
        activeSectionRef.current = currentActive;
        setActiveSection(currentActive);

        const now = Date.now();
        if (
          isCrtTransitionEnabled && 
          now - lastTransitionTimeRef.current > 1500 && 
          previousSection !== ''
        ) {
          lastTransitionTimeRef.current = now;
          setIsCrtTransitionActive(true);
          soundFX.playCrtTransition();
          setTimeout(() => {
            setIsCrtTransitionActive(false);
          }, 450);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCrtTransitionEnabled]);

  useEffect(() => {
    // Synchronize global sound preference
    soundFX.enabled = isSoundActive;
  }, [isSoundActive]);

  useEffect(() => {
    if (isAmbientActive) {
      soundFX.startAmbient();
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

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] overflow-x-clip select-none relative">
      {/* Easter Egg Matrix digital rain layer */}
      {isMatrixActive && <MatrixRain />}

      {/* Cybernetic pointer coordinate trail */}
      <CursorTrail enabled={isCursorTrailActive} />

      {/* Real-time Diagnostics HUD sidebar */}
      <DiagnosticsHUD 
        enabled={isHudActive}
        isSoundActive={isSoundActive}
        isAmbientActive={isAmbientActive}
        isCursorTrailActive={isCursorTrailActive}
        isMatrixActive={isMatrixActive}
        activeSection={activeSection}
      />

      {/* CRT center dot flash overlay */}
      {isCrtTransitionActive && <div className="crt-dot-flash" />}

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
        isCrtTransitionEnabled={isCrtTransitionEnabled}
        onToggleCrtTransition={() => setIsCrtTransitionEnabled((prev) => !prev)}
      />

      <div className={isCrtTransitionActive ? 'crt-collapse-active' : undefined}>
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
        <ProjectsSection />

        {/* 7. CERTIFICATIONS FILTER BROWSER */}
        <CertificationsSection />

        {/* 9. CONTACT & FOOTER */}
        <ContactSection />
      </div>
    </div>
  );
}

export default App;

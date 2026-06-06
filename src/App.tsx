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

function App() {
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [isSoundActive, setIsSoundActive] = useState(false);
  const [isAmbientActive, setIsAmbientActive] = useState(false);
  const [isCursorTrailActive, setIsCursorTrailActive] = useState(false);
  const [isHudActive, setIsHudActive] = useState(false);

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
      <ProjectsSection />

      {/* 7. CERTIFICATIONS FILTER BROWSER */}
      <CertificationsSection />

      {/* 9. CONTACT & FOOTER */}
      <ContactSection />
    </div>
  );
}

export default App;

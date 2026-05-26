import { HeroSection } from './sections/HeroSection';
import { MarqueeSection } from './sections/MarqueeSection';
import { AboutSection } from './sections/AboutSection';
import { WorkExperience } from './sections/WorkExperience';
import { ServicesSection } from './sections/ServicesSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ExtraProjects } from './sections/ExtraProjects';
import { CertificationsSection } from './sections/CertificationsSection';
import { ContactSection } from './sections/ContactSection';

function App() {
  return (
    <div className="w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] overflow-x-clip select-none">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. MARQUEE SECTION */}
      <MarqueeSection />

      {/* 3. ABOUT SECTION */}
      <AboutSection />

      {/* 4. WORK EXPERIENCE TIMELINE */}
      <WorkExperience />

      {/* 5. SERVICES SECTION */}
      <ServicesSection />

      {/* 6. PROJECTS SECTION (Sticky scaling cards) */}
      <ProjectsSection />

      {/* 7. EXTRA PROJECTS SHOWCASE GRID */}
      <ExtraProjects />

      {/* 8. CERTIFICATIONS FILTER BROWSER */}
      <CertificationsSection />

      {/* 9. CONTACT & FOOTER */}
      <ContactSection />
    </div>
  );
}

export default App;

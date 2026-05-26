import React from 'react';
import { FadeIn } from '../components/FadeIn';
import { Magnet } from '../components/Magnet';
import { ContactButton } from '../components/ContactButton';

export const HeroSection: React.FC = () => {
  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Work Experience', id: 'work-experience' },
    { label: 'Projects', id: 'projects' },
    { label: 'Certifications', id: 'certifications' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="h-screen flex flex-col justify-between relative overflow-hidden w-full select-none">
      {/* 1. NAVBAR */}
      <FadeIn as="nav" y={-20} delay={0} duration={0.8} className="w-full z-30">
        <div className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8">
          {/* Logo / Initials */}
          <div 
            onClick={() => handleNavClick('root')} 
            className="text-[#D7E2EA] font-black tracking-widest text-lg md:text-xl lg:text-2xl cursor-pointer hover:opacity-75 transition-opacity"
          >
            N.P
          </div>
          
          {/* Evenly spaced links */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="text-[#D7E2EA] font-medium uppercase tracking-wider text-xs sm:text-sm md:text-base lg:text-[1.1rem] hover:opacity-70 transition-opacity duration-200"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

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
            className="absolute left-1/2 -translate-x-1/2 bottom-1/2 translate-y-1/2 sm:translate-y-0 sm:bottom-0 w-[260px] sm:w-[340px] md:w-[420px] lg:w-[480px] xl:w-[500px]"
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
            <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[13.5vw] sm:text-[14.5vw] md:text-[15.5vw] lg:text-[17vw]">
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

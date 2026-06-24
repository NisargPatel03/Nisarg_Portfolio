import React from 'react';
import { FadeIn } from '../components/FadeIn';
import { AnimatedText } from '../components/AnimatedText';
import { ContactButton } from '../components/ContactButton';
import { Award, Code, BookOpen, Star } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="relative bg-[#0C0C0C] min-h-screen py-24 md:py-32 flex flex-col items-center justify-center overflow-hidden w-full px-6 md:px-10 gap-10 sm:gap-14 md:gap-16"
    >
      {/* 1. FOUR DECORATIVE 3D ASSETS IN CORNERS */}

      {/* Top-Left: Moon Icon */}
      <div className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-10 pointer-events-none">
        <FadeIn x={-80} y={0} delay={0.1} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
            alt="Moon Asset"
            className="w-[50px] sm:w-[100px] md:w-[180px] lg:w-[210px] h-auto object-contain filter drop-shadow-[0_10px_30px_rgba(255,255,255,0.05)] animate-pulse"
            style={{ animationDuration: '4s' }}
          />
        </FadeIn>
      </div>

      {/* Bottom-Left: 3D Object */}
      <div className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-10 pointer-events-none">
        <FadeIn x={-80} y={0} delay={0.25} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
            alt="3D Spike Asset"
            className="w-[45px] sm:w-[85px] md:w-[150px] lg:w-[180px] h-auto object-contain filter drop-shadow-[0_15px_35px_rgba(182,0,168,0.1)] animate-bounce"
            style={{ animationDuration: '6s' }}
          />
        </FadeIn>
      </div>

      {/* Top-Right: Lego Icon */}
      <div className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-10 pointer-events-none">
        <FadeIn x={80} y={0} delay={0.15} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
            alt="Lego Asset"
            className="w-[50px] sm:w-[100px] md:w-[180px] lg:w-[210px] h-auto object-contain filter drop-shadow-[0_10px_30px_rgba(255,255,255,0.05)] animate-pulse"
            style={{ animationDuration: '5s' }}
          />
        </FadeIn>
      </div>

      {/* Bottom-Right: 3D Group */}
      <div className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-10 pointer-events-none">
        <FadeIn x={80} y={0} delay={0.3} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
            alt="3D Composition Asset"
            className="w-[60px] sm:w-[110px] md:w-[180px] lg:w-[220px] h-auto object-contain filter drop-shadow-[0_20px_40px_rgba(118,33,176,0.15)] animate-bounce"
            style={{ animationDuration: '7s' }}
          />
        </FadeIn>
      </div>

      {/* 2. SECTION HEADING */}
      <FadeIn y={40} delay={0} duration={0.8} className="z-20 text-center">
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: 'clamp(3rem, 10vw, 120px)' }}
        >
          About me
        </h2>
      </FadeIn>

      {/* 3. CORE SCROLL-DRIVEN BIO TEXT */}
      <div className="z-20 w-full flex flex-col items-center gap-8 sm:gap-10">
        <AnimatedText
          text="With more than two years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!"
          className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[720px] text-lg sm:text-xl md:text-2xl"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
        />

        {/* Nisarg's Professional Details Cards Grid */}
        <FadeIn crtFlicker={true} delay={0.4} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-full mt-6">
          <div className="bg-[#121212] border border-[#232323] rounded-3xl p-5 hover:border-[#B600A8]/45 transition-colors flex flex-col gap-3 crt-glitch-hover">
            <BookOpen className="w-8 h-8 text-[#B600A8]" />
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">Education</h3>
            <p className="text-[#D7E2EA]/70 text-sm font-light leading-snug">
              B.Tech in Computer Science & Engineering (3rd Year) at CHARUSAT University (2023 - 2027)
            </p>
          </div>

          <div className="bg-[#121212] border border-[#232323] rounded-3xl p-5 hover:border-[#7621B0]/45 transition-colors flex flex-col gap-3 crt-glitch-hover">
            <Award className="w-8 h-8 text-[#7621B0]" />
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">Awards</h3>
            <p className="text-[#D7E2EA]/70 text-sm font-light leading-snug">
              Devang Mehta IT Award Winner & NPTEL National Topper (Top 1-2% in DSA, DBMS, DAA)
            </p>
          </div>

          <div className="bg-[#121212] border border-[#232323] rounded-3xl p-5 hover:border-[#BE4C00]/45 transition-colors flex flex-col gap-3 crt-glitch-hover">
            <Code className="w-8 h-8 text-[#BE4C00]" />
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">Coding</h3>
            <p className="text-[#D7E2EA]/70 text-sm font-light leading-snug">
              Solved 196+ LeetCode problems. Specialized in C++, Java, JavaScript, Python, and SQL systems.
            </p>
          </div>

          <div className="bg-[#121212] border border-[#232323] rounded-3xl p-5 hover:border-[#B600A8]/45 transition-colors flex flex-col gap-3 crt-glitch-hover">
            <Star className="w-8 h-8 text-[#B600A8]" />
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">HackerRank</h3>
            <p className="text-[#D7E2EA]/70 text-sm font-light leading-snug">
              5-Star programmer in C++ and Java. Extensive background in problem-solving & data algorithms.
            </p>
          </div>
        </FadeIn>
      </div>

      {/* 4. BUTTON WITH SPACING */}
      <FadeIn y={20} delay={0.5} className="z-20 mt-6 sm:mt-10 md:mt-12">
        <ContactButton />
      </FadeIn>
    </section>
  );
};

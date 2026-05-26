import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface TechItem {
  name: string;
  color: string;
  badge: string;
  icon: React.ReactNode;
}

export const MarqueeSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Track scroll coordinates relative to this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Map scroll progress to horizontal translation
  const x1 = useTransform(scrollYProgress, [0, 1], [-180, 180]);
  const x2 = useTransform(scrollYProgress, [0, 1], [180, -180]);

  // Row 1 (Frontend & Core Languages)
  const row1Skills: TechItem[] = [
    {
      name: 'C++',
      color: '#00599C',
      badge: '5-Star HackerRank',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 20c-5.522 0-10-4.477-10-10s4.478-10 10-10c3.702 0 6.945 2.015 8.675 5H14.5A6 6 0 1 0 16 14h3.675C17.945 17.985 14.702 20 10 20z" />
          <path d="M19 8v4M17 10h4M23 8v4M21 10h4" />
        </svg>
      ),
    },
    {
      name: 'Java',
      color: '#E76F51',
      badge: '5-Star Programming',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 15a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6z" />
          <path d="M9 22h6M12 15v7M12 2v5" />
        </svg>
      ),
    },
    {
      name: 'C',
      color: '#A8B9CC',
      badge: 'System Foundations',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 20c-5.522 0-10-4.477-10-10s4.478-10 10-10c3.702 0 6.945 2.015 8.675 5H14.5A6 6 0 1 0 16 14h3.675C17.945 17.985 14.702 20 15 20z" />
        </svg>
      ),
    },
    {
      name: 'React',
      color: '#00D8FF',
      badge: 'MERN Stack Core',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(90 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(150 12 12)" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      ),
    },
    {
      name: 'TypeScript',
      color: '#3178C6',
      badge: 'Type-Safe Systems',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <path d="M8 8h6M11 8v8M16 11c0-1-1-2-2-2s-2 1-2 2v2c0 1 1 2 2 2s2-1 2-2" />
        </svg>
      ),
    },
    {
      name: 'Tailwind CSS',
      color: '#38BDF8',
      badge: 'Utility Styling',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a9 9 0 0 0-9 9c0 3.5 2 6.5 5 8l1-1a3 3 0 0 1 4 0l1 1c3-1.5 5-4.5 5-8a9 9 0 0 0-9-9z" />
        </svg>
      ),
    },
    {
      name: 'Framer Motion',
      color: '#FF00C7',
      badge: 'Fluid Web Physics',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 3h16l-8 8-8-8zM4 21h16l-8-8-8 8z" />
        </svg>
      ),
    },
  ];

  // Row 2 (Backend & Tools)
  const row2Skills: TechItem[] = [
    {
      name: 'Git',
      color: '#F05032',
      badge: 'Version Control',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="18" r="3" />
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="6" r="3" />
          <path d="M18 9v6M6 9v6" />
        </svg>
      ),
    },
    {
      name: 'Vercel',
      color: '#FFFFFF',
      badge: 'Serverless Deploys',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 22h20L12 2z" />
        </svg>
      ),
    },
    {
      name: 'Node.js',
      color: '#339933',
      badge: 'Scalable Backends',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M12 12v10" />
        </svg>
      ),
    },
    {
      name: 'MongoDB',
      color: '#47A248',
      badge: 'NoSQL Document DB',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c0 0-5 4-5 9s3 7 5 11c2-4 5-7 5-11s-5-9-5-9z" />
        </svg>
      ),
    },
    {
      name: 'Supabase',
      color: '#3ECF8E',
      badge: 'Postgres & Auth Services',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      name: 'Express',
      color: '#F7DF1E',
      badge: 'Fast API Router',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 8h10M7 12h10M7 16h6" />
        </svg>
      ),
    },
    {
      name: 'PHP',
      color: '#777BB4',
      badge: 'Legacy Backends',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="12" rx="10" ry="6" />
          <path d="M8 9h4a2 2 0 1 1 0 4H8v3M16 9h4a2 2 0 1 1 0 4h-4v3" />
        </svg>
      ),
    },
    {
      name: 'MySQL',
      color: '#00758F',
      badge: 'Relational DB Storage',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="6" rx="9" ry="3" />
          <path d="M3 6v12c0 1.66 4 3 9 3s9-1.34 9-3V6" />
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
        </svg>
      ),
    },
  ];

  // Triplicate the lists to make the horizontal scroll infinite and thick on all viewport resolutions
  const displayRow1 = [...row1Skills, ...row1Skills, ...row1Skills, ...row1Skills];
  const displayRow2 = [...row2Skills, ...row2Skills, ...row2Skills, ...row2Skills];

  return (
    <div
      ref={containerRef}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 w-full overflow-hidden flex flex-col gap-6 sm:gap-8 md:gap-10 select-none"
    >
      {/* 1. SECTION LOGO LABEL */}
      <div className="max-w-5xl mx-auto w-full px-6 md:px-10 mb-2">
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-[#FF00C7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="font-mono text-[#D7E2EA]/50 uppercase tracking-widest text-[10px] sm:text-xs">
            Technical Architecture & Toolkits
          </span>
          <div className="flex-grow h-[1px] bg-white/5" />
        </div>
      </div>

      {/* 2. DUAL-ROW CONVEYOR BELTS */}
      <div className="flex flex-col gap-6 w-full relative">
        {/* Row 1 (Slides Right) */}
        <div className="flex w-[350vw] sm:w-[250vw] -translate-x-[50vw]">
          <motion.div style={{ x: x1 }} className="flex gap-4 sm:gap-6 w-full py-2">
            {displayRow1.map((skill, i) => {
              const isHovered = hoveredSkill === `row1-${skill.name}-${i}`;
              return (
                <div
                  key={`row1-${skill.name}-${i}`}
                  onMouseEnter={() => setHoveredSkill(`row1-${skill.name}-${i}`)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className="flex-shrink-0 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#121212]/80 border border-white/5 backdrop-blur-md transition-all duration-300 cursor-pointer relative group"
                  style={{
                    borderColor: isHovered ? skill.color : 'rgba(255,255,255,0.05)',
                    boxShadow: isHovered ? `0 0 20px ${skill.color}33` : 'none',
                    transform: isHovered ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
                  }}
                >
                  {/* Brand Vector Icon Wrapper */}
                  <div
                    className="transition-colors duration-300"
                    style={{ color: isHovered ? skill.color : '#D7E2EA' }}
                  >
                    {skill.icon}
                  </div>
                  
                  {/* Name & Hover Specialty Badge */}
                  <div className="flex flex-col">
                    <span className="text-white font-extrabold text-sm sm:text-base tracking-wide uppercase">
                      {skill.name}
                    </span>
                    <span
                      className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-[#D7E2EA]/40 group-hover:text-white transition-colors block max-w-0 overflow-hidden group-hover:max-w-[200px] duration-500 whitespace-nowrap"
                      style={{ transitionProperty: 'max-width, color' }}
                    >
                      {skill.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Row 2 (Slides Left) */}
        <div className="flex w-[350vw] sm:w-[250vw] -translate-x-[20vw]">
          <motion.div style={{ x: x2 }} className="flex gap-4 sm:gap-6 w-full py-2">
            {displayRow2.map((skill, i) => {
              const isHovered = hoveredSkill === `row2-${skill.name}-${i}`;
              return (
                <div
                  key={`row2-${skill.name}-${i}`}
                  onMouseEnter={() => setHoveredSkill(`row2-${skill.name}-${i}`)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className="flex-shrink-0 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#121212]/80 border border-white/5 backdrop-blur-md transition-all duration-300 cursor-pointer relative group"
                  style={{
                    borderColor: isHovered ? skill.color : 'rgba(255,255,255,0.05)',
                    boxShadow: isHovered ? `0 0 20px ${skill.color}33` : 'none',
                    transform: isHovered ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
                  }}
                >
                  {/* Brand Vector Icon Wrapper */}
                  <div
                    className="transition-colors duration-300"
                    style={{ color: isHovered ? skill.color : '#D7E2EA' }}
                  >
                    {skill.icon}
                  </div>

                  {/* Name & Hover Specialty Badge */}
                  <div className="flex flex-col">
                    <span className="text-white font-extrabold text-sm sm:text-base tracking-wide uppercase">
                      {skill.name}
                    </span>
                    <span
                      className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-[#D7E2EA]/40 group-hover:text-white transition-colors block max-w-0 overflow-hidden group-hover:max-w-[200px] duration-500 whitespace-nowrap"
                      style={{ transitionProperty: 'max-width, color' }}
                    >
                      {skill.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

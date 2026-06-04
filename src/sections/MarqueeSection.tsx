import React, { useState } from 'react';

interface TechItem {
  name: string;
  color: string;
  badge: string;
  icon: React.ReactNode;
}

interface MarqueeRowProps {
  skills: TechItem[];
  animationClass: string;
  rowPrefix: string;
  hoveredSkill: string | null;
  setHoveredSkill: (id: string | null) => void;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({
  skills,
  animationClass,
  rowPrefix,
  hoveredSkill,
  setHoveredSkill,
}) => {
  const displaySkills = [...skills, ...skills];

  return (
    <div className="marquee-fade-edges marquee-track-pause flex overflow-hidden w-full">
      <div className={`flex gap-4 sm:gap-5 py-2 w-max ${animationClass}`}>
        {displaySkills.map((skill, i) => {
          const key = `${rowPrefix}-${skill.name}-${i}`;
          const isHovered = hoveredSkill === key;
          return (
            <div
              key={key}
              onMouseEnter={() => setHoveredSkill(key)}
              onMouseLeave={() => setHoveredSkill(null)}
              className="flex-shrink-0 flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#121212]/80 border border-white/5 backdrop-blur-md transition-all duration-300 cursor-pointer relative group"
              style={{
                borderColor: isHovered ? skill.color : 'rgba(255,255,255,0.05)',
                boxShadow: isHovered ? `0 0 28px ${skill.color}45, 0 8px 24px rgba(0,0,0,0.35)` : 'none',
                transform: isHovered ? 'scale(1.05) translateY(-4px)' : 'scale(1) translateY(0)',
              }}
            >
              <div
                className="transition-colors duration-300 [&>svg]:w-7 [&>svg]:h-7 sm:[&>svg]:w-8 sm:[&>svg]:h-8"
                style={{ color: isHovered ? skill.color : '#D7E2EA' }}
              >
                {skill.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-white font-bold text-sm sm:text-base tracking-wide uppercase whitespace-nowrap">
                  {skill.name}
                </span>
                <span
                  className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-[#D7E2EA]/40 group-hover:text-white/90 transition-colors block max-w-0 overflow-hidden group-hover:max-w-[180px] duration-500 whitespace-nowrap"
                  style={{ transitionProperty: 'max-width, color' }}
                >
                  {skill.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const MarqueeSection: React.FC = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const row1Skills: TechItem[] = [
    {
      name: 'C++',
      color: '#00599C',
      badge: '5-Star HackerRank',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 15a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6z" />
          <path d="M9 22h6M12 15v7M12 2v5" />
        </svg>
      ),
    },
    {
      name: 'JavaScript',
      color: '#F7DF1E',
      badge: 'Interactive Web',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M15 8h2v8H13v-2" />
        </svg>
      ),
    },
    {
      name: 'Python',
      color: '#3776AB',
      badge: 'AI & Data Computations',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      name: 'Flutter',
      color: '#02569B',
      badge: 'Cross-Platform Mobile',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2L6 10l8 8M20 2L12 10l8 8" />
        </svg>
      ),
    },
    {
      name: 'Dart',
      color: '#00B4AB',
      badge: 'Mobile Compilers',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 12l10 10 10-10L12 2z" />
          <path d="M12 22V12h10" />
        </svg>
      ),
    },
    {
      name: 'C',
      color: '#A8B9CC',
      badge: 'System Foundations',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 20c-5.522 0-10-4.477-10-10s4.478-10 10-10c3.702 0 6.945 2.015 8.675 5H14.5A6 6 0 1 0 16 14h3.675C17.945 17.985 14.702 20 15 20z" />
        </svg>
      ),
    },
    {
      name: 'TypeScript',
      color: '#3178C6',
      badge: 'Type-Safe Systems',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a9 9 0 0 0-9 9c0 3.5 2 6.5 5 8l1-1a3 3 0 0 1 4 0l1 1c3-1.5 5-4.5 5-8a9 9 0 0 0-9-9z" />
        </svg>
      ),
    },
    {
      name: 'Framer Motion',
      color: '#FF00C7',
      badge: 'Fluid Web Physics',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 3h16l-8 8-8-8zM4 21h16l-8-8-8 8z" />
        </svg>
      ),
    },
  ];

  const row2Skills: TechItem[] = [
    {
      name: 'Machine Learning',
      color: '#FF6F00',
      badge: 'Predictive Models',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      name: 'Deep Learning',
      color: '#9C27B0',
      badge: 'Neural Networks',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2.5" />
          <circle cx="5" cy="12" r="2.5" />
          <circle cx="19" cy="12" r="2.5" />
          <circle cx="12" cy="19" r="2.5" />
          <line x1="12" y1="7.5" x2="5" y2="12" />
          <line x1="12" y1="7.5" x2="19" y2="12" />
          <line x1="5" y1="12" x2="12" y2="19" />
          <line x1="19" y1="12" x2="12" y2="19" />
        </svg>
      ),
    },
    {
      name: 'TensorFlow',
      color: '#FF9900',
      badge: 'Model Computations',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <path d="M12 6v12M8 10h8" />
        </svg>
      ),
    },
    {
      name: 'PyTorch',
      color: '#EE4C2C',
      badge: 'AI Model Training',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M9 12h6" />
        </svg>
      ),
    },
    {
      name: 'Git',
      color: '#F05032',
      badge: 'Version Control',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 22h20L12 2z" />
        </svg>
      ),
    },
    {
      name: 'Node.js',
      color: '#339933',
      badge: 'Scalable Backends',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M12 12v10" />
        </svg>
      ),
    },
    {
      name: 'MongoDB',
      color: '#47A248',
      badge: 'NoSQL Document DB',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c0 0-5 4-5 9s3 7 5 11c2-4 5-7 5-11s-5-9-5-9z" />
        </svg>
      ),
    },
    {
      name: 'Express',
      color: '#F7DF1E',
      badge: 'Fast API Router',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="6" rx="9" ry="3" />
          <path d="M3 6v12c0 1.66 4 3 9 3s9-1.34 9-3V6" />
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
        </svg>
      ),
    },
  ];

  const row3Skills: TechItem[] = [
    {
      name: 'React',
      color: '#61DAFB',
      badge: 'Component UI Layer',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(90 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(150 12 12)" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: 'Next.js',
      color: '#FFFFFF',
      badge: 'SSR & App Router',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 16V8l8 4-8 4z" />
        </svg>
      ),
    },
    {
      name: 'Supabase',
      color: '#3ECF8E',
      badge: 'Postgres & Auth',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      name: 'Firebase',
      color: '#FFCA28',
      badge: 'Realtime & Hosting',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L4 18h4l4-8 4 8h4L12 2z" />
        </svg>
      ),
    },
    {
      name: 'WebGL',
      color: '#990000',
      badge: 'GPU Rendering',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      ),
    },
    {
      name: 'Three.js',
      color: '#049EF4',
      badge: '3D Web Scenes',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
          <path d="M12 12l9-5M12 12v10M12 12L3 7" />
        </svg>
      ),
    },
    {
      name: 'Docker',
      color: '#2496ED',
      badge: 'Containerized Deploys',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="8" width="20" height="12" rx="2" />
          <path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
          <path d="M8 14h2v2H8zM12 14h2v2h-2zM16 14h2v2h-2z" />
        </svg>
      ),
    },
    {
      name: 'GraphQL',
      color: '#E10098',
      badge: 'Typed API Queries',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 20 7 20 17 12 22 4 17 4 7" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      name: 'Redis',
      color: '#DC382D',
      badge: 'In-Memory Cache',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="6" rx="9" ry="3" />
          <path d="M3 6v12c0 1.66 4 3 9 3s9-1.34 9-3V6" />
          <path d="M3 10c0 1.66 4 3 9 3s9-1.34 9-3" />
        </svg>
      ),
    },
    {
      name: 'Figma',
      color: '#F24E1E',
      badge: 'UI Prototyping',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="8" height="8" rx="4" />
          <rect x="13" y="3" width="8" height="5" rx="2.5" />
          <rect x="13" y="10" width="8" height="8" rx="4" />
          <rect x="3" y="13" width="8" height="8" rx="4" />
        </svg>
      ),
    },
    {
      name: 'Linux',
      color: '#FCC624',
      badge: 'Server & DevOps',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-[#0C0C0C] pt-28 sm:pt-36 md:pt-44 pb-14 w-full overflow-hidden flex flex-col gap-6 sm:gap-8 select-none">
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

      <div className="flex flex-col gap-5 sm:gap-6 w-full">
        <MarqueeRow
          skills={row1Skills}
          animationClass="animate-marquee-left-fast"
          rowPrefix="row1"
          hoveredSkill={hoveredSkill}
          setHoveredSkill={setHoveredSkill}
        />
        <MarqueeRow
          skills={row2Skills}
          animationClass="animate-marquee-right-medium"
          rowPrefix="row2"
          hoveredSkill={hoveredSkill}
          setHoveredSkill={setHoveredSkill}
        />
        <MarqueeRow
          skills={row3Skills}
          animationClass="animate-marquee-left-slow"
          rowPrefix="row3"
          hoveredSkill={hoveredSkill}
          setHoveredSkill={setHoveredSkill}
        />
      </div>
    </div>
  );
};

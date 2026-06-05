import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TechItem {
  name: string;
  color: string;
  badge: string;
  icon: React.ReactNode;
  proficiency: string;
  yearsOfExp: string;
  projects: string[];
  tags: string[];
}

interface MarqueeRowProps {
  skills: TechItem[];
  animationClass: string;
  rowPrefix: string;
  hoveredSkill: string | null;
  setHoveredSkill: (id: string | null) => void;
  onSkillClick: (skill: TechItem) => void;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({
  skills,
  animationClass,
  rowPrefix,
  hoveredSkill,
  setHoveredSkill,
  onSkillClick,
}) => {
  const displaySkills = [...skills, ...skills];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--x', x.toString());
    card.style.setProperty('--y', y.toString());
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredSkill(null);
    const card = e.currentTarget;
    card.style.setProperty('--x', '0');
    card.style.setProperty('--y', '0');
  };

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
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              onClick={() => onSkillClick(skill)}
              className="flex-shrink-0 flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#121212]/80 border border-white/5 backdrop-blur-md transition-all duration-300 cursor-pointer relative group marquee-card-3d"
              style={{
                borderColor: isHovered ? skill.color : 'rgba(255,255,255,0.05)',
                boxShadow: isHovered ? `0 0 28px ${skill.color}45, 0 8px 24px rgba(0,0,0,0.35)` : 'none',
                ['--hover-scale' as any]: isHovered ? 1 : 0,
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

interface SkillTelemetryModalProps {
  skill: TechItem | null;
  onClose: () => void;
}

const SkillTelemetryModal: React.FC<SkillTelemetryModalProps> = ({ skill, onClose }) => {
  if (!skill) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0B0B0B]/95 border w-full max-w-md rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.85)] font-mono text-[#D7E2EA] relative"
          style={{ borderColor: skill.color }}
        >
          {/* CRT scanline overlay */}
          <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-[0.05]" />
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: skill.color }} />
              <span className="text-xs text-white/40 uppercase tracking-widest">SYSTEM_TELEMETRY</span>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/45 hover:text-white transition-colors text-xl p-1"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col gap-5">
            <div className="flex gap-4 items-center">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 bg-white/[0.01]"
                style={{ color: skill.color, boxShadow: `0 0 20px ${skill.color}15` }}
              >
                {skill.icon}
              </div>
              <div className="flex flex-col">
                <h3 className="text-white text-lg font-bold uppercase tracking-wider">{skill.name}</h3>
                <span className="text-[10px] text-white/55" style={{ color: skill.color }}>{skill.badge}</span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
              <div>
                <span className="text-[10px] text-white/40 uppercase block mb-0.5">Proficiency</span>
                <span className="text-xs text-white font-bold uppercase tracking-wide">{skill.proficiency}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase block mb-0.5">Exp Level</span>
                <span className="text-xs text-white font-bold uppercase tracking-wide">{skill.yearsOfExp}</span>
              </div>
            </div>

            {/* Subskills/Tags */}
            <div>
              <span className="text-[10px] text-white/40 uppercase block mb-2">Core Competencies</span>
              <div className="flex flex-wrap gap-1.5">
                {skill.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-[9px] px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/5 text-white/80 hover:border-white/10 transition-colors uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Integration list */}
            <div>
              <span className="text-[10px] text-white/40 uppercase block mb-2">Portfolio Integrations</span>
              <div className="flex flex-col gap-1.5">
                {skill.projects.map((proj) => (
                  <div 
                    key={proj} 
                    className="flex items-center gap-2 text-[10px] text-white/70 py-1.5 px-3 rounded-lg bg-white/[0.01] border border-white/[0.03]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: skill.color }} />
                    <span className="font-sans font-light">{proj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer bar */}
          <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01] flex justify-between items-center text-[8px] text-white/30 uppercase tracking-widest">
            <span>SYS_INIT: OK</span>
            <span>DATA_RETRIEVE: COMPLETE</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const MarqueeSection: React.FC = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<TechItem | null>(null);

  const row1Skills: TechItem[] = [
    {
      name: 'C++',
      color: '#00599C',
      badge: '5-Star HackerRank',
      proficiency: 'Advanced',
      yearsOfExp: '3+ Years',
      projects: ['HackerRank Coding Milestones', 'Data Structures Practice'],
      tags: ['Algorithms', 'Low-level', 'OOP', 'STL'],
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
      proficiency: 'Advanced',
      yearsOfExp: '2+ Years',
      projects: ['School Management System', 'Academic Ledgers'],
      tags: ['JVM', 'OOP', 'Enterprise Systems', 'Multithreading'],
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
      proficiency: 'Expert',
      yearsOfExp: '3+ Years',
      projects: ['Savaliya Scoops POS', 'Bharat Budget', 'Bioluminescent Canvas'],
      tags: ['Frontend Core', 'ES6 Syntax', 'Dynamic UI', 'DOM Manipulation'],
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
      proficiency: 'Advanced',
      yearsOfExp: '2+ Years',
      projects: ['Welfare Eligibility Predictor', 'Cricket Roster Analytics'],
      tags: ['Machine Learning', 'Data Cleaning', 'Automation Scripts', 'Pandas'],
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
      proficiency: 'Advanced',
      yearsOfExp: '1+ Year',
      projects: ['Cricket Tournament Companion App', 'Local Store Companion'],
      tags: ['Mobile SDK', 'Dart UI', 'State Management', 'Widgets'],
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
      proficiency: 'Advanced',
      yearsOfExp: '1+ Year',
      projects: ['Cricket Tournament Companion App'],
      tags: ['Mobile Compile', 'Asynchronous Streams', 'Null Safety', 'AOT Compiler'],
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
      proficiency: 'Intermediate',
      yearsOfExp: '3+ Years',
      projects: ['Hardware Microcontroller Scripting'],
      tags: ['System Program', 'Pointers', 'Memory Allocations', 'Structs'],
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
      proficiency: 'Expert',
      yearsOfExp: '2+ Years',
      projects: ['Nisarg Portfolio', 'Bharat Budget Console'],
      tags: ['Type Safety', 'Interfaces', 'Generics', 'Code Scalability'],
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
      proficiency: 'Expert',
      yearsOfExp: '2.5+ Years',
      projects: ['Consolidated Fund Pipeline Grid', 'Tax Dashboard UI Layout'],
      tags: ['Responsive Web UI', 'Utility Classes', 'Flexbox / Grid', 'JIT Compiler'],
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
      proficiency: 'Expert',
      yearsOfExp: '1.5+ Years',
      projects: ['Holographic Telemetry Modals', 'Typewriter Sound Animations'],
      tags: ['Physics Motion', 'Micro-Animations', 'React Transitions', 'AnimatePresence'],
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
      proficiency: 'Advanced',
      yearsOfExp: '1.5+ Years',
      projects: ['Citizen Eligibility Predictor'],
      tags: ['Statistics', 'Supervised Learning', 'Scikit-Learn', 'Regression'],
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
      proficiency: 'Advanced',
      yearsOfExp: '1+ Year',
      projects: ['Computer Vision Classifier'],
      tags: ['Neural Networks', 'Backpropagation', 'CNNs', 'Optimizers'],
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
      proficiency: 'Advanced',
      yearsOfExp: '1+ Year',
      projects: ['Deep Learning Image Predictor'],
      tags: ['Google Brain', 'Keras Layers', 'Model Hosting', 'Conv2D'],
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
      proficiency: 'Advanced',
      yearsOfExp: '1+ Year',
      projects: ['Research Classifier Models'],
      tags: ['Meta AI', 'Tensors', 'Dynamic Graphs', 'Model Training'],
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
      proficiency: 'Expert',
      yearsOfExp: '4+ Years',
      projects: ['Collaborative Repositories', 'Vercel Deployment Hooks'],
      tags: ['Version Control', 'Rebasing', 'Merge Conflict Solver', 'Branching'],
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
      proficiency: 'Expert',
      yearsOfExp: '2+ Years',
      projects: ['Portfolio Web App', 'Bharat Budget Staging'],
      tags: ['Serverless Cloud', 'Edge Functions', 'NextJS Optimization', 'CI/CD Pipelines'],
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
      proficiency: 'Expert',
      yearsOfExp: '3+ Years',
      projects: ['Savaliya Scoops Backend API', 'Auth GoTrue Gateways'],
      tags: ['V8 Engine', 'Event Loop Async', 'RESTful Middleware', 'WebSocket Channels'],
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
      proficiency: 'Expert',
      yearsOfExp: '2.5+ Years',
      projects: ['Blood Bank Ledgers', 'School Management DB Schema'],
      tags: ['NoSQL Databases', 'Mongoose models', 'Aggregations', 'BSON Schema'],
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c0 0-5 4-5 9s3 7 5 11c2-4 5-7 5-11s-5-9-5-9z" />
        </svg>
      ),
    },
    {
      name: 'Express',
      color: '#828282',
      badge: 'Fast API Router',
      proficiency: 'Expert',
      yearsOfExp: '3+ Years',
      projects: ['Savaliya Scoops Backend API Server'],
      tags: ['REST APIs', 'Middleware Routing', 'JWT Security', 'CORS Config'],
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
      proficiency: 'Advanced',
      yearsOfExp: '2+ Years',
      projects: ['Cricket Tournament local panels', 'Blood Bank DB Scripts'],
      tags: ['Server-Side Scripting', 'Sessions Cookie Auth', 'PDO Database Handler'],
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
      proficiency: 'Advanced',
      yearsOfExp: '2.5+ Years',
      projects: ['Savaliya Scoops POS Database', 'Cricket Roster Tables'],
      tags: ['SQL Joins', 'Database Indexes', 'Stored Procedures', 'Relational Schemas'],
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
      proficiency: 'Expert',
      yearsOfExp: '3+ Years',
      projects: ['Nisarg Portfolio', 'Bharat Budget Dashboards'],
      tags: ['Component-Driven UI', 'Virtual DOM', 'React Hooks', 'Context State'],
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
      proficiency: 'Expert',
      yearsOfExp: '2+ Years',
      projects: ['Bharat Budget Server Pages', 'POS Invoicing Export Server'],
      tags: ['App Router', 'Server Side Render', 'SEO Optimization', 'Server Actions'],
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
      proficiency: 'Expert',
      yearsOfExp: '1.5+ Years',
      projects: ['Bharat Budget Cloud Integration', 'Eligible Citizen Audit Records'],
      tags: ['PostgreSQL DB', 'Realtime Listeners', 'Auth GoTrue Rules', 'Storage Buckets'],
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
      proficiency: 'Advanced',
      yearsOfExp: '2+ Years',
      projects: ['Realtime Messaging Tool', 'Mobile POS Cloud syncing'],
      tags: ['NoSQL Realtime DB', 'Firebase Hosting', 'Cloud Functions', 'Firestore Schemas'],
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
      proficiency: 'Intermediate',
      yearsOfExp: '1+ Year',
      projects: ['Bioluminescent Neural Canvas physics'],
      tags: ['GPU Accelerations', 'Shaders GLSL', 'HTML5 Canvas 2D', 'Vectors'],
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
      proficiency: 'Advanced',
      yearsOfExp: '1+ Year',
      projects: ['3D Interactive Creator Portfolios'],
      tags: ['3D Coordinates', 'WebGL wrappers', 'Materials & Shaders', 'OrbitControls'],
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
      proficiency: 'Advanced',
      yearsOfExp: '1.5+ Years',
      projects: ['Savaliya Scoops local staging server'],
      tags: ['Containers', 'Microservices Architecture', 'Dockerfile configs', 'Port Bindings'],
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
      proficiency: 'Advanced',
      yearsOfExp: '1+ Year',
      projects: ['Graph API synchronization endpoints'],
      tags: ['Declarative data queries', 'Apollo Client', 'Resolvers & Schemas', 'Typed queries'],
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
      proficiency: 'Advanced',
      yearsOfExp: '1+ Year',
      projects: ['POS checkout session caching'],
      tags: ['In-Memory key-value store', 'Query Cache', 'Session controllers', 'PubSub'],
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
      proficiency: 'Advanced',
      yearsOfExp: '2.5+ Years',
      projects: ['Savaliya Scoops POS mockup layouts', 'Bharat Budget vector designs'],
      tags: ['Vector Graphics', 'Prototyping flows', 'UI Component grids', 'Design Systems'],
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
      proficiency: 'Advanced',
      yearsOfExp: '3+ Years',
      projects: ['Apache/PHP host system controllers', 'SSH remote server management'],
      tags: ['System Admin', 'Bash scripts', 'Remote SSH control', 'Cronjobs scheduling'],
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
    <div id="skills" className={`bg-[#0C0C0C] pt-28 sm:pt-36 md:pt-44 pb-14 w-full overflow-hidden flex flex-col gap-6 sm:gap-8 select-none ${selectedSkill ? 'marquee-paused' : ''}`}>
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
          onSkillClick={setSelectedSkill}
        />
        <MarqueeRow
          skills={row2Skills}
          animationClass="animate-marquee-right-medium"
          rowPrefix="row2"
          hoveredSkill={hoveredSkill}
          setHoveredSkill={setHoveredSkill}
          onSkillClick={setSelectedSkill}
        />
        <MarqueeRow
          skills={row3Skills}
          animationClass="animate-marquee-left-slow"
          rowPrefix="row3"
          hoveredSkill={hoveredSkill}
          setHoveredSkill={setHoveredSkill}
          onSkillClick={setSelectedSkill}
        />
      </div>

      {selectedSkill && (
        <SkillTelemetryModal 
          skill={selectedSkill} 
          onClose={() => setSelectedSkill(null)} 
        />
      )}
    </div>
  );
};

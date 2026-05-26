import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';
import { Award, ShieldCheck, Database, Cpu, BookOpen, Trophy, BadgePercent, GraduationCap, FileText } from 'lucide-react';

interface Certification {
  title: string;
  issuer: string;
  category: 'academic' | 'nptel' | 'professional';
  badge?: string;
  details: string;
  icon: React.ReactNode;
}

export const CertificationsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'academic' | 'nptel' | 'professional'>('all');

  const certs: Certification[] = [
    // National & Academic
    {
      title: 'Devang Mehta IT Award (Ranked First)',
      issuer: 'CHARUSAT & Devang Mehta Foundation',
      category: 'academic',
      badge: 'First Rank Excellence',
      details: 'Awarded for securing the prime semester rank across the IT and Computer Science departments.',
      icon: <Trophy className="w-6 h-6 text-[#BE4C00]" />,
    },
    {
      title: 'GATE 2026 Scorecard',
      issuer: 'Ministry of Education, Govt. of India',
      category: 'academic',
      badge: 'National Technical Exam',
      details: 'High-percentile performance in the Graduate Aptitude Test in Engineering (Computer Science).',
      icon: <GraduationCap className="w-6 h-6 text-blue-400" />,
    },
    {
      title: 'Fake News Detection using Machine Learning',
      issuer: 'Academic Research Publication',
      category: 'academic',
      badge: 'Research Publication',
      details: 'Published research certificate exploring vector modeling and NLP classification for fake news.',
      icon: <FileText className="w-6 h-6 text-teal-400" />,
    },
    {
      title: 'Ranked First in University Class',
      issuer: 'CHARUSAT Academic Registrar',
      category: 'academic',
      badge: 'University Topper',
      details: 'Official rank recognition for outstanding academic performance across engineering semesters.',
      icon: <Award className="w-6 h-6 text-[#B600A8]" />,
    },

    // NPTEL Toppers
    {
      title: 'Database Management Systems',
      issuer: 'NPTEL (IIT Madras)',
      category: 'nptel',
      badge: 'National Topper (Top 1-2%)',
      details: 'Completed with Elite+Gold/Silver status, specializing in transaction models, normalization, and relational algebra.',
      icon: <Database className="w-6 h-6 text-[#7621B0]" />,
    },
    {
      title: 'Data Structure & Algorithms using Java',
      issuer: 'NPTEL (IIT Kharagpur)',
      category: 'nptel',
      badge: 'National Topper (Top 1-2%)',
      details: 'Advanced certification in algorithmic mapping, tree traversals, graphs, and Java OOP engineering.',
      icon: <BadgePercent className="w-6 h-6 text-purple-400" />,
    },
    {
      title: 'Design and Analysis of Algorithms',
      issuer: 'NPTEL (IIT Chennai)',
      category: 'nptel',
      badge: 'National Topper (Top 1-2%)',
      details: 'Elite status in asymptotic analysis, dynamic programming, network flows, and NP-completeness.',
      icon: <Cpu className="w-6 h-6 text-pink-400" />,
    },

    // Professional & Coursera
    {
      title: 'MERN Stack Front to Back Full Stack React, Redux, NodeJs',
      issuer: 'Packt Publishing / Udemy',
      category: 'professional',
      badge: 'Professional MERN Generalist',
      details: 'Comprehensive full-stack credential covering Redux stores, Express routes, JWT auth, and Atlas database setup.',
      icon: <ShieldCheck className="w-6 h-6 text-[#B600A8]" />,
    },
    {
      title: 'Machine Learning with Python',
      issuer: 'IBM / Coursera',
      category: 'professional',
      badge: 'Data Science Specialist',
      details: 'Supervised & unsupervised learning algorithms, regression matrices, decision trees, and SVM modeling.',
      icon: <Cpu className="w-6 h-6 text-[#BE4C00]" />,
    },
    {
      title: 'Programming with Java',
      issuer: 'Amazon Web Services / Coursera',
      category: 'professional',
      badge: 'Java System Architecture',
      details: 'Object-oriented software systems, interface designs, concurrency models, and thread operations.',
      icon: <BookOpen className="w-6 h-6 text-indigo-400" />,
    },
    {
      title: 'IBM DevOps, Cloud & Agile Foundations',
      issuer: 'IBM / Coursera',
      category: 'professional',
      badge: 'Cloud & Agile Architect',
      details: 'Continuous integration (CI/CD), containers, microservice architectures, and Agile scrum management.',
      icon: <Layers className="w-6 h-6 text-blue-400" /> as any,
    },
    {
      title: 'Cybersecurity Fundamentals',
      issuer: 'IBM Security / Coursera',
      category: 'professional',
      badge: 'Security Engineer',
      details: 'System vulnerabilities, encryption models, security auditing protocols, and digital access barriers.',
      icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
    },
    {
      title: 'Introduction to Software Development',
      issuer: 'IBM / Coursera',
      category: 'professional',
      badge: 'Software Foundations',
      details: 'Git branching, web application frameworks, architecture design patterns, and programming tools.',
      icon: <BookOpen className="w-6 h-6 text-amber-400" />,
    },
  ];

  const filteredCerts = activeTab === 'all' ? certs : certs.filter(c => c.category === activeTab);

  const tabs = [
    { id: 'all', label: 'All Credentials' },
    { id: 'academic', label: 'Academic & National' },
    { id: 'nptel', label: 'NPTEL Topper' },
    { id: 'professional', label: 'Professional Tech' },
  ] as const;

  return (
    <section
      id="certifications"
      className="bg-[#0C0C0C] py-24 md:py-32 w-full px-6 md:px-10 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        {/* 1. HEADING */}
        <FadeIn y={30} delay={0} duration={0.8} className="text-center mb-12">
          <span className="text-[#7621B0] uppercase font-bold tracking-widest text-xs sm:text-sm">
            Validated Accolades
          </span>
          <h2 className="hero-heading font-black uppercase text-4xl sm:text-5xl md:text-6xl tracking-tight mt-2">
            Certifications
          </h2>
        </FadeIn>

        {/* 2. CATEGORY TABS FILTERS */}
        <FadeIn y={20} delay={0.2} className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full uppercase tracking-wider text-[10px] sm:text-xs font-bold border-2 transition-all select-none ${
                activeTab === tab.id
                  ? 'bg-white border-white text-[#0C0C0C] shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  : 'bg-transparent border-[#232323] text-[#D7E2EA]/60 hover:text-white hover:border-[#D7E2EA]/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </FadeIn>

        {/* 3. CERTIFICATES GRID */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
          <AnimatePresence mode="popLayout">
            {filteredCerts.map((cert) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={cert.title}
                className="bg-[#121212] border border-[#232323] hover:border-[#B600A8]/30 rounded-3xl p-6 flex flex-col justify-between gap-5 transition-all duration-300 group hover:shadow-[0_10px_25px_rgba(182,0,168,0.06)] relative"
              >
                {/* Header Icon + Badge */}
                <div className="flex justify-between items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1c1c1c] border border-white/5 flex justify-center items-center group-hover:border-[#B600A8]/30 transition-colors">
                    {cert.icon}
                  </div>
                  {cert.badge && (
                    <span className="bg-[#B600A8]/10 border border-[#B600A8]/20 text-[#B600A8] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {cert.badge}
                    </span>
                  )}
                </div>

                {/* Body Details */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-white font-bold text-base sm:text-lg uppercase tracking-wide leading-snug group-hover:text-blue-400 transition-colors">
                    {cert.title}
                  </h4>
                  <span className="font-mono text-[#D7E2EA]/50 uppercase tracking-widest text-[9px] sm:text-[10px]">
                    {cert.issuer}
                  </span>
                  <p className="text-[#D7E2EA]/70 text-xs sm:text-sm font-light leading-relaxed mt-2">
                    {cert.details}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

// Simple stub component for Layers to avoid TS errors
const Layers: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

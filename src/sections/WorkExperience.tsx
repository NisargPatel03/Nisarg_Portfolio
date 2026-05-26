import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';
import { Briefcase, GraduationCap, Trophy, CheckCircle2 } from 'lucide-react';

interface TimelineItem {
  id: number;
  role: string;
  company: string;
  date: string;
  points: string[];
  icon: React.ReactNode;
}

export const WorkExperience: React.FC = () => {
  const items: TimelineItem[] = [
    {
      id: 1,
      role: 'Lead Full-Stack Developer',
      company: 'CSPIT & MTIN Department Collaboration',
      date: 'Jan 2026 - July 2026',
      points: [
        'Engineered a secure, fully responsive Survey Health Care Form Web Application to bridge CSPIT and MTIN department metrics.',
        'Designed dynamic data-collection fields, clinician dashboard portals, and real-time analytical evaluation reporting graphs.',
        'Maintained strict clinical evaluation data protocols and deployed production-ready modules with optimal privacy compliances.',
      ],
      icon: <Briefcase className="w-5 h-5 text-[#FF00C7]" />,
    },
    {
      id: 2,
      role: 'MERN Stack Intern',
      company: 'Mamo Technolabs LLP',
      date: 'May 2025 - July 2025',
      points: [
        'Developed a full-stack Hotel Booking Web Application using the MERN stack (MongoDB, Express, React, Node).',
        'Implemented core capabilities including secure user authentication, responsive hotel profiles, and an administrator panel.',
        'Acquired extensive expertise in RESTful APIs, MongoDB Atlas integrations, and global state management with Redux.',
      ],
      icon: <Briefcase className="w-5 h-5 text-[#B600A8]" />,
    },
    {
      id: 3,
      role: 'Devang Mehta IT Award Winner',
      company: 'CHARUSAT Academic Honors',
      date: 'Awarded 2025',
      points: [
        'Recognized with the prestigious Devang Mehta IT Excellence Award for outstanding academic first-rank performance.',
        'Evaluated highly on practical software engineering design, algorithmic competence, and semester rankings.',
        'Represented the computer science department in advanced developer symposiums.',
      ],
      icon: <Trophy className="w-5 h-5 text-[#BE4C00]" />,
    },
    {
      id: 4,
      role: 'B.Tech in Computer Science & Engineering',
      company: 'Charotar University of Science & Technology (CHARUSAT)',
      date: '2023 - 2027',
      points: [
        'Engaged in rigorous academic study specializing in software design, database schemas, and algorithms.',
        'Ranked in the top 1-2% nationally across three core NPTEL computer science courses (DSA, DBMS, DAA).',
        'Constructed multiple responsive commercial-grade web applications utilizing MERN, Supabase, and PHP.',
      ],
      icon: <GraduationCap className="w-5 h-5 text-[#7621B0]" />,
    },
  ];

  return (
    <section
      id="work-experience"
      className="bg-[#0C0C0C] py-24 md:py-32 w-full px-6 md:px-10 relative overflow-hidden"
    >
      {/* 1. SECTION HEADING */}
      <FadeIn y={30} delay={0} duration={0.8} className="text-center mb-16 md:mb-24">
        <span className="text-[#B600A8] uppercase font-bold tracking-widest text-xs sm:text-sm">
          My Professional Path
        </span>
        <h2 className="hero-heading font-black uppercase text-4xl sm:text-5xl md:text-6xl tracking-tight mt-2">
          Work Experience.
        </h2>
      </FadeIn>

      {/* 2. TIMELINE CONTAINER */}
      <div className="relative max-w-5xl mx-auto flex flex-col items-center">
        {/* Continuous center vertical timeline track */}
        <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-[#D7E2EA]/15 z-0" />

        {items.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={item.id}
              className="relative w-full flex flex-col md:grid md:grid-cols-9 gap-8 md:gap-0 mb-16 last:mb-0 z-10"
            >
              {/* DESKTOP LEFT COLUMN: Date (if odd) or Card (if even) */}
              <div
                className={`flex justify-start md:justify-end items-center col-span-4 ${
                  isEven ? 'order-1 md:order-1' : 'order-2 md:order-1 md:text-right'
                }`}
              >
                {isEven ? (
                  /* Even card placed on left side (desktop) */
                  <motion.div
                    initial={{ opacity: 0, x: -250 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1, margin: "-80px 0px" }}
                    transition={{ type: 'spring', stiffness: 45, damping: 14, delay: 0.05 }}
                    className="w-full pl-12 md:pl-0 md:pr-10"
                  >
                    <div className="bg-gradient-to-br from-blue-950/40 to-slate-950/70 border border-blue-900/30 hover:border-[#B600A8]/40 transition-colors p-6 rounded-3xl relative group shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                      {/* Arrow pointer targeting the center line */}
                      <div className="absolute right-full top-6 translate-x-[9px] border-[10px] border-transparent border-r-blue-950/40 hidden md:block" />

                      <h3 className="text-white font-bold text-lg sm:text-xl uppercase tracking-wide">
                        {item.role}
                      </h3>
                      <span className="font-mono text-[#BBCCD7] text-xs sm:text-sm uppercase block mt-1 opacity-80">
                        {item.company}
                      </span>
                      <span className="text-[#D7E2EA]/50 font-medium text-xs block md:hidden mt-2">
                        {item.date}
                      </span>
                      <ul className="mt-4 flex flex-col gap-2">
                        {item.points.map((pt, pIdx) => (
                          <li key={pIdx} className="flex gap-2.5 items-start text-xs sm:text-sm text-[#D7E2EA]/85 font-light leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ) : (
                  /* Odd date placed on left side (desktop) */
                  <motion.div
                    initial={{ opacity: 0, x: -150 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1, margin: "-80px 0px" }}
                    transition={{ type: 'spring', stiffness: 45, damping: 14, delay: 0.1 }}
                    className="hidden md:block w-full pr-10 text-right"
                  >
                    <span className="text-white font-bold uppercase tracking-widest text-sm lg:text-base opacity-75">
                      {item.date}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* CENTER COLUMN: Central vertical node containing Lucide Icon */}
              <div className="absolute left-6 md:static flex justify-center items-center col-span-1 order-1 md:order-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ type: 'spring', stiffness: 90, damping: 12 }}
                  className="w-12 h-12 rounded-full bg-[#121212] border-2 border-blue-950/70 hover:border-[#7621B0] transition-colors flex justify-center items-center z-20 shadow-[0_0_15px_rgba(118,33,176,0.3)] bg-slate-900"
                >
                  {item.icon}
                </motion.div>
              </div>

              {/* DESKTOP RIGHT COLUMN: Card (if odd) or Date (if even) */}
              <div
                className={`flex justify-start items-center col-span-4 pl-12 md:pl-10 ${
                  isEven ? 'order-2 md:order-3' : 'order-1 md:order-3'
                }`}
              >
                {isEven ? (
                  /* Even date placed on right side (desktop) */
                  <motion.div
                    initial={{ opacity: 0, x: 150 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1, margin: "-80px 0px" }}
                    transition={{ type: 'spring', stiffness: 45, damping: 14, delay: 0.1 }}
                    className="hidden md:block w-full text-left"
                  >
                    <span className="text-white font-bold uppercase tracking-widest text-sm lg:text-base opacity-75">
                      {item.date}
                    </span>
                  </motion.div>
                ) : (
                  /* Odd card placed on right side (desktop) */
                  <motion.div
                    initial={{ opacity: 0, x: 250 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1, margin: "-80px 0px" }}
                    transition={{ type: 'spring', stiffness: 45, damping: 14, delay: 0.05 }}
                    className="w-full"
                  >
                    <div className="bg-gradient-to-br from-blue-950/40 to-slate-950/70 border border-blue-900/30 hover:border-[#7621B0]/40 transition-colors p-6 rounded-3xl relative group shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                      {/* Arrow pointer targeting the center line */}
                      <div className="absolute left-full top-6 -translate-x-[9px] border-[10px] border-transparent border-l-blue-950/40 hidden md:block" />

                      <h3 className="text-white font-bold text-lg sm:text-xl uppercase tracking-wide">
                        {item.role}
                      </h3>
                      <span className="font-mono text-[#BBCCD7] text-xs sm:text-sm uppercase block mt-1 opacity-80">
                        {item.company}
                      </span>
                      <span className="text-[#D7E2EA]/50 font-medium text-xs block md:hidden mt-2">
                        {item.date}
                      </span>
                      <ul className="mt-4 flex flex-col gap-2">
                        {item.points.map((pt, pIdx) => (
                          <li key={pIdx} className="flex gap-2.5 items-start text-xs sm:text-sm text-[#D7E2EA]/85 font-light leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

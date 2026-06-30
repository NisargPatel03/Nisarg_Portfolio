import React from 'react';
import { FadeIn } from '../components/FadeIn';
import { ExternalLink, Code2, Layers } from 'lucide-react';
import { TiltCard } from '../components/TiltCard';

interface ExtraProject {
  title: string;
  category: string;
  description: string;
  github: string;
  vercel?: string;
  techs: string[];
}

export const ExtraProjects: React.FC = () => {
  const list: ExtraProject[] = [
    {
      title: 'Skill Swap Platform',
      category: 'MERN Stack Web App',
      description: 'A peer-to-peer web application that facilitates users exchanging professional skills. Includes responsive profiles and scheduling systems.',
      github: 'https://github.com/NisargPatel03', // fallback profile link or actual if available
      vercel: 'https://skill-swap-web-app.vercel.app/',
      techs: ['MongoDB', 'Express', 'React', 'Node.js', 'Redux'],
    },
    {
      title: 'Blaze Overseas LLP',
      category: 'Commercial Business Platform',
      description: 'A premium, responsive corporate platform engineered to represent international trade services, client consultations, and business listings.',
      github: 'https://github.com/NisargPatel03/Blaze_Overseas_LLP',
      vercel: 'https://blaze-overseas-llp.vercel.app/',
      techs: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    },
    {
      title: 'DRHV Cricket Tournament',
      category: 'Sports Management Platform',
      description: 'An interactive tournament manager enabling smooth registrations, team score tables, match rosters, and live board updates.',
      github: 'https://github.com/NisargPatel03/DRHV_Cricket_Tournament',
      vercel: 'https://drhv-cricket-tournament.vercel.app/',
      techs: ['React', 'Node.js', 'Express', 'Tailwind CSS'],
    },
    {
      title: 'NextGenSociety',
      category: 'Smart Society POS Portal',
      description: 'A full society management suite that streamlines maintenance bills, noticeboards, event schedules, and direct resident messaging logs.',
      github: 'https://github.com/NisargPatel03/NextGenSociety',
      vercel: 'https://next-gen-society.vercel.app/',
      techs: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    },
    {
      title: 'EcoLearn',
      category: 'Environmental Learning Portal',
      description: 'Interactive educational resource portal teaching ecology concepts, featuring progress dashboards, quiz matches, and dynamic asset visualizers.',
      github: 'https://github.com/cs-cspit/SEM6-SGP-70-75',
      vercel: 'https://ecolearn-frontend-delta.vercel.app/',
      techs: ['Vite', 'React', 'Tailwind CSS', 'Framer Motion'],
    },
    {
      title: 'Survey Form Healthcare App',
      category: 'Healthcare Assessment Tool',
      description: 'An evaluation app for institutional healthcare reviews and student panels, featuring responsive forms, survey stats, and CSV analytical summaries.',
      github: 'https://github.com/NisargPatel03/Survey_Form_HealthCare_App',
      vercel: 'https://survey-form-health-care-app.vercel.app/',
      techs: ['React', 'Context API', 'Chart.js', 'Tailwind CSS'],
    },
    {
      title: 'Blood Testing Management System',
      category: 'Backend Dashboard System',
      description: 'A PHP and MySQL-powered management system deployed locally on XAMPP, handling blood test bookings, patient logs, and PDF medical reports.',
      github: 'https://github.com/NisargPatel03',
      techs: ['PHP', 'MySQL', 'XAMPP', 'Bootstrap', 'JavaScript'],
    },
    {
      title: 'Sports Venue Booking System',
      category: 'Management & Reservation Suite',
      description: 'A comprehensive venue booking system managing stadium calendars, user slots, security authorizations, and transaction logging.',
      github: 'https://github.com/Meghpatel2810/Sports_Venue_Booking_System',
      techs: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    },
  ];

  return (
    <section className="bg-[#0C0C0C] pb-24 md:pb-32 w-full px-6 md:px-10 relative select-none">
      <div className="max-w-5xl mx-auto">
        {/* Subtitle separator */}
        <FadeIn y={20} delay={0} duration={0.8} className="flex items-center gap-3 mb-10">
          <Layers className="w-5 h-5 text-[#7621B0]" />
          <h3 className="text-[#D7E2EA]/50 font-mono uppercase tracking-widest text-xs sm:text-sm">
            More Engineering Repositories
          </h3>
          <div className="flex-grow h-[1px] bg-[#D7E2EA]/10" />
        </FadeIn>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 w-full">
          {list.map((proj, i) => (
            <FadeIn
              key={proj.title}
              crtFlicker={true}
              delay={i * 0.05}
            >
              <TiltCard className="bg-[#121212] border border-[#232323] hover:border-[#7621B0]/45 rounded-3xl p-6 flex flex-col justify-between gap-6 transition-all duration-300 group hover:shadow-[0_10px_30px_rgba(118,33,176,0.1)] relative crt-glitch-hover h-full cyber-light-border">
                {/* Header and description */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-mono text-[#D7E2EA]/50 uppercase tracking-wider text-[10px] sm:text-xs">
                      {proj.category}
                    </span>
                    <Code2 className="w-5 h-5 text-[#D7E2EA]/30 group-hover:text-[#7621B0] transition-colors" />
                  </div>
                  
                  <h4 className="text-white font-bold text-lg uppercase tracking-wide group-hover:text-blue-400 transition-colors">
                    {proj.title}
                  </h4>
                  
                  <p className="text-[#D7E2EA]/70 text-xs sm:text-sm font-light leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                {/* Technologies and Action Links */}
                <div className="flex flex-col gap-4 mt-auto">
                  {/* Tech chips list */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {proj.techs.map((tech) => (
                      <span
                        key={tech}
                        className="bg-[#1c1c1c] text-[#D7E2EA]/85 text-[10px] sm:text-xs font-medium uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Footer action icons */}
                  <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                    {/* GitHub Repo */}
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/60 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                      <span>Codebase</span>
                    </a>

                    {/* Vercel App */}
                    {proj.vercel && (
                      <a
                        href={proj.vercel}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/60 hover:text-white transition-colors ml-auto"
                      >
                        <span>App Live</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';
import { LiveProjectButton } from '../components/LiveProjectButton';
import { CheckCircle2 } from 'lucide-react';

interface ProjectData {
  id: string;
  name: string;
  category: string;
  vercel?: string;
  github: string;
  description: string;
  points: string[];
  techs: string[];
  image: string;
}

export const ProjectsSection: React.FC = () => {
  const projects: ProjectData[] = [
    {
      id: '01',
      name: 'Survey Health Care Form App',
      category: 'Healthcare Assessment Tool',
      vercel: 'https://survey-form-health-care-app.vercel.app/',
      github: 'https://github.com/NisargPatel03/Survey_Form_HealthCare_App',
      description: 'An advanced clinical diagnostic evaluation application designed for institutional patient review boards and real-time medical reviews.',
      points: [
        'Dynamic clinical assessment forms with validation schemas.',
        'Real-time response dashboard and patient analytics logs.',
        'Seamless automatic PDF report and raw CSV data exporters.'
      ],
      techs: ['React', 'Context API', 'Chart.js', 'Tailwind CSS'],
      image: '/survey_healthcare_mockup.png',
    },
    {
      id: '02',
      name: 'DRHV Cricket Tournament',
      category: 'Sports Management Platform',
      vercel: 'https://drhv-cricket-tournament.vercel.app/',
      github: 'https://github.com/NisargPatel03/DRHV_Cricket_Tournament',
      description: 'An interactive tournament manager enabling team score sheet registers, roster schedulers, and live scoreboard boards.',
      points: [
        'Live scoreboard updates with sub-second polling mechanics.',
        'Automated guest/team registration validation engines.',
        'Visual standings brackets mapping out matches dynamically.'
      ],
      techs: ['React', 'Node.js', 'Express', 'Tailwind CSS'],
      image: '/drhv_cricket_mockup.png',
    },
    {
      id: '03',
      name: 'Blaze Overseas LLP Portal',
      category: 'Commercial Business Platform',
      vercel: 'https://blaze-overseas-llp.vercel.app/',
      github: 'https://github.com/NisargPatel03/Blaze_Overseas_LLP',
      description: 'A premium, responsive corporate trade directory engineered to represent international cargo lists and consultation pipelines.',
      points: [
        'Global commodities cargo search index with filters.',
        'Automated lead-funnel capture and consultation forms.',
        '₹30,000 INR commercial contract value acquisition.'
      ],
      techs: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      image: '/blaze_overseas_mockup.png',
    },
    {
      id: '04',
      name: 'EcoLearn Environmental Portal',
      category: 'Ecology Learning Platform',
      vercel: 'https://ecolearn-frontend-delta.vercel.app/',
      github: 'https://github.com/cs-cspit/SEM6-SGP-70-75',
      description: 'An interactive ecology platform teaching environmental sciences, featuring quiz modules and carbon calculators.',
      points: [
        'Interactive ecosystem visualizers mapping biodiversity.',
        'Carbon footprint calculation formulas for users.',
        'Detailed student progress panels showing performance.'
      ],
      techs: ['Vite', 'React', 'Tailwind CSS', 'Framer Motion'],
      image: '/ecolearn_mockup.png',
    },
    {
      id: '05',
      name: 'Savaliya Scoops POS System',
      category: 'Client Point of Sale (POS)',
      vercel: 'https://savaliya-scoops-system.vercel.app/',
      github: 'https://github.com/NisargPatel03/savaliya-scoops-system',
      description: 'A custom Point of Sale (POS) system tailored specifically for ice-cream parlors under Mr. Manish Shah of Savaliya Nadiad.',
      points: [
        'Smooth button-driven menu and catalog selectors.',
        'Hold & recall order buffers for checkout lines.',
        'Thermal physical ticket generation and GST invoicing.'
      ],
      techs: ['React', 'Supabase', 'Excel API', 'Tailwind CSS'],
      image: '/savaliya_scoops_mockup.png',
    },
    {
      id: '06',
      name: 'NextGenSociety Portal',
      category: 'Smart Society POS Portal',
      vercel: 'https://next-gen-society.vercel.app/',
      github: 'https://github.com/NisargPatel03/NextGenSociety',
      description: 'A smart residential society management system handling maintenance bills, notices, resident feedback, and booking records.',
      points: [
        'Automated society maintenance invoice generators.',
        'Interactive community announcements boards.',
        'Resident complaint ticket logs and meeting schedulers.'
      ],
      techs: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
      image: '/nextgensociety_mockup.png',
    },
    {
      id: '07',
      name: 'QuickStay Hotel Booking',
      category: 'Client Project (MERN Full-stack)',
      vercel: 'https://quickstay-phi.vercel.app/',
      github: 'https://github.com/NisargPatel03/MERN_Hotel_Booking',
      description: 'A comprehensive hotel reservation platform with user verification, responsive rooms, reviews, and a robust admin dashboard.',
      points: [
        'Secure authorization pipelines with session integration.',
        'Administrator inventory control room and bookings.',
        'Responsive filters and pricing range search engines.'
      ],
      techs: ['MongoDB', 'Express', 'React', 'Node.js', 'Redux'],
      image: '/quickstay_hotel_mockup.png',
    },
    {
      id: '08',
      name: 'Car Rental System',
      category: 'Personal Project (MERN Full-stack)',
      vercel: 'https://car-rental-ivory-five.vercel.app/',
      github: 'https://github.com/NisargPatel03/CarRental_FullStack',
      description: 'A modern MERN application for exploring car fleets, reserving slots, and managing checkout invoices.',
      points: [
        'Dynamic vehicle catalog inventory management.',
        'Real-time daily rate invoicing calculations.',
        'Clean admin control for vehicle returns and logs.'
      ],
      techs: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
      image: '/car_rental_mockup.png',
    },
    {
      id: '09',
      name: 'Blood Testing Management',
      category: 'Backend Dashboard System',
      github: 'https://github.com/NisargPatel03',
      description: 'A secure clinical patient laboratory system deployed on XAMPP, handling blood appointments, patients, and PDF diagnostics.',
      points: [
        'Clinical patient slot reservation schedulers.',
        'Dynamic electronic database records indexer.',
        'Automatic lab analysis report PDF generation.'
      ],
      techs: ['PHP', 'MySQL', 'XAMPP', 'Bootstrap', 'JavaScript'],
      image: '/blood_testing_mockup.png',
    },
    {
      id: '10',
      name: 'Sports Venue Booking System',
      category: 'Management & Reservation Suite',
      github: 'https://github.com/Meghpatel2810/Sports_Venue_Booking_System',
      description: 'A stadium and arena scheduling system managing court availability calendars, bookings, and logs.',
      points: [
        'Interactive court booking calendar timelines.',
        'Dynamic reservation availability controllers.',
        'Robust administrative access audit reports.'
      ],
      techs: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
      image: '/sports_venue_mockup.png',
    },
  ];

  return (
    <section
      id="projects"
      className="bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 pt-24 pb-20 w-full z-15 relative select-none"
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8 md:px-10">
        {/* 1. HEADING */}
        <FadeIn y={30} delay={0} duration={0.8} className="text-center mb-16 md:mb-24">
          <span className="text-[#B600A8] uppercase font-bold tracking-widest text-xs sm:text-sm">
            Featured Repositories
          </span>
          <h2
            className="hero-heading font-black uppercase tracking-tight text-center leading-none mt-2"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 110px)' }}
          >
            My Projects.
          </h2>
        </FadeIn>

        {/* 2. STICKY STACKING CARDS CONTAINER */}
        <div className="flex flex-col gap-10">
          {projects.map((project, index) => (
            <Card
              key={project.id}
              project={project}
              index={index}
              total={projects.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface CardProps {
  project: ProjectData;
  index: number;
  total: number;
}

const Card: React.FC<CardProps> = ({ project, index, total }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll of this specific card container to scale it down slightly
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Calculate targetScale: targetScale = 1 - (totalCards - 1 - index) * 0.015
  const targetScale = 1 - (total - 1 - index) * 0.015;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={containerRef}
      className="h-[80vh] sm:h-[85vh] md:h-[90vh] w-full flex flex-col justify-start items-center relative"
    >
      {/* Sticky card framing */}
      <motion.div
        style={{
          scale,
          top: `calc(100px + ${index * 32}px)`, // Offset each card slightly to stack cleanly at the top
        }}
        className="sticky w-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] border-2 border-[#D7E2EA]/20 bg-[#0C0C0C] p-6 sm:p-8 flex flex-col gap-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
      >
        {/* Card Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 pb-2 border-b border-[#D7E2EA]/10">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Massive Number Tag */}
            <div 
              className="font-black leading-none text-[#D7E2EA]/95 tracking-tighter"
              style={{ fontSize: 'clamp(2rem, 5vw, 65px)' }}
            >
              {project.id}
            </div>

            {/* Labels and Project Title */}
            <div className="flex flex-col">
              <span className="font-mono text-[#D7E2EA]/50 uppercase tracking-widest text-[10px] sm:text-xs">
                {project.category}
              </span>
              <h3 className="text-white font-extrabold uppercase text-sm sm:text-lg md:text-xl tracking-wider mt-0.5">
                {project.name}
              </h3>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end sm:justify-start">
            {/* GitHub Code link */}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#D7E2EA]/30 hover:border-white transition-colors flex justify-center items-center text-[#D7E2EA]/60 hover:text-white"
              title="View Repository"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            
            {/* Live Link Button */}
            {project.vercel && <LiveProjectButton link={project.vercel} />}
          </div>
        </div>

        {/* Card Body: Double-column visual grids */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden items-stretch">
          {/* Left Details Column (45% width) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full gap-4">
            <div className="flex flex-col gap-4">
              <p className="text-[#D7E2EA]/75 text-xs sm:text-sm font-light leading-relaxed">
                {project.description}
              </p>
              
              <ul className="flex flex-col gap-2 mt-1">
                {project.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex gap-2 items-start text-xs sm:text-sm text-[#D7E2EA]/90 font-light leading-snug">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              {/* Tech Chips */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.techs.map((tech) => (
                  <span
                    key={tech}
                    className="bg-[#1c1c1c] text-[#D7E2EA]/90 text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Image Mockup Column (55% width) */}
          <div className="lg:col-span-7 h-full overflow-hidden rounded-[20px] sm:rounded-[30px] border border-[#D7E2EA]/15 bg-[#121212] relative group">
            <img
              src={project.image}
              alt={`${project.name} Dashboard Mockup`}
              className="w-full h-full object-cover filter brightness-[0.8] group-hover:brightness-100 group-hover:scale-[1.03] transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

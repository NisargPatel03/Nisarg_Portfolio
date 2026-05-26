import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';
import { LiveProjectButton } from '../components/LiveProjectButton';

interface ProjectData {
  id: string;
  name: string;
  category: string;
  vercel: string;
  github: string;
  col1_img1: string;
  col1_img2: string;
  col2_img: string;
}

export const ProjectsSection: React.FC = () => {
  const projects: ProjectData[] = [
    {
      id: '01',
      name: 'QuickStay Hotel Booking',
      category: 'Client Project (MERN Full-stack)',
      vercel: 'https://quickstay-phi.vercel.app/',
      github: 'https://github.com/NisargPatel03/MERN_Hotel_Booking',
      col1_img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      col1_img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      col2_img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    },
    {
      id: '02',
      name: 'Car Rental System',
      category: 'Personal Project (MERN Full-stack)',
      vercel: 'https://car-rental-ivory-five.vercel.app/',
      github: 'https://github.com/NisargPatel03/CarRental_FullStack',
      col1_img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      col1_img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      col2_img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    },
    {
      id: '03',
      name: 'Savaliya Scoops POS System',
      category: 'Client Project (POS Supabase)',
      vercel: 'https://savaliya-scoops-system.vercel.app/',
      github: 'https://github.com/NisargPatel03/savaliya-scoops-system',
      col1_img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      col1_img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      col2_img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
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
          <h2
            className="hero-heading font-black uppercase tracking-tight text-center leading-none"
            style={{ fontSize: 'clamp(3rem, 11vw, 150px)' }}
          >
            Project
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

  // Calculate targetScale: targetScale = 1 - (totalCards - 1 - index) * 0.03
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={containerRef}
      className="h-[75vh] sm:h-[80vh] md:h-[85vh] w-full flex flex-col justify-start items-center relative"
    >
      {/* Sticky card framing */}
      <motion.div
        style={{
          scale,
          top: `calc(96px + ${index * 28}px)`, // Offset each card slightly to stack cleanly
        }}
        className="sticky w-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
      >
        {/* Card Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 pb-2 border-b border-[#D7E2EA]/10">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Massive Number Tag */}
            <div 
              className="font-black leading-none text-[#D7E2EA] opacity-90 tracking-tighter"
              style={{ fontSize: 'clamp(2rem, 6vw, 75px)' }}
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
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#D7E2EA]/30 hover:border-white transition-colors flex justify-center items-center text-[#D7E2EA]/60 hover:text-white"
              title="View Repository"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            
            {/* Live Link Button */}
            <LiveProjectButton link={project.vercel} />
          </div>
        </div>

        {/* Card Body: Double-column visual grids */}
        <div className="flex-grow grid grid-cols-10 gap-3 sm:gap-4 md:gap-5 overflow-hidden">
          {/* Left Column (40% width): 2 stacked images */}
          <div className="col-span-4 flex flex-col gap-3 sm:gap-4 md:gap-5 h-full">
            {/* Top Left Image */}
            <div
              className="w-full overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px] border border-[#D7E2EA]/10"
              style={{ height: 'clamp(90px, 14vw, 210px)' }}
            >
              <img
                src={project.col1_img1}
                alt="Details screenshot 1"
                className="w-full h-full object-cover filter brightness-[0.85] hover:brightness-100 transition-all duration-300"
              />
            </div>
            {/* Bottom Left Image */}
            <div
              className="w-full flex-grow overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px] border border-[#D7E2EA]/10"
              style={{ minHeight: 'clamp(110px, 20vw, 310px)' }}
            >
              <img
                src={project.col1_img2}
                alt="Details screenshot 2"
                className="w-full h-full object-cover filter brightness-[0.85] hover:brightness-100 transition-all duration-300"
              />
            </div>
          </div>

          {/* Right Column (60% width): 1 tall image */}
          <div className="col-span-6 h-full overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px] border border-[#D7E2EA]/10">
            <img
              src={project.col2_img}
              alt="Dashboard overview"
              className="w-full h-full object-cover filter brightness-[0.85] hover:brightness-100 transition-all duration-300"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

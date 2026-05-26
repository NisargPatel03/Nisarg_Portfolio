import React from 'react';
import { FadeIn } from '../components/FadeIn';

interface ServiceItem {
  id: string;
  name: string;
  description: string;
}

export const ServicesSection: React.FC = () => {
  const services: ServiceItem[] = [
    {
      id: '01',
      name: '3D Modeling',
      description:
        'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
    },
    {
      id: '02',
      name: 'Rendering',
      description:
        'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
    },
    {
      id: '03',
      name: 'Motion Design',
      description:
        'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
    },
    {
      id: '04',
      name: 'Branding',
      description:
        'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.',
    },
    {
      id: '05',
      name: 'Web Design',
      description:
        'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
    },
  ];

  return (
    <section
      id="services"
      className="bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 w-full z-20 relative select-none"
    >
      <div className="max-w-5xl mx-auto">
        {/* 1. HEADING */}
        <FadeIn y={30} delay={0} duration={0.8} className="text-center mb-16 sm:mb-20 md:mb-28">
          <h2
            className="font-black uppercase tracking-tight text-[#0C0C0C] leading-none"
            style={{ fontSize: 'clamp(3rem, 11vw, 150px)' }}
          >
            Services
          </h2>
        </FadeIn>

        {/* 2. SERVICES LIST */}
        <div className="flex flex-col border-t border-[#0C0C0C]/15">
          {services.map((svc, i) => (
            <FadeIn
              key={svc.id}
              y={30}
              delay={i * 0.1}
              duration={0.7}
              className="border-b border-[#0C0C0C]/15 py-8 sm:py-10 md:py-12 flex flex-col sm:flex-row gap-6 sm:gap-10 md:gap-14 items-start sm:items-center w-full"
            >
              {/* Massive Number Tag (Left Side) */}
              <div 
                className="font-black leading-none text-[#0C0C0C] tracking-tighter"
                style={{ fontSize: 'clamp(3rem, 9vw, 130px)' }}
              >
                {svc.id}
              </div>

              {/* Name & Details (Right Side Stack) */}
              <div className="flex-grow flex flex-col gap-2">
                <h3 
                  className="font-bold uppercase text-slate-900 tracking-wide"
                  style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.8rem)' }}
                >
                  {svc.name}
                </h3>
                <p 
                  className="text-slate-800 font-light leading-relaxed max-w-2xl text-slate-700/80"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.15rem)', opacity: 0.7 }}
                >
                  {svc.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

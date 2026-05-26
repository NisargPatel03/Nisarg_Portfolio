import React from 'react';
import { FadeIn } from '../components/FadeIn';

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 w-full z-20 relative select-none"
    >
      <div className="max-w-5xl mx-auto">
        {/* 1. HEADING */}
        <FadeIn y={30} delay={0} duration={0.8} className="text-center mb-16 sm:mb-20 md:mb-28">
          <span className="text-[#B600A8] uppercase font-bold tracking-widest text-xs sm:text-sm">
            Commercial Engagements
          </span>
          <h2
            className="font-black uppercase tracking-tight text-[#0C0C0C] leading-none mt-2"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 120px)' }}
          >
            Client Projects.
          </h2>
        </FadeIn>

        {/* 2. COMMERCIAL CASE STUDIES GRID */}
        <div className="flex flex-col gap-16 md:gap-24">
          
          {/* Project 1: Savaliya Ice Cream POS System */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 border-t border-slate-900/10 pt-12 items-start">
            {/* Left Column: Client metadata */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4 lg:sticky lg:top-24">
              <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
                Academic Course Engagement
              </span>
              <h3 className="font-extrabold uppercase text-2xl sm:text-3xl text-slate-900 tracking-wide leading-tight">
                Savaliya Ice Cream POS System
              </h3>
              
              <div className="flex flex-col gap-3 mt-2 text-sm text-slate-700">
                <div className="flex justify-between py-1.5 border-b border-slate-900/5">
                  <span className="font-semibold text-slate-900">Client:</span>
                  <span>Mr. Manish Shah (Owner)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900/5">
                  <span className="font-semibold text-slate-900">Location:</span>
                  <span>Nadiad, Gujarat</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900/5">
                  <span className="font-semibold text-slate-900">Developers:</span>
                  <span>Nisarg Patel (23CS070), Megh, Tejas</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900/5">
                  <span className="font-semibold text-slate-900">Agreement Date:</span>
                  <span>6th July, 2025</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900/5">
                  <span className="font-semibold text-slate-900">Completed:</span>
                  <span>30th November, 2025</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {['React', 'Excel Storage', 'Dine-In/Parcel', 'Thermal Printer'].map(t => (
                  <span key={t} className="bg-slate-100 text-slate-800 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full uppercase">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Project details */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <h4 className="font-extrabold uppercase text-xs sm:text-sm text-slate-500 tracking-wider">
                Project Overview & Scope
              </h4>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base font-light">
                Savaliya Ice Cream contracted the student development team of CSPIT to design and engineer a custom local Point of Sale (POS) system tailored specifically for high-efficiency ice-cream parlor catalog dispatching and order logs. Deployed for real business operations at the Nadiad Welcome Plazza outlet.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 flex flex-col gap-2">
                  <span className="font-bold text-slate-900 text-sm uppercase">🚀 Lightning POS Interface</span>
                  <p className="text-xs text-slate-600 leading-relaxed">Local-based, button-driven sales dashboard for sub-second catalog selection and cash register dispatching.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 flex flex-col gap-2">
                  <span className="font-bold text-slate-900 text-sm uppercase">💰 Multi-Mode Settlement</span>
                  <p className="text-xs text-slate-600 leading-relaxed">Integrated support for multiple flexible payment channels including cash, bank cheque, and digital Paytm ledger inputs.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 flex flex-col gap-2">
                  <span className="font-bold text-slate-900 text-sm uppercase">📊 Local Excel Data Vault</span>
                  <p className="text-xs text-slate-600 leading-relaxed">Transaction records, menus, and customer databases are compiled and securely structured directly in Excel formats.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 flex flex-col gap-2">
                  <span className="font-bold text-slate-900 text-sm uppercase">⚡ Hold & Recall Queue</span>
                  <p className="text-xs text-slate-600 leading-relaxed">Built-in order queue hold/recall triggers, ideal for managing active dine-in groups and simultaneous parcel orders.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 flex flex-col gap-2">
                  <span className="font-bold text-slate-900 text-sm uppercase">⏰ Pre-Order Reminders</span>
                  <p className="text-xs text-slate-600 leading-relaxed">Automatic alert system notifying operators 20 minutes prior to a due advance order, minimizing processing delays.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 flex flex-col gap-2">
                  <span className="font-bold text-slate-900 text-sm uppercase">🖨️ Thermal Bill Printer</span>
                  <p className="text-xs text-slate-600 leading-relaxed">Integrated GST compliant receipt formatting with raw printer drivers to generate and print hard-copy bills immediately.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project 2: Blaze Overseas LLP */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 border-t border-slate-900/10 pt-12 items-start">
            {/* Left Column: Client metadata */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4 lg:sticky lg:top-24">
              <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
                Acquisition & Commercial Launch
              </span>
              <h3 className="font-extrabold uppercase text-2xl sm:text-3xl text-slate-900 tracking-wide leading-tight">
                Blaze Overseas LLP Portal
              </h3>
              
              <div className="flex flex-col gap-3 mt-2 text-sm text-slate-700">
                <div className="flex justify-between py-1.5 border-b border-slate-900/5">
                  <span className="font-semibold text-slate-900">Client:</span>
                  <span>Blaze Overseas LLP</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900/5">
                  <span className="font-semibold text-slate-900">Contract Value:</span>
                  <span className="text-emerald-700 font-bold">₹30,000 INR</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900/5">
                  <span className="font-semibold text-slate-900">Role:</span>
                  <span>Lead Full-Stack Web Architect</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900/5">
                  <span className="font-semibold text-slate-900">Vercel Deployment:</span>
                  <a href="https://blaze-overseas-llp.vercel.app/" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 underline transition-colors">Live App</a>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900/5">
                  <span className="font-semibold text-slate-900">GitHub Codebase:</span>
                  <a href="https://github.com/NisargPatel03/Blaze_Overseas_LLP" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 underline transition-colors">Repository</a>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'].map(t => (
                  <span key={t} className="bg-slate-100 text-slate-800 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full uppercase">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Project details */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <h4 className="font-extrabold uppercase text-xs sm:text-sm text-slate-500 tracking-wider">
                Project Overview & Scope
              </h4>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base font-light">
                A premium, responsive corporate platform engineered to represent international trade services, global commodities exchange directories, and client consultation pathways. Nisarg Patel contracted as lead architect, executing commercial deployment for an acquisition sum of ₹30,000.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 flex flex-col gap-2">
                  <span className="font-bold text-slate-900 text-sm uppercase">🌍 Global Commodities Directory</span>
                  <p className="text-xs text-slate-600 leading-relaxed">Integrated commodities search engine with filters, helping international trade buyers explore products effortlessly.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 flex flex-col gap-2">
                  <span className="font-bold text-slate-900 text-sm uppercase">📈 Automated Sales Funnel</span>
                  <p className="text-xs text-slate-600 leading-relaxed">Lead generation dashboard with automated consultation scheduling forms and custom email notification triggers.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 flex flex-col gap-2">
                  <span className="font-bold text-slate-900 text-sm uppercase">✨ Sub-Second Page Delivery</span>
                  <p className="text-xs text-slate-600 leading-relaxed">Serverless build optimization using Vite and TypeScript configurations to guarantee instantaneous asset loading across global networks.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 flex flex-col gap-2">
                  <span className="font-bold text-slate-900 text-sm uppercase">💎 Premium User Experience</span>
                  <p className="text-xs text-slate-600 leading-relaxed">Crafted using smooth scroll indicators, glassmorphic layout tokens, and physics-based entrance transitions mapping to international branding.</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';
import { ArrowUpRight, CheckCircle2, ShieldCheck, DollarSign, Calendar, Users, Award, Tag } from 'lucide-react';
import { DrawSectionHeader } from '../components/DrawSectionHeader';

export const ServicesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blaze' | 'savaliya'>('blaze');

  return (
    <section
      id="services"
      className="bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 w-full z-20 relative select-none"
    >
      <div className="max-w-5xl mx-auto">
        {/* 1. HEADING */}
        <FadeIn y={30} delay={0} duration={0.8} className="text-center mb-10 sm:mb-14 w-full">
          <span className="text-[#B600A8] uppercase font-bold tracking-widest text-xs sm:text-sm mb-4 block">
            Commercial Engagements
          </span>
          <DrawSectionHeader text="Client Projects" lightMode={true} />
        </FadeIn>

        {/* 2. DYNAMIC SEGMENT TAB BAR */}
        <FadeIn y={20} delay={0.1} duration={0.8} className="flex justify-center w-full mb-16">
          <div className="bg-slate-100 p-1.5 rounded-full flex gap-1 border border-slate-200 shadow-inner relative max-w-lg w-full">
            {/* Tab 1: Blaze Overseas */}
            <button
              onClick={() => setActiveTab('blaze')}
              className={`flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wide relative z-10 transition-colors duration-300 ${
                activeTab === 'blaze' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeTab === 'blaze' && (
                <motion.div
                  layoutId="activeCommercialTab"
                  className="absolute inset-0 bg-[#0C0C0C] rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              Blaze Overseas
            </button>

            {/* Tab 2: Savaliya Ice Cream */}
            <button
              onClick={() => setActiveTab('savaliya')}
              className={`flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wide relative z-10 transition-colors duration-300 ${
                activeTab === 'savaliya' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeTab === 'savaliya' && (
                <motion.div
                  layoutId="activeCommercialTab"
                  className="absolute inset-0 bg-[#0C0C0C] rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              Savaliya Ice Cream
            </button>
          </div>
        </FadeIn>

        {/* 3. DYNAMIC ACTIVE SLIDE WORKSPACE */}
        <div className="relative w-full min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'blaze' ? (
              /* SLIDE 1: BLAZE OVERSEAS LLP */
              <motion.div
                key="blaze"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex flex-col lg:flex-row gap-10 lg:gap-16 border-t border-slate-900/10 pt-10 items-start w-full"
              >
                {/* Left Pane: Brand metadata card */}
                <div className="w-full lg:w-1/3 flex flex-col gap-5 lg:sticky lg:top-24">
                  {/* Glowing contract tag */}
                  <div className="inline-flex items-center gap-2 self-start bg-emerald-50 text-emerald-700 border border-emerald-300/40 px-3.5 py-1.5 rounded-full font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>₹30,000 INR Commercial Value</span>
                  </div>

                  <h3 className="font-extrabold uppercase text-3xl sm:text-4xl text-slate-900 tracking-wide leading-tight">
                    Blaze Overseas LLP Portal
                  </h3>

                  <div className="flex flex-col gap-3.5 mt-2 text-sm text-slate-700">
                    <div className="flex justify-between py-2 border-b border-slate-900/5">
                      <span className="font-semibold text-slate-900 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> Client:</span>
                      <span>Blaze Overseas LLP</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-900/5">
                      <span className="font-semibold text-slate-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> Timeline:</span>
                      <span>Feb - March 2026</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-900/5">
                      <span className="font-semibold text-slate-900 flex items-center gap-2"><Award className="w-4 h-4 text-slate-400" /> Role:</span>
                      <span>Lead Full-Stack Web Architect</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-900/5">
                      <span className="font-semibold text-slate-900 flex items-center gap-2"><Tag className="w-4 h-4 text-slate-400" /> Deploys:</span>
                      <a href="https://blaze-overseas-llp.vercel.app/" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 transition-colors">
                        Live App <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-900/5">
                      <span className="font-semibold text-slate-900 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> Codebase:</span>
                      <a href="https://github.com/NisargPatel03/Blaze_Overseas_LLP" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 transition-colors">
                        Repository <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'].map(t => (
                      <span key={t} className="bg-slate-100 text-slate-800 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Pane: Features deck */}
                <div className="w-full lg:w-2/3 flex flex-col gap-6">
                  <h4 className="font-extrabold uppercase text-xs sm:text-sm text-slate-500 tracking-wider">
                    Project Overview & Engineering Scope
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-sm sm:text-base font-light">
                    A premium, responsive corporate platform engineered to represent international trade services, global commodities exchange directories, and client consultation pathways. Nisarg Patel contracted as lead architect, executing commercial deployment for an acquisition sum of ₹30,000.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="service-card cyber-light-border p-6 rounded-3xl bg-slate-50 border border-slate-200/50 hover:border-slate-300 hover:bg-slate-100/50 transition-all duration-300 flex flex-col gap-3 shadow-sm">
                      <span className="font-bold text-slate-950 text-sm uppercase tracking-wide flex items-center gap-2">
                        🌍 Global Cargo Directory
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">Integrated commodities search engine with filters, helping international trade buyers explore products effortlessly.</p>
                    </div>
                    <div className="service-card cyber-light-border p-6 rounded-3xl bg-slate-50 border border-slate-200/50 hover:border-slate-300 hover:bg-slate-100/50 transition-all duration-300 flex flex-col gap-3 shadow-sm">
                      <span className="font-bold text-slate-950 text-sm uppercase tracking-wide flex items-center gap-2">
                        📈 Automated Sales Funnel
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">Lead generation dashboard with automated consultation scheduling forms and custom email notification triggers.</p>
                    </div>
                    <div className="service-card cyber-light-border p-6 rounded-3xl bg-slate-50 border border-slate-200/50 hover:border-slate-300 hover:bg-slate-100/50 transition-all duration-300 flex flex-col gap-3 shadow-sm">
                      <span className="font-bold text-slate-950 text-sm uppercase tracking-wide flex items-center gap-2">
                        ⚡ Sub-Second Asset Loads
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">Serverless build optimization using Vite and TypeScript configurations to guarantee instantaneous asset loading across global networks.</p>
                    </div>
                    <div className="service-card cyber-light-border p-6 rounded-3xl bg-slate-50 border border-slate-200/50 hover:border-slate-300 hover:bg-slate-100/50 transition-all duration-300 flex flex-col gap-3 shadow-sm">
                      <span className="font-bold text-slate-950 text-sm uppercase tracking-wide flex items-center gap-2">
                        💎 Premium UX Directives
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">Crafted using smooth scroll indicators, glassmorphic layout tokens, and physics-based entrance transitions mapping to international branding.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* SLIDE 2: SAVALIYA ICE CREAM POS SYSTEM */
              <motion.div
                key="savaliya"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex flex-col lg:flex-row gap-10 lg:gap-16 border-t border-slate-900/10 pt-10 items-start w-full"
              >
                {/* Left Pane: Brand metadata card */}
                <div className="w-full lg:w-1/3 flex flex-col gap-5 lg:sticky lg:top-24">
                  {/* Glowing contract tag */}
                  <div className="inline-flex items-center gap-2 self-start bg-pink-50 text-pink-700 border border-pink-300/40 px-3.5 py-1.5 rounded-full font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Official CSPIT Collaboration</span>
                  </div>

                  <h3 className="font-extrabold uppercase text-3xl sm:text-4xl text-slate-900 tracking-wide leading-tight">
                    Savaliya Ice Cream POS System
                  </h3>

                  <div className="flex flex-col gap-3.5 mt-2 text-sm text-slate-700">
                    <div className="flex justify-between py-2 border-b border-slate-900/5">
                      <span className="font-semibold text-slate-900 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> Client:</span>
                      <span>Mr. Manish Shah (Owner)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-900/5">
                      <span className="font-semibold text-slate-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> Timeline:</span>
                      <span>July - Nov 2025</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-900/5">
                      <span className="font-semibold text-slate-900 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> Developers:</span>
                      <span className="text-right">Nisarg (23CS070), Megh, Tejas</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-900/5">
                      <span className="font-semibold text-slate-900 flex items-center gap-2"><Award className="w-4 h-4 text-slate-400" /> Signed Date:</span>
                      <span>6th July, 2025</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-900/5">
                      <span className="font-semibold text-slate-900 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> Affiliation:</span>
                      <span>CHARUSAT CSPIT CSE Team</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {['React', 'Excel Storage', 'Dine-In & Parcel', 'Thermal Driver'].map(t => (
                      <span key={t} className="bg-slate-100 text-slate-800 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Pane: Features deck */}
                <div className="w-full lg:w-2/3 flex flex-col gap-6">
                  <h4 className="font-extrabold uppercase text-xs sm:text-sm text-slate-500 tracking-wider">
                    Project Overview & Engineering Scope
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-sm sm:text-base font-light">
                    Savaliya Ice Cream contracted the student development team of CSPIT to design and engineer a custom local Point of Sale (POS) system tailored specifically for high-efficiency ice-cream parlor catalog dispatching and order logs. Deployed for real business operations at the Nadiad Welcome Plazza outlet.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="service-card cyber-light-border p-6 rounded-3xl bg-slate-50 border border-slate-200/50 hover:border-slate-300 hover:bg-slate-100/50 transition-all duration-300 flex flex-col gap-3 shadow-sm">
                      <span className="font-bold text-slate-950 text-sm uppercase tracking-wide flex items-center gap-2">
                        🚀 Lightning POS Interface
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">Local-based, button-driven sales dashboard for sub-second catalog selection and cash register dispatching.</p>
                    </div>
                    <div className="service-card cyber-light-border p-6 rounded-3xl bg-slate-50 border border-slate-200/50 hover:border-slate-300 hover:bg-slate-100/50 transition-all duration-300 flex flex-col gap-3 shadow-sm">
                      <span className="font-bold text-slate-950 text-sm uppercase tracking-wide flex items-center gap-2">
                        💰 Multi-Mode Settlement
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">Integrated support for multiple flexible payment channels including cash, bank cheque, and digital Paytm ledger inputs.</p>
                    </div>
                    <div className="service-card cyber-light-border p-6 rounded-3xl bg-slate-50 border border-slate-200/50 hover:border-slate-300 hover:bg-slate-100/50 transition-all duration-300 flex flex-col gap-3 shadow-sm">
                      <span className="font-bold text-slate-950 text-sm uppercase tracking-wide flex items-center gap-2">
                        📊 Local Excel Data Vault
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">Transaction records, menus, and customer databases are compiled and securely structured directly in Excel formats.</p>
                    </div>
                    <div className="service-card cyber-light-border p-6 rounded-3xl bg-slate-50 border border-slate-200/50 hover:border-slate-300 hover:bg-slate-100/50 transition-all duration-300 flex flex-col gap-3 shadow-sm">
                      <span className="font-bold text-slate-950 text-sm uppercase tracking-wide flex items-center gap-2">
                        ⚡ Hold & Recall Queue
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">Built-in order queue hold/recall triggers, ideal for managing active dine-in groups and simultaneous parcel orders.</p>
                    </div>
                    <div className="service-card cyber-light-border p-6 rounded-3xl bg-slate-50 border border-slate-200/50 hover:border-slate-300 hover:bg-slate-100/50 transition-all duration-300 flex flex-col gap-3 shadow-sm">
                      <span className="font-bold text-slate-950 text-sm uppercase tracking-wide flex items-center gap-2">
                        ⏰ Pre-Order Reminders
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">Automatic alert system notifying operators 20 minutes prior to a due advance order, minimizing processing delays.</p>
                    </div>
                    <div className="service-card cyber-light-border p-6 rounded-3xl bg-slate-50 border border-slate-200/50 hover:border-slate-300 hover:bg-slate-100/50 transition-all duration-300 flex flex-col gap-3 shadow-sm">
                      <span className="font-bold text-slate-950 text-sm uppercase tracking-wide flex items-center gap-2">
                        🖨️ Thermal Bill Printer
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">Integrated GST compliant receipt formatting with raw printer drivers to generate and print hard-copy bills immediately.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hidden Sonar Telemetry log */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 hidden md:block z-30 pointer-events-none">
        <p className="sonar-target text-[9px] font-mono tracking-widest uppercase text-center">
          [ SERVICE_LOG: "Full-stack development, interactive UI, and high-performance algorithms." ]
        </p>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { FadeIn } from '../components/FadeIn';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmergencyButton } from '../components/EmergencyButton';
import { GlitchHeader } from '../components/GlitchHeader';

export const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.message) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            // Fallback to a placeholder, but looks up VITE_WEB3FORMS_KEY from your environment variables
            access_key: import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE",
            name: formState.name,
            email: formState.email,
            message: formState.message,
            subject: `New Portfolio Inquiry from ${formState.name}`,
            from_name: "Nisarg Portfolio Inquiries",
            replyto: formState.email // Instantly reply to the sender on click!
          })
        });

        const result = await response.json();
        if (result.success) {
          setIsSubmitted(true);
          setFormState({ name: '', email: '', message: '' });
          setTimeout(() => {
            setIsSubmitted(false);
          }, 4500);
        } else {
          alert('Submission failed. Please email Nisarg directly at kbnisargpatel001454@gmail.com');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Could not submit form. Please reach out to Nisarg directly via email!');
      }
    }
  };

  const contactDetails = [
    {
      icon: <Mail className="w-5 h-5 text-[#B600A8]" />,
      label: 'Email',
      value: 'kbnisargpatel001454@gmail.com',
      link: 'mailto:kbnisargpatel001454@gmail.com',
    },
    {
      icon: <Phone className="w-5 h-5 text-[#7621B0]" />,
      label: 'Phone',
      value: '+91 6351377227',
      link: 'tel:+916351377227',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      label: 'LinkedIn',
      value: 'linkedin.com/in/nisargpatel030305',
      link: 'https://www.linkedin.com/in/nisargpatel030305',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#BE4C00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      ),
      label: 'GitHub',
      value: 'github.com/NisargPatel03',
      link: 'https://github.com/NisargPatel03',
    },
    {
      icon: <MapPin className="w-5 h-5 text-teal-400" />,
      label: 'Location',
      value: 'Vadodara, Gujarat, India',
      link: 'https://maps.google.com/?q=Vadodara,Gujarat,India',
    },
  ];

  return (
    <section
      id="contact"
      className="bg-[#0C0C0C] py-24 md:py-32 w-full px-6 md:px-10 border-t border-[#D7E2EA]/5 relative overflow-hidden select-none"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-10 gap-12 sm:gap-16 items-start">
        <div className="md:col-span-4 flex flex-col gap-8 contact-panel">
          <FadeIn y={30} delay={0} duration={0.8} className="w-full">
            <span className="text-[#B600A8] uppercase font-bold tracking-widest text-xs sm:text-sm mb-4 block">
              Let&apos;s Build Together
            </span>
            <GlitchHeader text="Contact" />
            <p className="text-[#D7E2EA]/60 text-xs sm:text-sm font-light leading-relaxed mt-6">
              Have an exciting project, research, or development opportunity? Reach out directly via these channels or drop a message!
            </p>
          </FadeIn>

          <div className="flex flex-col gap-4">
            {contactDetails.map((detail, i) => (
              <FadeIn
                key={detail.label}
                y={20}
                delay={i * 0.08}
                duration={0.7}
                className="bg-[#121212] border border-[#232323] hover:border-[#7621B0]/30 rounded-2xl p-4 flex gap-4 items-center transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] border border-white/5 flex justify-center items-center group-hover:border-[#7621B0]/30 transition-colors">
                  {detail.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[#D7E2EA]/40 text-[10px] uppercase tracking-wider">
                    {detail.label}
                  </span>
                  <a
                    href={detail.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-400 font-light text-xs sm:text-sm transition-colors mt-0.5 break-all"
                  >
                    {detail.value}
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <div className="md:col-span-6 bg-[#121212] border border-[#232323] rounded-[30px] p-6 sm:p-8 relative contact-panel">
          <FadeIn y={30} delay={0.2} duration={0.8}>
            <h3 className="text-white font-extrabold uppercase text-xl sm:text-2xl tracking-wider mb-6">
              Send an Inquiry
            </h3>
            
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-10 gap-4 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/30 flex justify-center items-center text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-white font-bold text-lg uppercase tracking-wider">Message Dispatched!</h4>
                  <p className="text-[#D7E2EA]/60 text-xs sm:text-sm font-light max-w-xs">
                    Thank you for reaching out, Nisarg will get back to you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[#D7E2EA]/50 text-xs uppercase tracking-widest pl-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#1c1c1c] border border-white/5 focus:border-[#7621B0] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
                    />
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[#D7E2EA]/50 text-xs uppercase tracking-widest pl-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-[#1c1c1c] border border-white/5 focus:border-[#7621B0] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
                    />
                  </div>

                  {/* Message field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[#D7E2EA]/50 text-xs uppercase tracking-widest pl-1">
                      Your Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Discuss custom creations, contract web roles, or research..."
                      className="w-full bg-[#1c1c1c] border border-white/5 focus:border-[#7621B0] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Send Button */}
                  <motion.button
                    type="submit"
                    className="w-full mt-4 rounded-xl py-3.5 bg-gradient-to-r from-[#B600A8] to-[#7621B0] text-white font-bold uppercase tracking-widest text-xs sm:text-sm flex justify-center items-center gap-2 select-none"
                    whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </motion.button>
                </form>
              )}
            </AnimatePresence>
          </FadeIn>
        </div>
      </div>

      {/* Meltdown Emergency Override Button */}
      <EmergencyButton />

      {/* CopyRights Footer */}
      <div className="w-full max-w-5xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[#D7E2EA]/30 text-xs font-mono uppercase tracking-widest">
        <span>© {new Date().getFullYear()} Nisarg Patel. All Rights Reserved.</span>
        <span>Curated with React, TypeScript & Tailwind CSS</span>
      </div>
    </section>
  );
};

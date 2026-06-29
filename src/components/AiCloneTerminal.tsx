import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, getOfflineAnswer } from '../data/cloneKnowledge';
import { soundFX } from '../utils/terminalAudio';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface AiCloneTerminalProps {
  isBlueprintMode?: boolean;
}

// Visualizer component displaying active wave patterns
const VisualizerWave: React.FC<{ active: boolean; blueprint: boolean }> = ({ active, blueprint }) => {
  const [heights, setHeights] = useState<number[]>([15, 8, 22, 12, 18, 5, 25, 14, 19, 7, 21, 10, 16, 9, 13]);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    if (!active) {
      setHeights([6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]);
      return;
    }

    const update = () => {
      setHeights(prev => prev.map(() => Math.floor(Math.random() * 26) + 4));
      timeoutRef.current = setTimeout(update, 75);
    };

    update();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [active]);

  const color = blueprint ? '#00f3ff' : '#00ff41';

  return (
    <svg viewBox="0 0 160 40" className="w-full h-8 max-w-[160px]">
      {heights.map((h, i) => (
        <rect
          key={i}
          x={12 + i * 9}
          y={20 - h / 2}
          width="4"
          height={h}
          fill={blueprint ? 'transparent' : 'rgba(0, 255, 65, 0.15)'}
          stroke={color}
          strokeWidth="0.75"
          opacity={blueprint ? 0.7 : 0.9}
        />
      ))}
      {blueprint && (
        <>
          <line x1="5" y1="20" x2="155" y2="20" stroke="#00f3ff" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
          <text x="142" y="36" fill="#00f3ff" fontFamily="monospace" fontSize="5" opacity="0.4">FREQ_HZ</text>
        </>
      )}
    </svg>
  );
};

export const AiCloneTerminal: React.FC<AiCloneTerminalProps> = ({ isBlueprintMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: `System check: Neural connection established. Welcome to Nisarg Aether, my Digital Clone. I am trained on Nisarg Patel's complete developer profile, research, and certificates. Ask me anything, or select a telemetry chip below!`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<any>(null);

  // Initialize Gemini model
  useEffect(() => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
    if (API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        modelRef.current = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: SYSTEM_PROMPT,
        });
      } catch (err) {
        console.error("Failed to initialize Google Generative AI client:", err);
      }
    }
  }, []);

  // Expose global window toggler
  useEffect(() => {
    (window as any).toggleAiClone = () => {
      soundFX.playClick();
      setIsOpen(prev => !prev);
    };
    return () => {
      delete (window as any).toggleAiClone;
    };
  }, []);

  // Dispatch custom event when open state changes to notify other components (e.g. BlueprintToggle)
  useEffect(() => {
    const event = new CustomEvent('aiCloneStateChange', { detail: { isOpen } });
    window.dispatchEvent(event);
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Voice synthesis executor
  const speak = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    // Strip markdown formatting for cleaner speech synthesis
    const cleanText = text
      .replace(/[*#`\-]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); 

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    const voices = window.speechSynthesis.getVoices();
    const prefered = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural'))) || 
                     voices.find(v => v.lang.startsWith('en')) || 
                     voices[0];
    if (prefered) {
      utterance.voice = prefered;
    }
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Stop voice synthesis on close or toggle off
  useEffect(() => {
    if (!ttsEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [ttsEnabled]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle queries
  const handleSend = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    soundFX.playClick();
    const query = text.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setIsGenerating(true);

    let reply = "";
    
    if (modelRef.current) {
      try {
        const result = await modelRef.current.generateContent(query);
        const response = await result.response;
        reply = response.text();
      } catch (err) {
        console.error("Gemini generation error, falling back to local database RAG:", err);
        reply = getOfflineAnswer(query);
      }
    } else {
      // Simulate slight network delay for offline mode to feel natural
      await new Promise(r => setTimeout(r, 600));
      reply = getOfflineAnswer(query);
    }

    setIsGenerating(false);
    setMessages(prev => [...prev, { role: 'model', content: reply }]);
    
    if (ttsEnabled) {
      speak(reply);
    }
  };

  const handleChipClick = (prompt: string) => {
    handleSend(prompt);
  };

  const handleToggleOpen = () => {
    soundFX.playClick();
    setIsOpen(!isOpen);
  };

  // Safe markdown renderer helper
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let content = line;
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      content = content.replace(/`(.*?)`/g, '<code class="bg-black/40 px-1 py-0.5 rounded text-[10px]">$1</code>');
      
      const linkClass = isBlueprintMode 
        ? "underline text-[#00f3ff] hover:text-[#00c8ff]"
        : "underline text-[#00ff41] hover:text-[#00ff9f]";

      // 1. Parse markdown links: [Text](URL)
      content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noopener noreferrer" class="${linkClass}">$1</a>`);

      // 2. Parse raw emails (e.g. kbnisargpatel001454@gmail.com) that are not already inside href
      content = content.replace(/(?<!href="mailto:)(?<!mailto:)\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, (match) => {
        return `<a href="mailto:${match}" class="${linkClass}">${match}</a>`;
      });

      // 3. Parse raw github.com/xxx and linkedin.com/xxx links that are not already inside href attributes
      content = content.replace(/(?<!href=")(?<!">)\b(github\.com\/[A-Za-z0-9\/._%+-]*[A-Za-z0-9\/]|linkedin\.com\/[A-Za-z0-9\/._%+-]*[A-Za-z0-9\/])\b/g, (match) => {
        return `<a href="https://${match}" target="_blank" rel="noopener noreferrer" class="${linkClass}">${match}</a>`;
      });

      // 4. Parse any other raw http://, https:// or www. links that are not already inside href
      content = content.replace(/(?<!href=")(?<!">)\b(https?:\/\/[A-Za-z0-9\/._%+-]*[A-Za-z0-9\/]|www\.[A-Za-z0-9\/._%+-]*[A-Za-z0-9\/])\b/g, (match) => {
        const url = match.startsWith('www.') ? `https://${match}` : match;
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${linkClass}">${match}</a>`;
      });

      if (line.startsWith('- ') || line.startsWith('* ')) {
        const clean = content.substring(2);
        return (
          <li key={idx} className="list-disc list-inside ml-2 mb-0.5 text-xs" dangerouslySetInnerHTML={{ __html: clean }} />
        );
      }
      return (
        <p key={idx} className="mb-1 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
      );
    });
  };

  const isWaveActive = isGenerating || isSpeaking;
  const accentTextClass = isBlueprintMode ? 'text-[#00f3ff]' : 'text-[#00ff41]';
  const accentBorderClass = isBlueprintMode ? 'border-[#00f3ff]' : 'border-[#00ff41]/20';
  const shadowClass = isBlueprintMode 
    ? 'shadow-[0_0_20px_rgba(0,243,255,0.15)] border-[#00f3ff]' 
    : 'shadow-[0_0_20px_rgba(0,255,65,0.06)] border-[#00ff41]/25';

  return (
    <>
      {/* Floating launcher trigger */}
      <div className="fixed bottom-20 right-6 md:bottom-24 md:right-8 z-[999]">
        <button
          type="button"
          onClick={handleToggleOpen}
          aria-label="Toggle AI digital clone"
          className={`w-12 h-12 rounded-full flex items-center justify-center relative group transition-all duration-300 active:scale-90 border backdrop-blur-md ${
            isBlueprintMode 
              ? 'border-[#00f3ff] bg-[#040d1a] shadow-[0_0_15px_rgba(0,243,255,0.25)]' 
              : 'border-[#00ff41]/30 bg-black/85 shadow-[0_0_15px_rgba(0,255,65,0.15)] hover:border-[#00ff41]/60'
          }`}
        >
          {/* Animated beacon ring */}
          <span className={`absolute inset-0 rounded-full animate-ping opacity-25 border ${isBlueprintMode ? 'border-[#00f3ff]' : 'border-[#00ff41]'}`} style={{ animationDuration: '3s' }} />
          
          <img 
            src="/aether_avatar.png" 
            alt="Nisarg Aether Avatar" 
            className="w-full h-full rounded-full object-cover p-[2px] transition-transform duration-300 group-hover:scale-105"
          />

          {/* Tooltip */}
          <span className={`absolute right-14 text-[9px] font-mono tracking-widest px-2 py-1 rounded border backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 select-none pointer-events-none whitespace-nowrap bg-black/90 ${accentTextClass} ${accentBorderClass}`}>
            [NISARG_AETHER: ONLINE]
          </span>
        </button>
      </div>

      {/* Main expanded panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            data-lenis-prevent
            className={`fixed bottom-36 right-6 md:right-8 z-[1000] w-[90vw] max-w-md border rounded-xl flex flex-col overflow-hidden backdrop-blur-md bg-black/90 font-mono ${shadowClass}`}
          >
            {/* Header section */}
            <div className={`flex items-center justify-between border-b px-4 py-2.5 bg-black/40 text-[9px] tracking-widest transition-all ${accentBorderClass} ${accentTextClass}`}>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-amber-500 animate-pulse' : 'bg-red-500 animate-pulse'}`} />
                <span className="font-glow">COGNITIVE_SYNC_PORT: {modelRef.current ? 'LIVE' : 'OFFLINE_FAQS'}</span>
              </div>
              <button
                type="button"
                onClick={handleToggleOpen}
                className={`text-xs hover:scale-110 active:scale-95 transition-transform ${accentTextClass}`}
              >
                ×
              </button>
            </div>

            {/* Sub-header with the animated audio visualizer */}
            <div className={`flex items-center justify-between px-4 py-2 border-b bg-black/10 ${accentBorderClass}`}>
              <div className="flex flex-col gap-0.5">
                <span className={`text-[8px] tracking-widest opacity-60 ${accentTextClass}`}>NEURAL_SPEECH_STREAM</span>
                <span className={`text-[9px] font-bold ${accentTextClass}`}>{isSpeaking ? 'VOICING_ANSWER' : isGenerating ? 'AI_PROCESSING...' : 'STANDBY_READY'}</span>
              </div>
              <VisualizerWave active={isWaveActive} blueprint={isBlueprintMode} />
            </div>

            {/* Chat message feed logs */}
            <div className={`flex-grow h-[220px] md:h-[260px] overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin`}>
              {messages.map((msg, idx) => {
                const isModel = msg.role === 'model';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[85%] ${isModel ? 'self-start' : 'self-end items-end'}`}
                  >
                    <span className={`text-[7px] mb-1 opacity-55 tracking-wider uppercase ${accentTextClass}`}>
                      {isModel ? '❯ NISARG_AETHER' : '❯ VISITOR'}
                    </span>
                    <div className={`border rounded-lg px-3 py-2 text-xs transition-all ${
                      isModel 
                        ? isBlueprintMode
                          ? 'border-[#00f3ff] bg-transparent text-[#00f3ff]'
                          : 'border-[#00ff41]/20 bg-emerald-950/10 text-[#00ff41]/90 shadow-[0_0_8px_rgba(0,255,65,0.02)]'
                        : isBlueprintMode
                          ? 'border-[#00f3ff] bg-[#00f3ff]/10 text-[#00f3ff] border-dashed'
                          : 'border-white/10 bg-white/5 text-white'
                    }`}>
                      {parseMarkdown(msg.content)}
                    </div>
                  </div>
                );
              })}

              {isGenerating && (
                <div className="self-start flex flex-col max-w-[85%]">
                  <span className={`text-[7px] mb-1 opacity-55 tracking-wider uppercase ${accentTextClass}`}>
                    ❯ NISARG_AETHER
                  </span>
                  <div className={`border rounded-lg px-3 py-2 text-xs animate-pulse ${
                    isBlueprintMode ? 'border-[#00f3ff] text-[#00f3ff]' : 'border-[#00ff41]/20 text-[#00ff41]/75'
                  }`}>
                    Thinking... [syncing logic blocks]
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Preset dialogue prompt chips */}
            <div className={`flex flex-wrap gap-1.5 px-4 py-2 border-t bg-black/20 ${accentBorderClass}`}>
              {[
                { label: 'Hire Nisarg', text: 'How can I hire Nisarg and what are his contact details?' },
                { label: 'Technical Stack', text: 'Give me a summary of Nisarg\'s technical skills and frameworks.' },
                { label: 'Publications', text: 'Tell me about Nisarg\'s academic research papers.' },
                { label: 'Core Projects', text: 'Highlight Nisarg\'s top featured development projects.' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(chip.text)}
                  disabled={isGenerating}
                  className={`text-[8px] border px-2 py-1 rounded-full active:scale-95 transition-all tracking-wider disabled:opacity-50 disabled:pointer-events-none ${
                    isBlueprintMode 
                      ? 'border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff]/10' 
                      : 'border-[#00ff41]/25 text-[#00ff41] hover:bg-[#00ff41]/10 bg-emerald-950/5'
                  }`}
                >
                  [{chip.label}]
                </button>
              ))}
            </div>

            {/* Control panel and chat inputs */}
            <div className={`border-t p-3 flex flex-col gap-2 bg-black/40 ${accentBorderClass}`}>
              <div className="flex items-center justify-between text-[9px] uppercase px-1">
                <span className={accentTextClass}>SYS_CONTROLS</span>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setTtsEnabled(!ttsEnabled);
                  }}
                  className={`flex items-center gap-1 border px-2 py-0.5 rounded transition-colors ${
                    ttsEnabled 
                      ? isBlueprintMode 
                        ? 'border-[#00f3ff] bg-[#00f3ff]/15 text-[#00f3ff]'
                        : 'border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41]'
                      : 'border-white/10 text-white/50 hover:bg-white/5'
                  }`}
                >
                  <span>{ttsEnabled ? '🔊 voice: on' : '🔇 voice: off'}</span>
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputText);
                }}
                className={`flex items-center gap-2 border rounded-lg px-3 py-2 bg-black/60 ${
                  isBlueprintMode 
                    ? 'border-[#00f3ff]' 
                    : 'border-[#00ff41]/20 focus-within:border-[#00ff41]/50'
                }`}
              >
                <span className={`text-[10px] font-bold select-none ${isGenerating ? 'animate-pulse' : ''} ${accentTextClass}`}>❯</span>
                <input
                  type="text"
                  placeholder={isGenerating ? "Clone thinking..." : "Ask me anything about Nisarg..."}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isGenerating}
                  className={`flex-grow bg-transparent border-none outline-none text-xs ${
                    isBlueprintMode ? 'text-[#00f3ff] placeholder-[#00f3ff]/30' : 'text-[#00ff41] placeholder-[#00ff41]/30'
                  }`}
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

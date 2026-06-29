import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundFX } from '../utils/terminalAudio';

interface CommandItem {
  id: string;
  name: string;
  category: string;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  onToggleMatrix: () => void;
  isMatrixActive: boolean;
  onToggleSound: () => void;
  isSoundActive: boolean;
  onToggleAmbient: () => void;
  isAmbientActive: boolean;
  onToggleCursorTrail: () => void;
  isCursorTrailActive: boolean;
  isHudActive: boolean;
  onToggleHud: () => void;
  activeTheme: 'project' | 'toxic-radar' | 'vapor-matrix' | 'amber-console' | 'blueprint-arctic';
  onChangeTheme: (theme: 'project' | 'toxic-radar' | 'vapor-matrix' | 'amber-console' | 'blueprint-arctic') => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  onToggleMatrix,
  isMatrixActive,
  onToggleSound,
  isSoundActive,
  onToggleAmbient,
  isAmbientActive,
  onToggleCursorTrail,
  isCursorTrailActive,
  isHudActive,
  onToggleHud,
  activeTheme,
  onChangeTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isKeyboardActionRef = useRef(false);

  // Keyboard shortcut listener to open command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            soundFX.playSuccess();
          } else {
            soundFX.playClick();
          }
          return !prev;
        });
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsOpen(true);
        soundFX.playSuccess();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autofocus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSearch('');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleScrollToSection = (id: string) => {
    if ((window as any).triggerWarpScroll) {
      (window as any).triggerWarpScroll(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  const handleSetTheme = (theme: 'project' | 'toxic-radar' | 'vapor-matrix' | 'amber-console' | 'blueprint-arctic') => {
    onChangeTheme(theme);
    setIsOpen(false);
  };

  const commands: CommandItem[] = [
    // --- NAVIGATION ---
    { id: 'nav-hero', name: 'Navigate: Scroll to Top / Hero', category: 'Navigation', shortcut: 'G T', action: () => handleScrollToSection('hero') },
    { id: 'nav-skills', name: 'Navigate: Scroll to Skills Marquee', category: 'Navigation', shortcut: 'G S', action: () => handleScrollToSection('skills') },
    { id: 'nav-architecture', name: 'Navigate: Scroll to Architecture Canvas', category: 'Navigation', shortcut: 'G A', action: () => handleScrollToSection('architecture') },
    { id: 'nav-about', name: 'Navigate: Scroll to About Me', category: 'Navigation', shortcut: 'G B', action: () => handleScrollToSection('about') },
    { id: 'nav-work', name: 'Navigate: Scroll to Work Experience', category: 'Navigation', shortcut: 'G W', action: () => handleScrollToSection('work-experience') },
    { id: 'nav-services', name: 'Navigate: Scroll to Services', category: 'Navigation', shortcut: 'G V', action: () => handleScrollToSection('services') },
    { id: 'nav-projects', name: 'Navigate: Scroll to Projects Terminal', category: 'Navigation', shortcut: 'G P', action: () => handleScrollToSection('projects-section') },
    { id: 'nav-certs', name: 'Navigate: Scroll to Certifications', category: 'Navigation', shortcut: 'G C', action: () => handleScrollToSection('certifications') },
    { id: 'nav-contact', name: 'Navigate: Scroll to Contact Form', category: 'Navigation', shortcut: 'G M', action: () => handleScrollToSection('contact') },

    // --- THEMES ---
    { id: 'theme-project', name: activeTheme === 'project' ? 'Theme: Reset to Project Defaults [ACTIVE]' : 'Theme: Reset to Project Defaults', category: 'Theme Configuration', shortcut: 'T D', action: () => handleSetTheme('project') },
    { id: 'theme-toxic-radar', name: activeTheme === 'toxic-radar' ? 'Theme: Apply Toxic Radar Green [ACTIVE]' : 'Theme: Apply Toxic Radar Green', category: 'Theme Configuration', shortcut: 'T G', action: () => handleSetTheme('toxic-radar') },
    { id: 'theme-vapor-matrix', name: activeTheme === 'vapor-matrix' ? 'Theme: Apply Vapor Matrix Pink [ACTIVE]' : 'Theme: Apply Vapor Matrix Pink', category: 'Theme Configuration', shortcut: 'T V', action: () => handleSetTheme('vapor-matrix') },
    { id: 'theme-amber-console', name: activeTheme === 'amber-console' ? 'Theme: Apply Amber Console Gold [ACTIVE]' : 'Theme: Apply Amber Console Gold', category: 'Theme Configuration', shortcut: 'T A', action: () => handleSetTheme('amber-console') },
    { id: 'theme-blueprint-arctic', name: activeTheme === 'blueprint-arctic' ? 'Theme: Apply Blueprint Arctic Blue [ACTIVE]' : 'Theme: Apply Blueprint Arctic Blue', category: 'Theme Configuration', shortcut: 'T B', action: () => handleSetTheme('blueprint-arctic') },

    // --- AUDIO & EASTER EGGS ---
    { 
      id: 'toggle-sound', 
      name: isSoundActive ? 'Audio: Mute Keystroke Sound FX' : 'Audio: Unmute Keystroke Sound FX', 
      category: 'Preferences', 
      shortcut: 'S K', 
      action: () => {
        onToggleSound();
        setIsOpen(false);
      }
    },
    { 
      id: 'toggle-ambient', 
      name: isAmbientActive ? 'Audio: Stop Ambient Synthwave Soundtrack' : 'Audio: Start Ambient Synthwave Soundtrack', 
      category: 'Preferences', 
      shortcut: 'S A', 
      action: () => {
        onToggleAmbient();
        setIsOpen(false);
      }
    },
    { 
      id: 'toggle-cursortrail', 
      name: isCursorTrailActive ? 'Preferences: Disable Cybernetic Cursor Trail' : 'Preferences: Enable Cybernetic Cursor Trail', 
      category: 'Preferences', 
      shortcut: 'C T', 
      action: () => {
        onToggleCursorTrail();
        setIsOpen(false);
      }
    },
    { 
      id: 'toggle-matrix', 
      name: isMatrixActive ? 'Easter Egg: Stop Matrix Digital Rain' : 'Easter Egg: Start Matrix Digital Rain', 
      category: 'Preferences', 
      shortcut: 'M R', 
      action: () => {
        onToggleMatrix();
        setIsOpen(false);
      }
    },
    { 
      id: 'toggle-hud', 
      name: isHudActive ? 'Preferences: Disable Diagnostics HUD' : 'Preferences: Enable Diagnostics HUD', 
      category: 'Preferences', 
      shortcut: 'S H', 
      action: () => {
        onToggleHud();
        setIsOpen(false);
      }
    },
    { 
      id: 'toggle-aiclone', 
      name: 'Toggle: Holographic AI Nisarg Aether', 
      category: 'Preferences', 
      shortcut: 'S C', 
      action: () => {
        if ((window as any).toggleAiClone) {
          (window as any).toggleAiClone();
        }
        setIsOpen(false);
      }
    },
  ];

  // Filter commands by search term
  const filteredCommands = commands.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  // Keyboard navigation inside list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      soundFX.playClick();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      soundFX.playClick();
      isKeyboardActionRef.current = true;
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      soundFX.playClick();
      isKeyboardActionRef.current = true;
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        soundFX.playSuccess();
        filteredCommands[selectedIndex].action();
      }
    }
  };

  // Scroll item into view
  useEffect(() => {
    if (!isKeyboardActionRef.current) return;
    const listEl = listRef.current;
    if (!listEl) return;
    const selectedEl = listEl.children[selectedIndex] as HTMLElement;
    if (!selectedEl) return;

    const containerHeight = listEl.clientHeight;
    const itemTop = selectedEl.offsetTop;
    const itemHeight = selectedEl.clientHeight;

    if (itemTop + itemHeight > listEl.scrollTop + containerHeight) {
      listEl.scrollTop = itemTop + itemHeight - containerHeight;
    } else if (itemTop < listEl.scrollTop) {
      listEl.scrollTop = itemTop;
    }
  }, [selectedIndex]);

  return (
    <>
      {/* Floating terminal trigger pill */}
      <div 
        onClick={() => {
          setIsOpen(true);
          soundFX.playSuccess();
        }}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[999] flex items-center gap-2 bg-black/45 border border-white/10 px-4 py-2.5 rounded-full backdrop-blur-md text-[11px] font-mono text-[#D7E2EA] hover:text-white active:scale-95 transition-all cursor-pointer select-none group shadow-lg cyber-glass-bezel"
      >
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-color, #00ff41)' }} />
        <span className="font-bold tracking-wider uppercase transition-colors" style={{ color: 'var(--accent-color, #00ff41)' }}>CMD Palette</span>
        <span className="hidden md:inline-flex items-center gap-1 text-[#D7E2EA]/40">
          <kbd className="bg-white/5 border border-white/10 px-1 py-0.5 rounded text-[9px]">Ctrl</kbd>
          <span>+</span>
          <kbd className="bg-white/5 border border-white/10 px-1 py-0.5 rounded text-[9px]">K</kbd>
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 md:px-0">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsOpen(false);
                soundFX.playClick();
              }}
              className="absolute inset-0 bg-[#0C0C0C]/80 backdrop-blur-md"
            />

            {/* Panel Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              data-lenis-prevent
              className="relative w-full max-w-2xl bg-black/45 border border-white/10 rounded-3xl p-5 flex flex-col gap-4 shadow-[0_30px_70px_rgba(0,0,0,0.8)] backdrop-blur-xl bg-scanlines overflow-hidden max-h-[60vh] cyber-glass-bezel"
              onKeyDown={handleKeyDown}
            >
              {/* Scanline CRT simulation */}
              <div className="absolute inset-0 pointer-events-none border border-white/[0.03] rounded-3xl z-10" />

              {/* Input wrapper */}
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <span className="font-mono text-lg font-bold select-none animate-pulse" style={{ color: 'var(--accent-color, #00ff41)' }}>❯</span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or navigate..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedIndex(0);
                    soundFX.playClick();
                  }}
                  className="flex-grow bg-transparent border-none outline-none font-mono text-[#D7E2EA] placeholder-[#D7E2EA]/30 text-sm tracking-wide"
                />
                <button
                  onClick={() => {
                    setIsOpen(false);
                    soundFX.playClick();
                  }}
                  className="font-mono text-[10px] text-[#D7E2EA]/40 uppercase tracking-widest border border-white/10 px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  ESC
                </button>
              </div>

              {/* List */}
              <div
                ref={listRef}
                className="flex-grow overflow-y-auto flex flex-col gap-1 pr-1 scrollbar-thin"
              >
                {filteredCommands.length === 0 ? (
                  <div className="text-center py-8 text-xs font-mono text-[#D7E2EA]/30 italic">
                    No matching diagnostics commands found.
                  </div>
                ) : (
                  filteredCommands.map((cmd, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={cmd.id}
                        onClick={() => {
                          soundFX.playSuccess();
                          cmd.action();
                        }}
                        onMouseEnter={() => {
                          isKeyboardActionRef.current = false;
                          setSelectedIndex(idx);
                        }}
                        style={isSelected ? {
                          backgroundColor: 'rgba(var(--accent-rgb, 0, 255, 65), 0.1)',
                          borderColor: 'rgba(var(--accent-rgb, 0, 255, 65), 0.3)',
                          color: 'var(--accent-color, #00ff41)',
                        } : undefined}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border text-white'
                            : 'border border-transparent text-[#D7E2EA]/75 hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold tracking-wide uppercase">
                            {cmd.name}
                          </span>
                          <span className="text-[9px] font-mono uppercase tracking-widest text-[#D7E2EA]/30 mt-0.5">
                            {cmd.category}
                          </span>
                        </div>
                        {cmd.shortcut && (
                          <div className="flex items-center gap-1">
                            {cmd.shortcut.split(' ').map((char, cIdx) => (
                              <kbd
                                key={cIdx}
                                style={isSelected ? {
                                  backgroundColor: 'rgba(var(--accent-rgb, 0, 255, 65), 0.2)',
                                  borderColor: 'rgba(var(--accent-rgb, 0, 255, 65), 0.3)',
                                  color: 'var(--accent-color, #00ff41)',
                                } : undefined}
                                className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${
                                  isSelected
                                    ? 'text-white'
                                    : 'bg-white/5 border-white/10 text-[#D7E2EA]/40'
                                }`}
                              >
                                {char}
                              </kbd>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer info bar */}
              <div className="flex justify-between items-center border-t border-white/5 pt-3 text-[9px] font-mono uppercase tracking-widest text-[#D7E2EA]/30">
                <div className="flex gap-4">
                  <span>↑↓ Nav</span>
                  <span>↵ Enter Select</span>
                </div>
                <span>Nisarg Diagnostics v1.0.0</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

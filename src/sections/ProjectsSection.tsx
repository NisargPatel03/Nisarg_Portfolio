import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  PROJECTS_TERMINAL,
  ACCENT_COLORS,
  type TerminalLog,
  type TerminalProject,
} from '../data/projectsTerminal';
import { soundFX } from '../utils/terminalAudio';
import { GlitchHeader } from '../components/GlitchHeader';
import './projects-terminal.css';

const CMD_SPEED = 20;
const GLITCH_MS = 300;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

interface ProjectsSectionProps {
  activeTheme: 'project' | 'toxic-radar' | 'vapor-matrix' | 'amber-console' | 'blueprint-arctic';
  setActiveTheme: (theme: 'project' | 'toxic-radar' | 'vapor-matrix' | 'amber-console' | 'blueprint-arctic') => void;
  isBlueprintMode?: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ activeTheme, setActiveTheme, isBlueprintMode }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const curRef = useRef(0);
  const runningRef = useRef(false);
  const signalRef = useRef({ cancelled: false });
  const initializedRef = useRef(false);
  const hasDeployedRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cmdText, setCmdText] = useState('');
  const [progress, setProgress] = useState(0);
  const [progressVisible, setProgressVisible] = useState(false);
  const [logs, setLogs] = useState<{ text: string; type: TerminalLog['t']; isBanner?: boolean }[]>([]);
  const [cardVisible, setCardVisible] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [scanline, setScanline] = useState(false);

  const [crtEnabled, setCrtEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [flickerActive, setFlickerActive] = useState(false);

  useEffect(() => {
    setFlickerActive(true);
    const timer = setTimeout(() => setFlickerActive(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleDragStart = (clientX: number) => {
    if (runningRef.current) return;
    setDragStartX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (dragStartX === null) return;
    const offset = clientX - dragStartX;
    if (offset > 0 && currentIndex === 0) {
      setDragOffset(offset * 0.3);
    } else if (offset < 0 && currentIndex === total - 1) {
      setDragOffset(offset * 0.3);
    } else {
      setDragOffset(offset);
    }
  };

  const handleDragEnd = async () => {
    if (dragStartX === null) return;
    const threshold = 120;
    if (dragOffset < -threshold && currentIndex < total - 1) {
      setExitDirection('left');
      await sleep(150);
      nextProject();
      setExitDirection(null);
    } else if (dragOffset > threshold && currentIndex > 0) {
      setExitDirection('right');
      await sleep(150);
      prevProject();
      setExitDirection(null);
    }
    setDragStartX(null);
    setDragOffset(0);
  };

  useEffect(() => {
    soundFX.enabled = soundEnabled;
  }, [soundEnabled]);

  const total = PROJECTS_TERMINAL.length;

  const wipe = useCallback(() => {
    signalRef.current.cancelled = true;
    setCmdText('');
    setProgress(0);
    setProgressVisible(false);
    setLogs([]);
    setCardVisible(false);
    signalRef.current = { cancelled: false };
  }, []);

  const typeString = useCallback(
    async (setter: (v: string) => void, text: string, speed: number) => {
      for (let i = 0; i <= text.length; i++) {
        if (signalRef.current.cancelled) return;
        setter(text.slice(0, i));
        if (i < text.length) {
          soundFX.playClick();
          await sleep(speed);
        }
      }
    },
    []
  );

  const fillProgress = useCallback(async () => {
    setProgressVisible(true);
    let pct = 0;
    setProgress(0);
    while (pct < 100) {
      if (signalRef.current.cancelled) return;
      pct = Math.min(100, pct + Math.floor(Math.random() * 8) + 3);
      setProgress(pct);
      await sleep(18 + Math.random() * 22);
    }
    setProgress(100);
  }, []);

  const typeLogs = useCallback(
    async (logLines: TerminalLog[]) => {
      const built: { text: string; type: TerminalLog['t'] }[] = [];
      for (const line of logLines) {
        if (signalRef.current.cancelled) return;
        built.push({ text: line.txt, type: line.t });
        setLogs([...built]);
        soundFX.playClick();
        await sleep(90 + Math.random() * 70); // realistic log line printing interval
      }
    },
    []
  );

  const runDeploy = useCallback(
    async (p: TerminalProject) => {
      runningRef.current = true;
      await typeString(setCmdText, p.cmd, CMD_SPEED);
      if (signalRef.current.cancelled) {
        runningRef.current = false;
        return;
      }
      await fillProgress();
      if (signalRef.current.cancelled) {
        runningRef.current = false;
        return;
      }
      soundFX.playSuccess();
      await typeLogs(p.logs);
      if (signalRef.current.cancelled) {
        runningRef.current = false;
        return;
      }
      setCardVisible(true);
      hasDeployedRef.current = true;
      runningRef.current = false;
      bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
    },
    [typeString, fillProgress, typeLogs]
  );

  const goTo = useCallback(
    async (index: number, withGlitch: boolean) => {
      if (runningRef.current) return;
      const clamped = Math.max(0, Math.min(index, total - 1));
      if (clamped === curRef.current && !withGlitch && hasDeployedRef.current) return;

      runningRef.current = true;

      if (withGlitch && curRef.current !== clamped) {
        setGlitching(true);
        setScanline(true);
        await sleep(GLITCH_MS);
        setGlitching(false);
        setScanline(false);
      }

      wipe();
      curRef.current = clamped;
      setCurrentIndex(clamped);
      await runDeploy(PROJECTS_TERMINAL[clamped]);
    },
    [wipe, runDeploy, total]
  );

  const nextProject = useCallback(() => {
    soundFX.playClick();
    if (curRef.current < total - 1) goTo(curRef.current + 1, true);
  }, [goTo, total]);

  const prevProject = useCallback(() => {
    soundFX.playClick();
    if (curRef.current > 0) goTo(curRef.current - 1, true);
  }, [goTo]);

  useEffect(() => {
    const handleTourCommand = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { action, projectId, slug } = customEvent.detail;

      if (action === 'openProject') {
        let index = -1;
        if (typeof projectId === 'number') {
          index = projectId;
        } else if (slug) {
          index = PROJECTS_TERMINAL.findIndex((p) => p.slug === slug);
        }
        if (index !== -1) {
          // If already running, cancel the previous one and start the new one
          signalRef.current.cancelled = true;
          runningRef.current = false;
          goTo(index, true);
        }
      }
    };

    window.addEventListener('aiTourCommand', handleTourCommand);
    return () => {
      window.removeEventListener('aiTourCommand', handleTourCommand);
    };
  }, [goTo]);

  const runBootSequence = useCallback(async () => {
    runningRef.current = true;
    wipe();
    await sleep(200);

    await typeString(setCmdText, 'boot-system --verbose', CMD_SPEED * 2.5);
    if (signalRef.current.cancelled) {
      runningRef.current = false;
      return;
    }
    await sleep(400);

    const bootLines: { text: string; type: TerminalLog['t'] }[] = [
      { text: '[  0.000000] Bios version: NisargBIOS v1.0', type: 'output' },
      { text: '[  0.032194] CPU: 4+ Years of Professional Development', type: 'output' },
      { text: '[  0.076120] RAM check: 16384 MB OK', type: 'output' },
      { text: '[  0.110294] Initializing Portfolio Core...', type: 'output' },
      { text: '[  0.187319] Loading Project Registries [12 / 12]...', type: 'output' },
      { text: '[  0.254109] Mounting Virtual Filesystem...', type: 'output' },
      { text: '[  0.310294] Launching Interactive Terminal...', type: 'success' },
    ];

    for (const line of bootLines) {
      if (signalRef.current.cancelled) {
        runningRef.current = false;
        return;
      }
      soundFX.playClick();
      setLogs((prev) => [...prev, line]);
      await sleep(350 + Math.random() * 200);
    }

    const bannerLines = [
      '███╗   ██╗██████╗ ',
      '████╗  ██║██╔══██╗',
      '██╔██╗ ██║██████╔╝',
      '██║╚██╗██║██╔═══╝ ',
      '██║ ╚████║██║     ',
      '╚═╝  ╚═══╝╚═╝     '
    ];

    await sleep(300);
    for (const line of bannerLines) {
      if (signalRef.current.cancelled) {
        runningRef.current = false;
        return;
      }
      soundFX.playClick();
      setLogs((prev) => [...prev, { text: line, type: 'success', isBanner: true }]);
      await sleep(250);
    }

    await sleep(1800);
    if (signalRef.current.cancelled) {
      runningRef.current = false;
      return;
    }

    wipe();
    runningRef.current = false;
    await goTo(0, false);
  }, [typeString, goTo, wipe]);

  useEffect(() => {
    if (initializedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !initializedRef.current) {
            initializedRef.current = true;
            runBootSequence();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    const currentEl = sectionRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      observer.disconnect();
    };
  }, [runBootSequence]);

  const dragStyle = dragStartX !== null ? {
    transform: `translate3d(${dragOffset}px, ${Math.abs(dragOffset) * 0.04}px, 0) rotate(${dragOffset * 0.02}deg)`,
    transition: 'none'
  } : {};

  return (
    <section
      id="projects-section"
      ref={sectionRef}
      className="projects-terminal-section"
    >
      <div className="projects-terminal-heading w-full">
        <span className="mb-4 block">Featured Repositories</span>
        <GlitchHeader text="Projects" />
      </div>

      <div id="terminal-wrap" className="projects-terminal-sticky">
        <div className="project-deck-container">
          {PROJECTS_TERMINAL.map((proj, idx) => {
            const diff = idx - currentIndex;
            const isVisible = diff >= -1 && diff <= 3;
            if (!isVisible) return null;

            const isActive = diff === 0;
            const isExitLeft = diff === -1 && exitDirection === 'left';
            const isExitRight = diff === -1 && exitDirection === 'right';

            let cardClass = '';
            if (isActive) {
              cardClass = 'is-active';
            } else if (diff === -1) {
              cardClass = isExitLeft ? 'is-exit-left' : isExitRight ? 'is-exit-right' : 'diff-hidden';
            } else {
              cardClass = `is-background diff-${diff}`;
            }

            const cardAccentColor = ACCENT_COLORS[proj.accent];

            return (
              <div
                key={proj.slug}
                className={`project-deck-card ${cardClass}`}
                style={isActive ? dragStyle : undefined}
                onClick={() => {
                  if (!isActive && diff > 0) {
                    goTo(idx, true);
                  }
                }}
                onTouchStart={isActive ? (e) => handleDragStart(e.touches[0].clientX) : undefined}
                onTouchMove={isActive ? (e) => handleDragMove(e.touches[0].clientX) : undefined}
                onTouchEnd={isActive ? handleDragEnd : undefined}
                onMouseDown={isActive ? (e) => handleDragStart(e.clientX) : undefined}
                onMouseMove={isActive ? (e) => handleDragMove(e.clientX) : undefined}
                onMouseUp={isActive ? handleDragEnd : undefined}
                onMouseLeave={isActive ? handleDragEnd : undefined}
              >
                {isActive && <div className="laser-scanline" />}
                <TerminalPanel
                  project={proj}
                  accentColor={cardAccentColor}
                  currentIndex={idx}
                  total={total}
                  cmdText={isActive ? cmdText : proj.cmd}
                  progress={isActive ? progress : 100}
                  progressVisible={isActive ? progressVisible : false}
                  logs={isActive ? logs : []}
                  cardVisible={isActive ? cardVisible : true}
                  glitching={isActive ? glitching : false}
                  scanline={isActive ? scanline : false}
                  bodyRef={isActive ? bodyRef : { current: null }}
                  onNext={nextProject}
                  onPrev={prevProject}
                  onDotClick={(i) => goTo(i, true)}
                  crtEnabled={crtEnabled}
                  setCrtEnabled={setCrtEnabled}
                  soundEnabled={soundEnabled}
                  setSoundEnabled={setSoundEnabled}
                  isActive={isActive}
                  flickerActive={isActive && flickerActive}
                  activeTheme={activeTheme}
                  setActiveTheme={setActiveTheme}
                  isBlueprintMode={isBlueprintMode}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Hidden Sonar Telemetry log */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 hidden md:block z-30 pointer-events-none">
        <p className="sonar-target text-[9px] font-mono tracking-widest uppercase text-center">
          [ PROJ_FACT: "Blaze Overseas, Savaliya Ice-Cream, and CodeGraph repositories live." ]
        </p>
      </div>
    </section>
  );
};

const BlueprintProjectSchematic: React.FC<{ project: TerminalProject }> = ({ project }) => {
  const tables = project.dbChecklist.map((item) => {
    const parts = item.split(' (');
    const tableName = parts[0];
    const details = parts[1] ? parts[1].replace(')', '') : '';
    return { name: tableName, details };
  });

  return (
    <svg
      viewBox="0 0 350 210"
      className="w-full h-full"
      style={{ background: 'rgba(4, 13, 26, 0.95)' }}
    >
      <defs>
        <pattern id="schematic-grid" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#00f3ff" strokeWidth="0.5" strokeOpacity="0.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#schematic-grid)" />

      <rect x="15" y="10" width="320" height="22" fill="none" stroke="#00f3ff" strokeWidth="0.75" strokeOpacity="0.8" />
      <line x1="85" y1="10" x2="85" y2="32" stroke="#00f3ff" strokeWidth="0.75" strokeOpacity="0.8" />
      <text x="22" y="24" fill="#00f3ff" fontFamily="monospace" fontSize="7" fontWeight="bold">SCHEMA_MAP</text>
      <text x="92" y="24" fill="#00f3ff" fontFamily="monospace" fontSize="7" opacity="0.9">DB: {project.dbName}</text>

      <path
        d="M 155 74 L 175 74 L 175 132 L 155 132"
        fill="none"
        stroke="#00f3ff"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <circle cx="155" cy="74" r="2.5" fill="none" stroke="#00f3ff" strokeWidth="1" />
      <circle cx="155" cy="132" r="2.5" fill="none" stroke="#00f3ff" strokeWidth="1" />

      <path
        d="M 195 74 L 175 74 M 195 132 L 175 132"
        fill="none"
        stroke="#00f3ff"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <circle cx="195" cy="74" r="2.5" fill="none" stroke="#00f3ff" strokeWidth="1" />
      <circle cx="195" cy="132" r="2.5" fill="none" stroke="#00f3ff" strokeWidth="1" />

      {tables.map((table, idx) => {
        let x = 15;
        let y = 45 + idx * 58;
        if (idx >= 2) {
          x = 195;
          y = 45 + (idx - 2) * 58;
        }

        return (
          <g key={idx}>
            <rect x={x} y={y} width="140" height="15" fill="rgba(0, 243, 255, 0.08)" stroke="#00f3ff" strokeWidth="1" />
            <text x={x + 5} y={y + 10} fill="#00f3ff" fontFamily="monospace" fontSize="6.5" fontWeight="bold">
              {table.name}
            </text>

            <rect x={x} y={y + 15} width="140" height="28" fill="none" stroke="#00f3ff" strokeWidth="0.75" strokeOpacity="0.6" />

            <text x={x + 5} y={y + 24} fill="#00f3ff" fontFamily="monospace" fontSize="6" opacity="0.8">
              🔑 id: UUID
            </text>
            <text x={x + 5} y={y + 35} fill="#00f3ff" fontFamily="monospace" fontSize="5.5" opacity="0.5">
              * {table.details || 'data_payload'}
            </text>

            <line x1={x - 3} y1={y} x2={x - 3} y2={y + 43} stroke="#00f3ff" strokeWidth="0.5" strokeOpacity="0.4" />
            <line x1={x - 5} y1={y} x2={x - 1} y2={y} stroke="#00f3ff" strokeWidth="0.5" strokeOpacity="0.4" />
            <line x1={x - 5} y1={y + 43} x2={x - 1} y2={y + 43} stroke="#00f3ff" strokeWidth="0.5" strokeOpacity="0.4" />
          </g>
        );
      })}

      <text x="175" y="195" fill="#00f3ff" fontFamily="monospace" fontSize="6" textAnchor="middle" opacity="0.7">
        [SYSTEM_SCHEMA_AUDIT: OK | RELATIONAL_LINKS: ACTIVE]
      </text>
    </svg>
  );
};

interface TerminalPanelProps {
  project: TerminalProject;
  accentColor: string;
  currentIndex: number;
  total: number;
  cmdText: string;
  progress: number;
  progressVisible: boolean;
  logs: { text: string; type: TerminalLog['t']; isBanner?: boolean }[];
  cardVisible: boolean;
  glitching: boolean;
  scanline: boolean;
  bodyRef: React.RefObject<HTMLDivElement | null>;
  onNext: () => void;
  onPrev: () => void;
  onDotClick: (i: number) => void;
  crtEnabled: boolean;
  setCrtEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
  flickerActive: boolean;
  activeTheme: 'project' | 'toxic-radar' | 'vapor-matrix' | 'amber-console' | 'blueprint-arctic';
  setActiveTheme: (theme: 'project' | 'toxic-radar' | 'vapor-matrix' | 'amber-console' | 'blueprint-arctic') => void;
  isBlueprintMode?: boolean;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({
  project,
  accentColor,
  currentIndex,
  total,
  cmdText,
  progress,
  progressVisible,
  logs,
  cardVisible,
  glitching,
  scanline,
  bodyRef,
  onNext,
  onPrev,
  onDotClick,
  crtEnabled,
  setCrtEnabled,
  soundEnabled,
  setSoundEnabled,
  isActive,
  flickerActive,
  activeTheme,
  setActiveTheme,
  isBlueprintMode,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'tech' | 'sysinfo'>('overview');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const formatThemeName = (theme: string) => {
    if (theme === 'project') return 'Auto (Project)';
    if (theme === 'toxic-radar') return 'Toxic Radar';
    if (theme === 'vapor-matrix') return 'Vapor Matrix';
    if (theme === 'amber-console') return 'Amber Console';
    if (theme === 'blueprint-arctic') return 'Blueprint Arctic';
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  useEffect(() => {
    setActiveTab('overview');
    setMobileDrawerOpen(false);
  }, [project.slug]);

  const getThemeColor = () => {
    switch (activeTheme) {
      case 'toxic-radar': return '#00ff41';
      case 'vapor-matrix': return '#ff00c7';
      case 'amber-console': return '#ffb000';
      case 'blueprint-arctic': return '#0088ff';
      case 'project':
      default:
        return accentColor;
    }
  };

  const themeColor = getThemeColor();
  const style = { ['--accent' as string]: themeColor };

  return (
    <div className={`terminal-window cyber-light-border ${crtEnabled ? 'crt-active' : ''}`} style={style}>
      {/* Decorative Hardware Bezels & Details */}
      <div className="terminal-bezel-bracket top-left">[+]</div>
      <div className="terminal-bezel-bracket top-right">[+]</div>
      <div className="terminal-bezel-bracket bottom-left">[+]</div>
      <div className="terminal-bezel-bracket bottom-right">[+]</div>

      <div className="terminal-screw top-left-screw" />
      <div className="terminal-screw top-right-screw" />
      <div className="terminal-screw bottom-left-screw" />
      <div className="terminal-screw bottom-right-screw" />

      <div className="terminal-copper-line-left" />
      <div className="terminal-copper-line-right" />

      <div className={`terminal-scanline ${scanline ? 'is-active' : ''}`} aria-hidden />

      <div className="terminal-titlebar">
        <div className="terminal-dots">
          <span />
          <span />
          <span />
        </div>
        <span className="terminal-titlebar-text">nisarg@portfolio ~ projects</span>

        {isActive && (
          <div className="terminal-controls">
            <div className="terminal-theme-selector" aria-label="Terminal themes">
              <button
                type="button"
                className={`theme-dot is-project ${activeTheme === 'project' ? 'is-active' : ''}`}
                onClick={() => {
                  soundFX.playClick();
                  setActiveTheme('project');
                }}
                title="Auto Dynamic Theme"
              />
              <button
                type="button"
                className={`theme-dot is-toxic-radar ${activeTheme === 'toxic-radar' ? 'is-active' : ''}`}
                onClick={() => {
                  soundFX.playClick();
                  setActiveTheme('toxic-radar');
                }}
                title="Toxic Radar Green"
              />
              <button
                type="button"
                className={`theme-dot is-vapor-matrix ${activeTheme === 'vapor-matrix' ? 'is-active' : ''}`}
                onClick={() => {
                  soundFX.playClick();
                  setActiveTheme('vapor-matrix');
                }}
                title="Vapor Matrix Pink"
              />
              <button
                type="button"
                className={`theme-dot is-amber-console ${activeTheme === 'amber-console' ? 'is-active' : ''}`}
                onClick={() => {
                  soundFX.playClick();
                  setActiveTheme('amber-console');
                }}
                title="Amber Console"
              />
              <button
                type="button"
                className={`theme-dot is-blueprint-arctic ${activeTheme === 'blueprint-arctic' ? 'is-active' : ''}`}
                onClick={() => {
                  soundFX.playClick();
                  setActiveTheme('blueprint-arctic');
                }}
                title="Blueprint Arctic Blue"
              />
            </div>

            <div className="terminal-toggles">
              <button
                type="button"
                className={`terminal-toggle-btn is-preview ${mobileDrawerOpen ? 'is-active' : ''}`}
                onClick={() => {
                  if (!cardVisible) return;
                  soundFX.playClick();
                  setMobileDrawerOpen(!mobileDrawerOpen);
                }}
                style={{ opacity: cardVisible ? 1 : 0.4, cursor: cardVisible ? 'pointer' : 'not-allowed' }}
                title="Toggle Project Preview Mockup"
                disabled={!cardVisible}
              >
                Mockup
              </button>
              <button
                type="button"
                className={`terminal-toggle-btn is-crt ${crtEnabled ? 'is-active' : ''}`}
                onClick={() => {
                  soundFX.playClick();
                  setCrtEnabled(!crtEnabled);
                }}
                title="Toggle CRT Screen Shader"
              >
                CRT
              </button>
              <button
                type="button"
                className={`terminal-toggle-btn is-sound ${soundEnabled ? 'is-active' : ''}`}
                onClick={() => {
                  const nextSound = !soundEnabled;
                  setSoundEnabled(nextSound);
                  soundFX.enabled = nextSound;
                  if (nextSound) {
                    soundFX.playClick();
                  }
                }}
                title={soundEnabled ? "Mute Typewriter Sounds" : "Unmute Typewriter Sounds"}
              >
                {soundEnabled ? '🔊' : '🔇'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="terminal-layout-wrapper">
        <div
          ref={bodyRef}
          className="terminal-body select-text"
        >
          <div className="terminal-cmd-line">
            <span className="prompt">❯</span>
            <span className="cmd-text cmd-text-full">{cmdText}</span>
            <span className="cmd-text cmd-text-mobile">
              {cmdText.length > 0 ? ` deploying ${project.slug}...` : ''}
            </span>
            {isActive && cmdText.length > 0 && cmdText.length < project.cmd.length && (
              <span className="terminal-cursor-blink" style={{ marginLeft: 2 }} />
            )}
          </div>

          {isActive && (
            <div className={`terminal-progress-wrap ${progressVisible ? 'is-visible' : ''}`}>
              <span className="terminal-progress-label">{progress}%</span>
              <div className="terminal-progress-track">
                <div
                  className="terminal-progress-fill"
                  style={{ width: `${progress}%`, background: themeColor }}
                />
              </div>
            </div>
          )}

          {isActive && logs.length > 0 && (
            <div className="terminal-logs">
              {logs.map((log, i) => (
                <div key={i} className={`terminal-log-line log-${log.type} ${log.isBanner ? 'log-banner' : ''}`}>
                  {log.text}
                </div>
              ))}
            </div>
          )}

          <div className={`terminal-project-card ${cardVisible ? 'is-visible' : ''}`}>
            <div className="terminal-card-meta">
              <span className="terminal-card-num">{project.num}</span>
              <span className="terminal-card-category">// {project.category}</span>
            </div>
            <h3 className={`terminal-card-title ${glitching ? 'is-glitching' : ''} ${flickerActive ? 'phosphor-flicker' : ''}`}>
              {project.title}
            </h3>

            {isActive && (
              <div className="terminal-card-tabs-nav">
                <button
                  type="button"
                  className={`terminal-tab-btn ${activeTab === 'overview' ? 'is-active' : ''}`}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab('overview');
                  }}
                >
                  Overview
                </button>
                <button
                  type="button"
                  className={`terminal-tab-btn ${activeTab === 'features' ? 'is-active' : ''}`}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab('features');
                  }}
                >
                  Features
                </button>
                <button
                  type="button"
                  className={`terminal-tab-btn ${activeTab === 'tech' ? 'is-active' : ''}`}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab('tech');
                  }}
                >
                  Tech Stack
                </button>
                <button
                  type="button"
                  className={`terminal-tab-btn ${activeTab === 'sysinfo' ? 'is-active' : ''}`}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab('sysinfo');
                  }}
                >
                  Sys Info
                </button>
              </div>
            )}

            <div className="terminal-card-tab-content">
              {(!isActive || activeTab === 'overview') && (
                <>
                  <p className={`terminal-card-sub ${flickerActive ? 'phosphor-flicker' : ''}`}>{project.sub}</p>
                  <p className={`terminal-card-desc ${flickerActive ? 'phosphor-flicker' : ''}`}>{project.desc}</p>
                </>
              )}
              {isActive && activeTab === 'features' && (
                <ul className="terminal-features-list">
                  {project.features.map((feature, i) => (
                    <li key={i} className="terminal-feature-item">
                      <span className="terminal-feature-bullet">❯</span>
                      <span className="terminal-feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
              {isActive && activeTab === 'tech' && (
                <div className="terminal-card-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="terminal-tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {isActive && activeTab === 'sysinfo' && (
                <div className="terminal-sysinfo-wrap">
                  <pre className="terminal-sysinfo-ascii">
                    {` _  _   ___ 
| \\| | |  _\\
| |\\ | |  _/
|_|\\_| |_|  `}
                  </pre>
                  <div className="terminal-sysinfo-details">
                    <div className="sysinfo-line">
                      <span className="sysinfo-key">OS</span>: <span className="sysinfo-val">NisargOS v1.0</span>
                    </div>
                    <div className="sysinfo-line">
                      <span className="sysinfo-key">Host</span>: <span className="sysinfo-val">Portfolio Terminal</span>
                    </div>
                    <div className="sysinfo-line">
                      <span className="sysinfo-key">Kernel</span>: <span className="sysinfo-val">React 19 / Vite 8</span>
                    </div>
                    <div className="sysinfo-line">
                      <span className="sysinfo-key">Uptime</span>: <span className="sysinfo-val">4+ Years of Code</span>
                    </div>
                    <div className="sysinfo-line">
                      <span className="sysinfo-key">Shell</span>: <span className="sysinfo-val">zsh (Interactive Panel)</span>
                    </div>
                    <div className="sysinfo-line">
                      <span className="sysinfo-key">CPU</span>: <span className="sysinfo-val">Full-Stack (MERN/Next)</span>
                    </div>
                    <div className="sysinfo-line">
                      <span className="sysinfo-key">Theme</span>: <span className="sysinfo-val">{formatThemeName(activeTheme)}</span>
                    </div>
                    <div className="sysinfo-line">
                      <span className="sysinfo-key">Repos</span>: <span className="sysinfo-val">12 Deployed Repos</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isActive && (
            <div className="terminal-cursor-line">
              <span className="prompt">❯</span>
              <span className="terminal-cursor-blink" />
            </div>
          )}
        </div>

        {isActive && (
          <div className={`terminal-preview-drawer ${cardVisible ? 'is-visible' : ''} ${mobileDrawerOpen ? 'mobile-open' : ''}`}>
            <div className="preview-drawer-header">
              <span className="preview-drawer-title">// VISUAL MOCKUP</span>
              <button
                type="button"
                className="preview-drawer-close"
                onClick={() => {
                  soundFX.playClick();
                  setMobileDrawerOpen(false);
                }}
              >
                ×
              </button>
            </div>
            <div className="preview-drawer-content">
              <div className="preview-mockup-frame">
                {isBlueprintMode ? (
                  <BlueprintProjectSchematic project={project} />
                ) : (
                  project.image && (
                    <img
                      src={project.image}
                      alt={`${project.title} Interface Mockup`}
                      className="preview-mockup-img"
                      loading="lazy"
                    />
                  )
                )}
                <div className="preview-mockup-scanlines" />
              </div>

              <div className="preview-db-section">
                <div className="preview-db-badge-wrap">
                  <span className="preview-db-label">Database Layer:</span>
                  <span className="preview-db-badge">{project.dbName}</span>
                </div>
                <ul className="preview-db-checklist">
                  {project.dbChecklist.map((item, idx) => {
                    const parts = item.split(' (');
                    const modelName = parts[0];
                    const details = parts[1] ? ` (${parts[1]}` : '';
                    return (
                      <li key={idx} className="preview-db-item">
                        <span className="preview-db-checkbox">[x]</span>
                        <div className="preview-db-text">
                          <span className="preview-db-model">{modelName}</span>
                          {details && <span className="preview-db-details">{details}</span>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {isActive && (
        <nav className="terminal-nav" style={style}>
          <span className="terminal-status-badge">{project.status}</span>
          <a
            href={project.gh}
            target="_blank"
            rel="noopener noreferrer"
            className="terminal-nav-btn"
          >
            GitHub repo
          </a>
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-nav-btn"
            >
              Live
            </a>
          ) : (
            <button type="button" className="terminal-nav-btn" disabled>
              Live
            </button>
          )}
          <span className="terminal-counter">
            {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <div className="terminal-dots-nav" aria-label="Project navigation">
            {PROJECTS_TERMINAL.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`terminal-dot ${i === currentIndex ? 'is-active' : ''}`}
                style={i === currentIndex ? style : undefined}
                onClick={() => {
                  soundFX.playClick();
                  onDotClick(i);
                }}
                aria-label={`Project ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="terminal-nav-btn is-accent"
            onClick={onPrev}
            disabled={currentIndex === 0}
            aria-label="Previous project"
          >
            prev()
          </button>
          <button
            type="button"
            className="terminal-nav-btn is-accent"
            onClick={onNext}
            disabled={currentIndex >= total - 1}
          >
            next_project() →
          </button>
        </nav>
      )}
    </div>
  );
};

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  PROJECTS_TERMINAL,
  ACCENT_COLORS,
  type TerminalLog,
  type TerminalProject,
} from '../data/projectsTerminal';
import { soundFX } from '../utils/terminalAudio';
import './projects-terminal.css';

const CMD_SPEED = 20;
const LOG_SPEED = 8;
const GLITCH_MS = 300;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const logGap = () => sleep(60 + Math.random() * 80);

export const ProjectsSection: React.FC = () => {
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
  const [logs, setLogs] = useState<{ text: string; type: TerminalLog['t'] }[]>([]);
  const [cardVisible, setCardVisible] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [scanline, setScanline] = useState(false);

  const [crtEnabled, setCrtEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    soundFX.enabled = soundEnabled;
  }, [soundEnabled]);

  const project = PROJECTS_TERMINAL[currentIndex];
  const accentColor = ACCENT_COLORS[project.accent];
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
        built.push({ text: '', type: line.t });
        setLogs([...built]);
        for (let i = 0; i <= line.txt.length; i++) {
          if (signalRef.current.cancelled) return;
          built[built.length - 1] = { text: line.txt.slice(0, i), type: line.t };
          setLogs([...built]);
          if (i < line.txt.length) {
            soundFX.playClick();
            await sleep(LOG_SPEED);
          }
        }
        await logGap();
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
    if (initializedRef.current) return;
    initializedRef.current = true;
    goTo(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      id="projects-section"
      ref={sectionRef}
      className="projects-terminal-section"
    >
      <div className="projects-terminal-heading">
        <span>Featured Repositories</span>
        <h2>My Projects.</h2>
      </div>

      <div id="terminal-wrap" className="projects-terminal-sticky">
        <TerminalPanel
          project={project}
          accentColor={accentColor}
          currentIndex={currentIndex}
          total={total}
          cmdText={cmdText}
          progress={progress}
          progressVisible={progressVisible}
          logs={logs}
          cardVisible={cardVisible}
          glitching={glitching}
          scanline={scanline}
          bodyRef={bodyRef}
          onNext={nextProject}
          onPrev={prevProject}
          onDotClick={(i) => goTo(i, true)}
          crtEnabled={crtEnabled}
          setCrtEnabled={setCrtEnabled}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />
      </div>
    </section>
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
  logs: { text: string; type: TerminalLog['t'] }[];
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
}) => {
  const [activeTheme, setActiveTheme] = useState<'project' | 'classic' | 'dracula' | 'amber' | 'cyber' | 'nord'>('project');
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'tech' | 'sysinfo'>('overview');

  const formatThemeName = (theme: string) => {
    if (theme === 'project') return 'Auto (Project)';
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  useEffect(() => {
    setActiveTab('overview');
  }, [project.slug]);

  const getThemeColor = () => {
    switch (activeTheme) {
      case 'classic': return '#00ff41';
      case 'dracula': return '#ff2d78';
      case 'amber': return '#ffb000';
      case 'cyber': return '#f5a623';
      case 'nord': return '#88c0d0';
      case 'project':
      default:
        return accentColor;
    }
  };

  const themeColor = getThemeColor();
  const style = { ['--accent' as string]: themeColor };

  return (
    <div className={`terminal-window ${crtEnabled ? 'crt-active' : ''}`} style={style}>
      <div className={`terminal-scanline ${scanline ? 'is-active' : ''}`} aria-hidden />

      <div className="terminal-titlebar">
        <div className="terminal-dots">
          <span />
          <span />
          <span />
        </div>
        <span className="terminal-titlebar-text">nisarg@portfolio ~ projects</span>

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
              className={`theme-dot is-classic ${activeTheme === 'classic' ? 'is-active' : ''}`}
              onClick={() => {
                soundFX.playClick();
                setActiveTheme('classic');
              }}
              title="Classic Green"
            />
            <button
              type="button"
              className={`theme-dot is-dracula ${activeTheme === 'dracula' ? 'is-active' : ''}`}
              onClick={() => {
                soundFX.playClick();
                setActiveTheme('dracula');
              }}
              title="Dracula Pink"
            />
            <button
              type="button"
              className={`theme-dot is-amber ${activeTheme === 'amber' ? 'is-active' : ''}`}
              onClick={() => {
                soundFX.playClick();
                setActiveTheme('amber');
              }}
              title="Amber CRT"
            />
            <button
              type="button"
              className={`theme-dot is-cyber ${activeTheme === 'cyber' ? 'is-active' : ''}`}
              onClick={() => {
                soundFX.playClick();
                setActiveTheme('cyber');
              }}
              title="Cyber Gold"
            />
            <button
              type="button"
              className={`theme-dot is-nord ${activeTheme === 'nord' ? 'is-active' : ''}`}
              onClick={() => {
                soundFX.playClick();
                setActiveTheme('nord');
              }}
              title="Nord Blue"
            />
          </div>

          <div className="terminal-toggles">
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
      </div>

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
          {cmdText.length > 0 && cmdText.length < project.cmd.length && (
            <span className="terminal-cursor-blink" style={{ marginLeft: 2 }} />
          )}
        </div>

        <div className={`terminal-progress-wrap ${progressVisible ? 'is-visible' : ''}`}>
          <span className="terminal-progress-label">{progress}%</span>
          <div className="terminal-progress-track">
            <div
              className="terminal-progress-fill"
              style={{ width: `${progress}%`, background: themeColor }}
            />
          </div>
        </div>

        <div className="terminal-logs">
          {logs.map((log, i) => (
            <div key={i} className={`terminal-log-line log-${log.type}`}>
              {log.text}
            </div>
          ))}
        </div>

        <div className={`terminal-project-card ${cardVisible ? 'is-visible' : ''}`}>
          <div className="terminal-card-meta">
            <span className="terminal-card-num">{project.num}</span>
            <span className="terminal-card-category">// {project.category}</span>
          </div>
          <h3 className={`terminal-card-title ${glitching ? 'is-glitching' : ''}`}>
            {project.title}
          </h3>

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

          <div className="terminal-card-tab-content">
            {activeTab === 'overview' && (
              <>
                <p className="terminal-card-sub">{project.sub}</p>
                <p className="terminal-card-desc">{project.desc}</p>
              </>
            )}
            {activeTab === 'features' && (
              <ul className="terminal-features-list">
                {project.features.map((feature, i) => (
                  <li key={i} className="terminal-feature-item">
                    <span className="terminal-feature-bullet">❯</span>
                    <span className="terminal-feature-text">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'tech' && (
              <div className="terminal-card-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="terminal-tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {activeTab === 'sysinfo' && (
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

        <div className="terminal-cursor-line">
          <span className="prompt">❯</span>
          <span className="terminal-cursor-blink" />
        </div>
      </div>

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
    </div>
  );
};

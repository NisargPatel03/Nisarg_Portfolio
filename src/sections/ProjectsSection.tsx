import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  PROJECTS_TERMINAL,
  ACCENT_COLORS,
  type TerminalLog,
  type TerminalProject,
} from '../data/projectsTerminal';
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
  const touchStartX = useRef(0);
  const initializedRef = useRef(false);
  const inViewRef = useRef(false);
  const hasDeployedRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cmdText, setCmdText] = useState('');
  const [progress, setProgress] = useState(0);
  const [progressVisible, setProgressVisible] = useState(false);
  const [logs, setLogs] = useState<{ text: string; type: TerminalLog['t'] }[]>([]);
  const [cardVisible, setCardVisible] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [scanline, setScanline] = useState(false);

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
        if (i < text.length) await sleep(speed);
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
          if (i < line.txt.length) await sleep(LOG_SPEED);
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
    if (curRef.current < total - 1) goTo(curRef.current + 1, true);
  }, [goTo, total]);

  const prevProject = useCallback(() => {
    if (curRef.current > 0) goTo(curRef.current - 1, true);
  }, [goTo]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    goTo(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(el);

    const syncScrollIndex = () => {
      if (!inViewRef.current || runningRef.current) return;
      const { top, height } = el.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      if (scrollable <= 0) return;
      const progressScroll = Math.min(Math.max(-top, 0), scrollable) / scrollable;
      const newIdx = Math.min(Math.floor(progressScroll * total), total - 1);
      if (newIdx !== curRef.current) goTo(newIdx, true);
    };

    const onScroll = () => syncScrollIndex();
    window.addEventListener('scroll', onScroll, { passive: true });

    let frame = 0;
    const tick = () => {
      syncScrollIndex();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [goTo, total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) nextProject();
    else prevProject();
  };

  return (
    <section
      id="projects-section"
      ref={sectionRef}
      className="projects-terminal-section"
      style={{ height: `${total * 100}vh` }}
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
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onNext={nextProject}
          onPrev={prevProject}
          onDotClick={(i) => goTo(i, true)}
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
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onNext: () => void;
  onPrev: () => void;
  onDotClick: (i: number) => void;
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
  onTouchStart,
  onTouchEnd,
  onNext,
  onPrev,
  onDotClick,
}) => {
  const style = { ['--accent' as string]: accentColor };

  return (
    <div className="terminal-window" style={style}>
      <div className={`terminal-scanline ${scanline ? 'is-active' : ''}`} aria-hidden />

      <div className="terminal-titlebar">
        <div className="terminal-dots">
          <span />
          <span />
          <span />
        </div>
        <span className="terminal-titlebar-text">nisarg@portfolio ~ projects</span>
      </div>

      <div
        ref={bodyRef}
        className="terminal-body select-text"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
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
              style={{ width: `${progress}%`, background: accentColor }}
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
          <p className="terminal-card-sub">{project.sub}</p>
          <p className="terminal-card-desc">{project.desc}</p>
          <div className="terminal-card-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="terminal-tag-pill">
                {tag}
              </span>
            ))}
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
              onClick={() => onDotClick(i)}
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

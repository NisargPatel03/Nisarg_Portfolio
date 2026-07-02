import React, { useEffect, useState, useRef } from 'react';
import { soundFX } from '../utils/terminalAudio';
import { climateService, type ClimateData } from '../utils/climateService';

interface DiagnosticsHUDProps {
  enabled: boolean;
  isSoundActive: boolean;
  isAmbientActive: boolean;
  isCursorTrailActive: boolean;
  isMatrixActive: boolean;
  activeSection: string;
}

export const DiagnosticsHUD: React.FC<DiagnosticsHUDProps> = ({
  enabled,
  isSoundActive,
  isAmbientActive,
  isCursorTrailActive,
  isMatrixActive,
  activeSection
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [scrollPos, setScrollPos] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);

  const [climate, setClimate] = useState<ClimateData | null>(null);
  const [isManualOverride, setIsManualOverride] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const unsubscribe = climateService.subscribe((data) => {
      setClimate(data);
    });
    return unsubscribe;
  }, [enabled]);

  const handleToggleOverrideMode = () => {
    const nextManual = !isManualOverride;
    setIsManualOverride(nextManual);
    if (!nextManual) {
      climateService.setOverride(null);
    } else if (climate) {
      climateService.setOverride({ ...climate });
    }
  };

  const handleSetWeatherOverride = (type: 'sunny' | 'rainy' | 'snowy') => {
    if (!isManualOverride || !climate) return;
    climateService.setOverride({
      isSunny: type === 'sunny',
      isRainy: type === 'rainy',
      isSnowy: type === 'snowy',
      conditionText: type === 'sunny' ? 'Clear Sky' : type === 'rainy' ? 'Rainy' : 'Snowy',
      weatherCode: type === 'sunny' ? 0 : type === 'rainy' ? 63 : 73,
    });
  };

  const handleToggleStealthOverride = () => {
    if (!isManualOverride || !climate) return;
    climateService.setOverride({
      isNight: !climate.isNight,
    });
  };
  const [velocityDisplay, setVelocityDisplay] = useState(0);
  const [cpuLoad, setCpuLoad] = useState(12);
  const [memStatus, setMemStatus] = useState('OK');

  useEffect(() => {
    if (!enabled) {
      window.dispatchEvent(new CustomEvent('hudStateChange', { detail: { isCollapsed: true } }));
      return;
    }
    const event = new CustomEvent('hudStateChange', { detail: { isCollapsed } });
    window.dispatchEvent(event);
  }, [isCollapsed, enabled]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const velocityRef = useRef(0);
  const scrollYRef = useRef(0);

  // SVG Circle measurements
  const radius = 24;
  const strokeWidth = 3;
  const normalizedRadius = radius - strokeWidth;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (scrollPercent / 100) * circumference;

  // Track scroll position & calculate velocity
  useEffect(() => {
    if (!enabled) return;

    scrollYRef.current = window.scrollY;
    setScrollPos(window.scrollY);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = Math.abs(currentScrollY - scrollYRef.current);
      
      // Update velocity
      velocityRef.current = Math.min(velocityRef.current + diff, 80);
      scrollYRef.current = currentScrollY;

      // Update positions
      setScrollPos(currentScrollY);
      
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollHeight > 0 ? (currentScrollY / scrollHeight) * 100 : 0;
      setScrollPercent(percent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call to align state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled]);

  // Telemetry simulation variables
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      // Simulate CPU Fluctuations
      setCpuLoad((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return Math.max(8, Math.min(next, 28));
      });

      // Random memory status recalculation
      if (Math.random() > 0.94) {
        setMemStatus('SWAP');
        setTimeout(() => setMemStatus('OK'), 600);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [enabled]);

  // Oscilloscope canvas animation loop
  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;
    const bufferLength = 128;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth decay of velocity
      velocityRef.current *= 0.93; 
      if (velocityRef.current < 0.05) velocityRef.current = 0;
      
      const v = velocityRef.current;
      setVelocityDisplay(Math.round(v));

      // Oscilloscope dynamics based on scroll speed
      const amplitude = 3 + Math.min(v * 0.45, 16);
      const frequency = 0.04 + Math.min(v * 0.003, 0.1);
      const speed = 0.06 + Math.min(v * 0.015, 0.35);

      phase += speed;

      // Draw horizontal baseline center grid line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Check if real audio is active
      let isAudioActive = false;
      if (isSoundActive || isAmbientActive) {
        soundFX.getAnalyserData(dataArray);
        let totalDeviation = 0;
        for (let i = 0; i < bufferLength; i++) {
          totalDeviation += Math.abs(dataArray[i] - 128);
        }
        if (totalDeviation > 1.5) {
          isAudioActive = true;
        }
      }

      // Draw glowing oscilloscope wave
      ctx.beginPath();
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#00ff41';
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 4;
      ctx.shadowColor = accentColor;

      for (let x = 0; x < canvas.width; x++) {
        if (isAudioActive) {
          // Map x coordinate to indices in dataArray
          const dataIndex = Math.floor((x / canvas.width) * bufferLength);
          const normalizedVal = (dataArray[dataIndex] - 128) / 128.0; // range -1.0 to 1.0
          // Center baseline, apply 1.35x visual gain amplification for responsiveness
          const y = canvas.height / 2 + normalizedVal * (canvas.height / 2) * 1.35;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        } else {
          // Fallback simulated sine wave superpositions (idle/scroll dynamics)
          const y = canvas.height / 2 + 
            Math.sin(x * frequency + phase) * amplitude + 
            Math.sin(x * frequency * 2.1 - phase * 1.3) * (amplitude * 0.25);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
      
      // Reset shadows for next drawings
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div 
      className={`diagnostics-hud-container fixed hud-grid-bg hud-corner-brackets cyber-glass-bezel cyber-light-border ${isCollapsed ? 'is-collapsed' : ''}`}
      aria-label="Real-Time Telemetry HUD"
    >
      {/* Collapse Tab */}
      <button 
        type="button"
        className="hud-toggle-tab"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand Diagnostics HUD" : "Collapse Diagnostics HUD"}
        aria-expanded={!isCollapsed}
      >
        {isCollapsed ? '◀' : '▶'}
      </button>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] tracking-wider text-[#D7E2EA]/40">
        <span>DIAGNOSTICS_HUD</span>
        <span className="animate-pulse text-red-500 font-bold">● REC</span>
      </div>

      {/* Scrollable content wrapper */}
      <div className="hud-scroll-content">
        {/* 1. Scroll Progress Gauge */}
        <div className="hud-panel-card flex items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-white/[0.04]"
                strokeWidth={strokeWidth}
                stroke="currentColor"
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                style={{
                  stroke: 'var(--accent-color, #00ff41)',
                  strokeDasharray: `${circumference} ${circumference}`,
                  strokeDashoffset,
                  transition: 'stroke-dashoffset 0.1s ease-out'
                }}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <span className="absolute text-[9px] font-bold text-white/90">
              {Math.round(scrollPercent)}%
            </span>
          </div>
          <div className="flex flex-col gap-1 text-[10px]">
            <span className="text-[#D7E2EA]/50 uppercase tracking-widest text-[8px]">Index Scroll</span>
            <span className="text-white/80 font-bold">PAGE_OFFSET</span>
          </div>
        </div>

        {/* 2. Scroll Stats Readout */}
        <div className="hud-panel-card flex flex-col gap-2 text-[10px]">
          <div className="flex justify-between">
            <span className="text-[#D7E2EA]/40">POS:</span>
            <span className="text-white/85 font-mono">{String(scrollPos).padStart(5, '0')}px</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#D7E2EA]/40">SECT:</span>
            <span className="text-[var(--accent-color,#00ff41)] font-bold tracking-wider">{activeSection}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#D7E2EA]/40">VELOCITY:</span>
            <span className="text-white/85">{velocityDisplay}px/f</span>
          </div>
        </div>

        {/* 3. Oscilloscope Sparkline */}
        <div className="hud-panel-card flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[8px] tracking-widest text-[#D7E2EA]/40 uppercase">
            <span>Waveform Telemetry</span>
            <span className={velocityDisplay > 0 ? 'text-[var(--accent-color,#00ff41)]' : 'text-[#D7E2EA]/30'}>
              {velocityDisplay > 0 ? 'ACTIVE_SCROLL' : 'SIGNAL_IDLE'}
            </span>
          </div>
          <div className="bg-black/50 border border-white/5 rounded-md overflow-hidden">
            <canvas ref={canvasRef} width={206} height={44} className="block w-full h-[44px]" />
          </div>
        </div>

        {/* 4. Animated Telemetry Logs */}
        <div className="hud-panel-card flex flex-col gap-1.5 text-[9px] font-mono leading-relaxed">
          <div className="text-[8px] text-[#D7E2EA]/40 tracking-wider uppercase mb-1">
            System telemetry logs
          </div>
          <div className="flex justify-between border-b border-white/[0.02] pb-1">
            <span className="text-[#D7E2EA]/40">CPU_LOAD:</span>
            <span className="text-white/80">{cpuLoad}%</span>
          </div>
          <div className="flex justify-between border-b border-white/[0.02] pb-1">
            <span className="text-[#D7E2EA]/40">MEM_ALLOC:</span>
            <span className={memStatus === 'OK' ? 'text-[var(--accent-color,#00ff41)]' : 'text-amber-400'}>
              {memStatus}
            </span>
          </div>
          <div className="flex justify-between border-b border-white/[0.02] pb-1">
            <span className="text-[#D7E2EA]/40">AUDIO_SYS:</span>
            <span className={isSoundActive ? 'text-[var(--accent-color,#00ff41)]' : 'text-[#D7E2EA]/30'}>
              {isSoundActive ? 'LOOP_ON' : 'MUTED'}
            </span>
          </div>
          <div className="flex justify-between border-b border-white/[0.02] pb-1">
            <span className="text-[#D7E2EA]/40">SOUNDTRACK:</span>
            <span className={isAmbientActive ? 'text-[var(--accent-color,#00ff41)]' : 'text-[#D7E2EA]/30'}>
              {isAmbientActive ? 'PLAYING' : 'IDLE'}
            </span>
          </div>
          <div className="flex justify-between border-b border-white/[0.02] pb-1">
            <span className="text-[#D7E2EA]/40">POINTER_TR:</span>
            <span className={isCursorTrailActive ? 'text-[var(--accent-color,#00ff41)]' : 'text-[#D7E2EA]/30'}>
              {isCursorTrailActive ? 'CONNECTED' : 'DISCONN'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#D7E2EA]/40">MATRIX_DECK:</span>
            <span className={isMatrixActive ? 'text-pink-500 font-bold' : 'text-[#D7E2EA]/30'}>
              {isMatrixActive ? 'OVERRIDE' : 'INACTIVE'}
            </span>
          </div>
        </div>

        {/* 5. Atmosphere Sync & Overrides */}
        <div className="hud-panel-card flex flex-col gap-2 text-[9px] font-mono leading-relaxed border-t border-white/5 pt-2">
          <div className="flex items-center justify-between text-[8px] text-[#D7E2EA]/40 tracking-wider uppercase mb-1">
            <span>Atmosphere telemetry</span>
            <button 
              type="button"
              onClick={handleToggleOverrideMode}
              className={`px-1.5 py-0.5 rounded text-[8px] font-bold transition-all border ${
                isManualOverride 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                  : 'bg-white/5 text-[#D7E2EA]/40 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {isManualOverride ? 'MANUAL' : 'AUTO_SYNC'}
            </button>
          </div>

          {climate && (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between border-b border-white/[0.02] pb-0.5">
                <span className="text-[#D7E2EA]/40">LOC:</span>
                <span className="text-white/80 max-w-[120px] truncate" title={climate.locationName}>
                  {climate.locationName}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/[0.02] pb-0.5">
                <span className="text-[#D7E2EA]/40">TEMP / COND:</span>
                <span className="text-white/80">
                  {climate.temperature.toFixed(1)}°C / {climate.conditionText}
                </span>
              </div>
              
              {isManualOverride ? (
                <div className="flex flex-col gap-1.5 mt-1 pt-1 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400/70 text-[8px]">SYS_FORCE:</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleSetWeatherOverride('sunny')}
                        className={`px-1 py-0.5 rounded text-[8px] ${
                          climate.isSunny 
                            ? 'bg-[var(--accent-color,#00ff41)]/20 text-[var(--accent-color,#00ff41)] font-bold' 
                            : 'bg-white/5 text-white/50 hover:bg-white/10'
                        }`}
                      >
                        SUN
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetWeatherOverride('rainy')}
                        className={`px-1 py-0.5 rounded text-[8px] ${
                          climate.isRainy 
                            ? 'bg-cyan-500/20 text-cyan-400 font-bold' 
                            : 'bg-white/5 text-white/50 hover:bg-white/10'
                        }`}
                      >
                        RAIN
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetWeatherOverride('snowy')}
                        className={`px-1 py-0.5 rounded text-[8px] ${
                          climate.isSnowy 
                            ? 'bg-blue-400/20 text-blue-300 font-bold' 
                            : 'bg-white/5 text-white/50 hover:bg-white/10'
                        }`}
                      >
                        SNOW
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-amber-400/70 text-[8px]">STEALTH_MODE:</span>
                    <button
                      type="button"
                      onClick={handleToggleStealthOverride}
                      className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                        climate.isNight 
                          ? 'bg-indigo-500/25 text-indigo-400 border border-indigo-500/40' 
                          : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      {climate.isNight ? 'ACTIVE_NIGHT' : 'OFF_DAYLIGHT'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-[#D7E2EA]/40">STEALTH_RADAR:</span>
                  <span className={climate.isNight ? 'text-indigo-400 font-bold' : 'text-[#D7E2EA]/30'}>
                    {climate.isNight ? 'STEALTH_ON' : 'DEACTIVATED'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hidden Sonar Telemetry log */}
        <div className="text-center mt-1 pt-1 pointer-events-none">
          <p className="sonar-target text-[8px] font-mono tracking-widest uppercase">
            [ STATS_DECRYPT: "Caffeine: nominal. Sleep: suboptimal." ]
          </p>
        </div>
      </div>
    </div>
  );
};

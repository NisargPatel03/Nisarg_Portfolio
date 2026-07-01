import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundFX } from '../utils/terminalAudio';

interface BiometricAuthScreenProps {
  onBypass: () => void;
  onUnlock: () => void;
}

const OUTER_LABELS = ["E2", "7B", "C9", "A5", "0F", "88", "9C", "D4"];
const MIDDLE_LABELS = ["1010", "0111", "1100", "0011", "1001", "0110", "1111", "0000"];
const INNER_LABELS = ["N", "I", "S", "A", "R", "G", "0", "3"];

export const BiometricAuthScreen: React.FC<BiometricAuthScreenProps> = ({
  onBypass,
  onUnlock,
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isSweeping, setIsSweeping] = useState(false);
  
  // Scrambled angles (offset by at least 45 deg + small random fraction to prevent initial alignment)
  const [outerAngle, setOuterAngle] = useState(() => Math.floor(Math.random() * 6 + 1) * 45 + 15);
  const [middleAngle, setMiddleAngle] = useState(() => Math.floor(Math.random() * 6 + 1) * 45 + 25);
  const [innerAngle, setInnerAngle] = useState(() => Math.floor(Math.random() * 6 + 1) * 45 + 35);

  const [outerLocked, setOuterLocked] = useState(false);
  const [middleLocked, setMiddleLocked] = useState(false);
  const [innerLocked, setInnerLocked] = useState(false);

  const [sysSpecs, setSysSpecs] = useState({
    ip: '192.168.1.72',
    res: '1920x1080',
    browser: 'Chrome/WebKit Engine',
  });

  // Retrieve user specifications on boot
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    let browserName = 'Generic Engine';
    const ua = navigator.userAgent;
    if (ua.indexOf('Firefox') > -1) browserName = 'Firefox Quantum';
    else if (ua.indexOf('Chrome') > -1) browserName = 'Chrome V8 Engine';
    else if (ua.indexOf('Safari') > -1) browserName = 'Safari WebKit';
    
    const randomIP = `192.168.1.${Math.floor(Math.random() * 240) + 10}`;

    setSysSpecs({
      ip: randomIP,
      res: `${w}x${h}`,
      browser: browserName,
    });
  }, []);

  // Print system logs
  useEffect(() => {
    const logSequence = [
      'INITIALIZING CRYPTO-DECRYPTION INTERFACE...',
      'LOADING CYBERNETIC ASTROLABE MODULES... OK',
      `RESOLVING LOCAL SUBNET ROUTE... ADDR: ${sysSpecs.ip}`,
      `CALIBRATING RINGS TO ANGLE METRICS... RESOLUTION: ${sysSpecs.res}`,
      'WARNING: ACCESS IS RESTRICTED TO AUTHORIZED RECRUITERS',
      'ALIGN ALL ROTORS TO NORTH (0° / 360°) TO DECRYPT THE DECK PORTFOLIO.'
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < logSequence.length) {
        setLogs((prev) => [...prev, logSequence[currentIdx]]);
        currentIdx++;
        soundFX.playClick();
      } else {
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [sysSpecs]);

  // Handle snapping locks
  useEffect(() => {
    if (!outerLocked && (outerAngle < 6 || outerAngle > 354)) {
      setOuterAngle(0);
      setOuterLocked(true);
      soundFX.playClick();
      setLogs((prev) => [...prev, 'CRITICAL: OUTER ROTOR SECURED [0x0F]']);
    }
  }, [outerAngle, outerLocked]);

  useEffect(() => {
    if (!middleLocked && (middleAngle < 6 || middleAngle > 354)) {
      setMiddleAngle(0);
      setMiddleLocked(true);
      soundFX.playClick();
      setLogs((prev) => [...prev, 'CRITICAL: MIDDLE ROTOR SECURED [0b1010]']);
    }
  }, [middleAngle, middleLocked]);

  useEffect(() => {
    if (!innerLocked && (innerAngle < 6 || innerAngle > 354)) {
      setInnerAngle(0);
      setInnerLocked(true);
      soundFX.playClick();
      setLogs((prev) => [...prev, 'CRITICAL: INNER ROTOR SECURED [KEY_N]']);
    }
  }, [innerAngle, innerLocked]);

  // Check solve state
  useEffect(() => {
    if (outerLocked && middleLocked && innerLocked && !isUnlocked) {
      setIsUnlocked(true);
      setIsSweeping(true);
      setLogs((prev) => [
        ...prev,
        'SYSTEM LOG: CRYPTOGRAPHIC ALIGNMENT REACHED.',
        'ENGAGING GREEN DECRYPTION LASER SWEEP...',
        'PASSPHRASE VERIFIED: SYSTEM ACCESS GRANTED.'
      ]);

      setTimeout(() => {
        soundFX.playSuccess();
      }, 400);

      setTimeout(() => {
        setIsExploding(true);
      }, 1000);

      setTimeout(() => {
        onUnlock();
      }, 2400);
    }
  }, [outerLocked, middleLocked, innerLocked, isUnlocked]);

  // Drag-rotation handler using native pointer events
  const handlePointerDown = (ring: 'outer' | 'middle' | 'inner', e: React.PointerEvent<SVGElement>) => {
    if (isUnlocked) return;
    if (ring === 'outer' && outerLocked) return;
    if (ring === 'middle' && middleLocked) return;
    if (ring === 'inner' && innerLocked) return;

    e.preventDefault();
    const svgEl = e.currentTarget.closest('svg');
    if (!svgEl) return;

    const rect = svgEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const startRad = Math.atan2(dy, dx);
    const startDeg = (startRad * 180) / Math.PI;

    const initialAngle = ring === 'outer' ? outerAngle : ring === 'middle' ? middleAngle : innerAngle;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const curDx = moveEvent.clientX - centerX;
      const curDy = moveEvent.clientY - centerY;
      const curRad = Math.atan2(curDy, curDx);
      const curDeg = (curRad * 180) / Math.PI;

      const delta = curDeg - startDeg;
      let newAngle = (initialAngle + delta) % 360;
      if (newAngle < 0) newAngle += 360;

      if (ring === 'outer') setOuterAngle(newAngle);
      else if (ring === 'middle') setMiddleAngle(newAngle);
      else if (ring === 'inner') setInnerAngle(newAngle);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleBypassClick = () => {
    soundFX.playClick();
    onBypass();
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      data-lenis-prevent
      className="fixed inset-0 z-[9999] transition-all duration-500 font-mono overflow-y-auto bg-scanlines select-none bg-[#030603] text-[#00ff41]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff41_1px,transparent_1px),linear-gradient(to_bottom,#00ff41_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.9)_100%)] z-0 pointer-events-none" />

      {isExploding && (
        <div className="fixed inset-0 bg-[#000]/95 z-[10000] flex flex-col justify-center items-center text-center">
          <div className="text-[#00ff41] text-3xl md:text-5xl font-extrabold tracking-widest mb-4 animate-pulse uppercase font-orbitron font-interlaced">
            ⚡ Decryption Complete ⚡
          </div>
          <div className="text-xs md:text-sm text-[#00ff41]/60 max-w-md px-4 leading-relaxed uppercase font-share-mono">
            Security lock bypassed. Synchronizing network nodes and opening NISARG portfolio terminal...
          </div>
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-black to-black" />
        </div>
      )}

      <div className="min-h-full w-full flex flex-col items-center justify-center p-4 md:p-6 z-10 relative">
        <div className="w-full max-w-lg border rounded-2xl p-5 md:p-6 bg-black/45 backdrop-blur-md relative flex flex-col gap-4 md:gap-5 border-[#00ff41]/20 shadow-[0_0_40px_rgba(0,255,65,0.08)] cyber-glass-bezel">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3 text-[10px] tracking-wider font-orbitron border-[#00ff41]/20 text-[#00ff41]/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse bg-emerald-500" />
              <span className="font-glow">ASTROLABE_CIPHER_SHIELD</span>
            </div>
            <span className="font-glow">STATUS: {isUnlocked ? 'DECRYPTED' : 'RESTRICTED'}</span>
          </div>

          {/* Concentric Cipher Wheels */}
          <div className="relative flex justify-center py-4 bg-black/25 border border-white/5 rounded-xl overflow-hidden">
            
            {/* Decryption Laser Sweep Overlay */}
            {isSweeping && (
              <motion.div
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
                className="absolute left-0 right-0 h-0.5 bg-[#00ff41] shadow-[0_0_12px_#00ff41] z-20 pointer-events-none"
              />
            )}

            <svg
              width="320"
              height="320"
              viewBox="0 0 320 320"
              className="overflow-visible"
            >
              <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(0, 255, 65, 0.15)" />
                  <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                </radialGradient>
              </defs>

              {/* Central backing glow */}
              <circle cx="160" cy="160" r="140" fill="url(#glow)" />

              {/* Decorative Outer Rings */}
              <circle cx="160" cy="160" r="145" stroke="rgba(0, 255, 65, 0.08)" strokeWidth="1" fill="none" />
              <circle cx="160" cy="160" r="130" stroke="rgba(0, 255, 65, 0.05)" strokeWidth="1.5" strokeDasharray="2 6" fill="none" />

              {/* North Align Guide Bracket */}
              <path d="M 160 8 L 160 22" stroke="rgba(0, 255, 65, 0.3)" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M 152 14 L 160 22 L 168 14" stroke="#00ff41" strokeWidth="2" fill="none" />

              {/* OUTER ROTOR */}
              <g
                transform={`rotate(${outerAngle}, 160, 160)`}
                onPointerDown={(e) => handlePointerDown('outer', e)}
                className={`cursor-grab active:cursor-grabbing transition-opacity duration-300 ${outerLocked ? 'opacity-90' : 'hover:opacity-100'}`}
              >
                {/* Invisible wide hit area for easy grabbing */}
                <circle
                  cx="160"
                  cy="160"
                  r="110"
                  stroke="transparent"
                  strokeWidth="24"
                  fill="none"
                  pointerEvents="stroke"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="110"
                  stroke={outerLocked ? "#00ff41" : "rgba(0, 255, 65, 0.25)"}
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 8"
                />
                {OUTER_LABELS.map((label, i) => {
                  const angle = (270 + i * 45) * Math.PI / 180;
                  const lx = 160 + 110 * Math.cos(angle);
                  const ly = 160 + 110 * Math.sin(angle);
                  return (
                    <text
                      key={i}
                      x={lx}
                      y={ly}
                      fill={outerLocked ? "#00ff41" : "rgba(0, 255, 65, 0.6)"}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-bold select-none transition-colors"
                    >
                      {label}
                    </text>
                  );
                })}
              </g>

              {/* MIDDLE ROTOR */}
              <g
                transform={`rotate(${middleAngle}, 160, 160)`}
                onPointerDown={(e) => handlePointerDown('middle', e)}
                className={`cursor-grab active:cursor-grabbing transition-opacity duration-300 ${middleLocked ? 'opacity-90' : 'hover:opacity-100'}`}
              >
                {/* Invisible wide hit area for easy grabbing */}
                <circle
                  cx="160"
                  cy="160"
                  r="80"
                  stroke="transparent"
                  strokeWidth="24"
                  fill="none"
                  pointerEvents="stroke"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="80"
                  stroke={middleLocked ? "#00ff41" : "rgba(0, 255, 65, 0.25)"}
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="2 6"
                />
                {MIDDLE_LABELS.map((label, i) => {
                  const angle = (270 + i * 45) * Math.PI / 180;
                  const lx = 160 + 80 * Math.cos(angle);
                  const ly = 160 + 80 * Math.sin(angle);
                  return (
                    <text
                      key={i}
                      x={lx}
                      y={ly}
                      fill={middleLocked ? "#00ff41" : "rgba(0, 255, 65, 0.65)"}
                      fontSize="8"
                      fontFamily="monospace"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-bold select-none transition-colors"
                    >
                      {label}
                    </text>
                  );
                })}
              </g>

              {/* INNER ROTOR */}
              <g
                transform={`rotate(${innerAngle}, 160, 160)`}
                onPointerDown={(e) => handlePointerDown('inner', e)}
                className={`cursor-grab active:cursor-grabbing transition-opacity duration-300 ${innerLocked ? 'opacity-90' : 'hover:opacity-100'}`}
              >
                {/* Invisible wide hit area for easy grabbing */}
                <circle
                  cx="160"
                  cy="160"
                  r="50"
                  stroke="transparent"
                  strokeWidth="24"
                  fill="none"
                  pointerEvents="stroke"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="50"
                  stroke={innerLocked ? "#00ff41" : "rgba(0, 255, 65, 0.25)"}
                  strokeWidth="1.5"
                  fill="none"
                />
                {INNER_LABELS.map((label, i) => {
                  const angle = (270 + i * 45) * Math.PI / 180;
                  const lx = 160 + 50 * Math.cos(angle);
                  const ly = 160 + 50 * Math.sin(angle);
                  return (
                    <text
                      key={i}
                      x={lx}
                      y={ly}
                      fill={innerLocked ? "#00ff41" : "rgba(0, 255, 65, 0.7)"}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-bold select-none transition-colors"
                    >
                      {label}
                    </text>
                  );
                })}
              </g>

              {/* Center Lock core */}
              <circle
                cx="160"
                cy="160"
                r="22"
                fill="#030603"
                stroke={outerLocked && middleLocked && innerLocked ? "#00ff41" : "rgba(0, 255, 65, 0.3)"}
                strokeWidth="2"
              />
              {/* Pulsing Lock Icon in Center */}
              <circle
                cx="160"
                cy="160"
                r="6"
                fill={outerLocked && middleLocked && innerLocked ? "#00ff41" : "rgba(0, 255, 65, 0.1)"}
                className={outerLocked && middleLocked && innerLocked ? "animate-pulse" : ""}
              />
            </svg>
          </div>

          {/* Terminal log logs output */}
          <div
            data-lenis-prevent
            className="border rounded-xl p-4 text-[11px] leading-relaxed flex flex-col gap-1.5 h-28 md:h-36 overflow-y-auto backdrop-blur-md transition-all duration-500 bg-black/30 border-[#00ff41]/15 text-[#00ff41]/85 cyber-glass-card"
          >
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-[#00ff41]/40">❯</span>
                <span>{log}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center text-[10px] uppercase px-1 text-[#00ff41]/60">
            <span>Rotor Calibration: Active</span>
            <button
              type="button"
              onClick={handleBypassClick}
              disabled={isUnlocked}
              className="font-bold border px-3 py-1.5 rounded-lg active:scale-95 transition-all tracking-widest border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/10"
            >
              [ Bypass scan ]
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

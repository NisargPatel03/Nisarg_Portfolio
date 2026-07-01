import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { soundFX } from '../utils/terminalAudio';

interface BiometricAuthScreenProps {
  onBypass: () => void;
  onUnlock: () => void;
}

export const BiometricAuthScreen: React.FC<BiometricAuthScreenProps> = ({
  onBypass,
  onUnlock,
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [code, setCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLockedDown, setIsLockedDown] = useState(false);
  const [lockdownSeconds, setLockdownSeconds] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [sysSpecs, setSysSpecs] = useState({
    ip: '192.168.1.72',
    res: '1920x1080',
    browser: 'Chrome/WebKit Engine',
  });
  
  const inputRef = useRef<HTMLInputElement | null>(null);

  const makeCirclePath = (cx: number, cy: number, r: number) => {
    const k = r * 0.5522847;
    return `M ${cx} ${cy + r} c ${k.toFixed(2)} 0 ${r} ${(-r + k).toFixed(2)} ${r} ${-r} s ${(-r + k).toFixed(2)} ${-r} ${-r} ${-r} s ${-r} ${(r - k).toFixed(2)} ${-r} ${r} s ${(r - k).toFixed(2)} ${r} ${r} ${r} z`;
  };

  const FP_1 = makeCirclePath(10.5, 11.2, 2.2);
  const FP_2 = makeCirclePath(11.2, 10.5, 4.5);
  const FP_3 = makeCirclePath(12.2, 10.2, 7.2);
  const FP_4 = makeCirclePath(12.8, 9.5, 10.5);

  const C_1 = makeCirclePath(12, 10, 3);
  const C_2 = makeCirclePath(12, 10, 6);
  const C_3 = makeCirclePath(12, 10, 9);
  const C_4 = makeCirclePath(12, 10, 12);
  const C_5 = makeCirclePath(12, 10, 15);
  const C_6 = makeCirclePath(12, 10, 18);

  // Synchronized scanner audio clicks on ripple waves
  useEffect(() => {
    if (!isHovered || isUnlocked || isLockedDown) return;
    
    soundFX.playScannerPing();
    
    const interval = setInterval(() => {
      soundFX.playScannerPing();
    }, 1600);
    
    return () => clearInterval(interval);
  }, [isHovered, isUnlocked, isLockedDown]);

  // Retrieve user specifications on boot
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    // Simple browser detection
    let browserName = 'Generic Engine';
    const ua = navigator.userAgent;
    if (ua.indexOf('Firefox') > -1) browserName = 'Firefox Quantum';
    else if (ua.indexOf('Chrome') > -1) browserName = 'Chrome V8 Engine';
    else if (ua.indexOf('Safari') > -1) browserName = 'Safari WebKit';
    
    // Randomized local IP suffix
    const randomIP = `192.168.1.${Math.floor(Math.random() * 240) + 10}`;

    setSysSpecs({
      ip: randomIP,
      res: `${w}x${h}`,
      browser: browserName,
    });
  }, []);

  // Print system logs letter-by-letter / sequentially
  useEffect(() => {
    const logSequence = [
      'INITIALIZING BIOMETRIC SCAN INTERFACE...',
      'BOOTING HARDWARE PROTOCOLS... OK',
      `RESOLVING LOCAL SUBNET ROUTE... ADDR: ${sysSpecs.ip}`,
      `DETECTING GRAPHICS DISPLAY FRAME... RESOLUTION: ${sysSpecs.res}`,
      `VERIFYING BROWSER INSTANCE ENGINE... AGENT: ${sysSpecs.browser}`,
      'WARNING: ACCESS IS CURRENTLY RESTRICTED TO AUTHORIZED RECRUITERS',
      'ENTER ACCESS KEY OR ACTIVATE BYPASS SEQUENCE.'
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < logSequence.length) {
        setLogs((prev) => [...prev, logSequence[currentIdx]]);
        currentIdx++;
        soundFX.playClick();
      } else {
        clearInterval(interval);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }, 450);

    return () => clearInterval(interval);
  }, [sysSpecs]);

  // Timer for lockdown countdown
  useEffect(() => {
    let timer: any;
    if (isLockedDown && lockdownSeconds > 0) {
      timer = setInterval(() => {
        setLockdownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsLockedDown(false);
            setAttempts(0);
            soundFX.stopLockdownAlarm();
            setLogs((prevLogs) => [
              ...prevLogs,
              'SECURITY SHIELD RESET. LOCKDOWN PROTOCOLS LIFTABLE.',
              'READY TO RECEIVE ACCESS KEY CREDENTIALS.'
            ]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLockedDown, lockdownSeconds]);

  // Handle typing inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLockedDown) return;
    const value = e.target.value.toUpperCase();
    setCode(value);
    soundFX.playClick();

    if (value === 'NISARG') {
      setIsUnlocked(true);
      setIsExploding(true);
      setTimeout(() => {
        soundFX.playSuccess();
      }, 200);

      setTimeout(() => {
        onUnlock();
      }, 1500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUnlocked || isLockedDown || !code.trim()) return;

    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'NISARG') {
      setIsUnlocked(true);
      setIsExploding(true);
      setTimeout(() => {
        soundFX.playSuccess();
      }, 200);
      setTimeout(() => {
        onUnlock();
      }, 1500);
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setCode('');
      
      if (nextAttempts >= 3) {
        setIsLockedDown(true);
        setLockdownSeconds(30);
        soundFX.playLockdownAlarm();
        setLogs((prev) => [
          ...prev,
          `[!!] ALARM: INTRUSION ATTEMPT DETECTED (REF: ACCESS_FAILURE)`,
          `[!!] CRITICAL: BIOMETRIC TERMINAL LOCKED FOR 30 SECONDS.`
        ]);
      } else {
        soundFX.playError();
        setLogs((prev) => [
          ...prev,
          `[!] ACCESS DENIED: CODE ERROR. ATTEMPT ${nextAttempts}/3.`
        ]);
      }
    }
  };

  const handleBypassClick = () => {
    if (isLockedDown) return;
    soundFX.playClick();
    onBypass();
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      soundFX.stopLockdownAlarm();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      data-lenis-prevent
      className={`fixed inset-0 z-[9999] transition-all duration-500 font-mono overflow-y-auto bg-scanlines select-none ${
        isLockedDown ? 'bg-[#0c0202] text-red-500' : 'bg-[#030603] text-[#00ff41]'
      }`}
    >
      {/* High tech background layers */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff41_1px,transparent_1px),linear-gradient(to_bottom,#00ff41_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.9)_100%)] z-0 pointer-events-none" />

      {/* Background Matrix Rain Simulation when Authorized */}
      {isExploding && (
        <div className="fixed inset-0 bg-[#000]/95 z-[10000] flex flex-col justify-center items-center text-center">
          <div className="text-[#00ff41] text-3xl md:text-5xl font-extrabold tracking-widest mb-4 animate-pulse uppercase font-orbitron font-interlaced">
            ⚡ Auth Verified ⚡
          </div>
          <div className="text-xs md:text-sm text-[#00ff41]/60 max-w-md px-4 leading-relaxed uppercase font-share-mono">
            System override engaged. Unlocking hidden telemetry streams and diagnostic HUD overlays...
          </div>
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-black to-black" />
        </div>
      )}

      {/* Red ambient warning backlight on lockdown */}
      {isLockedDown && (
        <div className="absolute inset-0 bg-red-950/20 z-0 animate-pulse pointer-events-none" />
      )}

      {/* Scrollable Center Wrapper */}
      <div className="min-h-full w-full flex flex-col items-center justify-center p-4 md:p-6 z-10 relative">
        {/* Frame Container */}
        <div className={`w-full max-w-lg border rounded-2xl p-5 md:p-6 bg-black/45 backdrop-blur-md relative flex flex-col gap-4 md:gap-5 transition-all duration-500 ${
          isLockedDown 
            ? 'border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.15)]' 
            : 'border-[#00ff41]/20 shadow-[0_0_40px_rgba(0,255,65,0.08)] cyber-glass-bezel'
        }`}>
          {/* Terminal Header */}
          <div className={`flex items-center justify-between border-b pb-3 text-[10px] tracking-wider font-orbitron transition-all duration-500 ${
            isLockedDown ? 'border-red-500/20 text-red-500/60' : 'border-[#00ff41]/20 text-[#00ff41]/60'
          }`}>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isLockedDown ? 'bg-red-600' : 'bg-red-500/80'}`} />
              <span className="font-glow">{isLockedDown ? 'SECURITY_BREACH_ALERT' : 'GATEWAY_SECURE_AUTH'}</span>
            </div>
            <span className="font-glow">ACCESS_LEVEL: {isLockedDown ? 'LOCKED_DOWN' : 'RESTRICTED'}</span>
          </div>

          {/* Biometric SVG Scanner */}
          <div className="relative flex justify-center py-2 md:py-4">
            <div 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`w-24 h-24 md:w-28 md:h-28 border rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-500 cursor-pointer ${
                isLockedDown 
                  ? 'border-red-500/40 bg-red-950/10 shadow-[inset_0_0_20px_rgba(239,68,68,0.15)]' 
                  : 'border-[#00ff41]/30 bg-emerald-950/20 shadow-[inset_0_0_20px_rgba(0,255,65,0.1)]'
              }`}
            >
              {/* Pulsing Scanner Rings */}
              <span className={`absolute inset-2 border rounded-full animate-ping ${isLockedDown ? 'border-red-500/20' : 'border-[#00ff41]/20'}`} style={{ animationDuration: '3s' }} />
              <span className={`absolute inset-6 border rounded-full animate-pulse ${isLockedDown ? 'border-red-500/10' : 'border-[#00ff41]/10'}`} />
              
              {/* Fingerprint Vector */}
              <svg 
                className={`w-12 h-12 md:w-14 md:h-14 transition-all ${
                  isLockedDown 
                    ? 'text-red-500' 
                    : isUnlocked 
                      ? 'text-emerald-300 scale-110 shadow-emerald-500' 
                      : 'text-[#00ff41]'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {/* PATH 1 - GLOW */}
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={isHovered ? 2.2 : 1}
                  d={FP_1}
                  animate={isHovered ? {
                    d: [FP_1, C_1, C_2, C_3],
                    opacity: [1, 1, 0.6, 0]
                  } : {
                    d: FP_1,
                    opacity: 1
                  }}
                  transition={isHovered ? {
                    d: { type: "spring", stiffness: 180, damping: 12 },
                    opacity: { duration: 1.6, repeat: Infinity, ease: "easeOut" }
                  } : {
                    d: { type: "spring", stiffness: 180, damping: 12 },
                    opacity: { duration: 0.4 }
                  }}
                  style={{ 
                    filter: "blur(1.5px)",
                    opacity: isHovered ? 0.75 : 0 
                  }}
                />
                {/* PATH 1 - FOREGROUND */}
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={isHovered ? 1.5 : 1}
                  d={FP_1}
                  animate={isHovered ? {
                    d: [FP_1, C_1, C_2, C_3],
                    opacity: [1, 1, 0.6, 0]
                  } : {
                    d: FP_1,
                    opacity: 1
                  }}
                  transition={isHovered ? {
                    d: { type: "spring", stiffness: 180, damping: 12 },
                    opacity: { duration: 1.6, repeat: Infinity, ease: "easeOut" }
                  } : {
                    d: { type: "spring", stiffness: 180, damping: 12 },
                    opacity: { duration: 0.4 }
                  }}
                />

                {/* PATH 2 - GLOW */}
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={isHovered ? 2.2 : 1}
                  d={FP_2}
                  animate={isHovered ? {
                    d: [FP_2, C_2, C_3, C_4],
                    opacity: [1, 1, 0.4, 0]
                  } : {
                    d: FP_2,
                    opacity: 1
                  }}
                  transition={isHovered ? {
                    d: { type: "spring", stiffness: 180, damping: 12 },
                    opacity: { duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.2 }
                  } : {
                    d: { type: "spring", stiffness: 180, damping: 12 },
                    opacity: { duration: 0.4 }
                  }}
                  style={{ 
                    filter: "blur(1.5px)",
                    opacity: isHovered ? 0.75 : 0 
                  }}
                />
                {/* PATH 2 - FOREGROUND */}
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={isHovered ? 1.5 : 1}
                  d={FP_2}
                  animate={isHovered ? {
                    d: [FP_2, C_2, C_3, C_4],
                    opacity: [1, 1, 0.4, 0]
                  } : {
                    d: FP_2,
                    opacity: 1
                  }}
                  transition={isHovered ? {
                    d: { type: "spring", stiffness: 180, damping: 12 },
                    opacity: { duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.2 }
                  } : {
                    d: { type: "spring", stiffness: 180, damping: 12 },
                    opacity: { duration: 0.4 }
                  }}
                />

                {/* PATH 3 - GLOW */}
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={isHovered ? 2.2 : 1}
                  d={FP_3}
                  animate={isHovered ? {
                    d: [FP_3, C_3, C_4, C_5],
                    opacity: [1, 1, 0.2, 0]
                  } : {
                    d: FP_3,
                    opacity: 1
                  }}
                  transition={isHovered ? {
                    d: { type: "spring", stiffness: 180, damping: 12 },
                    opacity: { duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.4 }
                  } : {
                    d: { type: "spring", stiffness: 180, damping: 12 },
                    opacity: { duration: 0.4 }
                  }}
                  style={{ 
                    filter: "blur(1.5px)",
                    opacity: isHovered ? 0.75 : 0 
                  }}
                />
                {/* PATH 3 - FOREGROUND */}
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={isHovered ? 1.5 : 1}
                  d={FP_3}
                  animate={isHovered ? {
                    d: [FP_3, C_3, C_4, C_5],
                    opacity: [1, 1, 0.2, 0]
                  } : {
                    d: FP_3,
                    opacity: 1
                  }}
                  transition={isHovered ? {
                    d: { type: "spring", stiffness: 180, damping: 12 },
                    opacity: { duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.4 }
                  } : {
                    d: { type: "spring", stiffness: 180, damping: 12 },
                    opacity: { duration: 0.4 }
                  }}
                />

                {/* PATH 4 - GLOW */}
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={isHovered ? 2.2 : 1}
                  d={FP_4}
                  animate={isHovered ? {
                    d: [FP_4, C_4, C_5, C_6],
                    opacity: [1, 1, 0.1, 0]
                  } : {
                    d: FP_4,
                    opacity: 1
                  }}
                  transition={isHovered ? {
                    d: { type: "spring", stiffness: 180, damping: 12 },
                    opacity: { duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.6 }
                  } : {
                    d: { type: "spring", stiffness: 180, damping: 12 },
                    opacity: { duration: 0.4 }
                  }}
                  style={{ 
                    filter: "blur(1.5px)",
                    opacity: isHovered ? 0.75 : 0 
                  }}
                />
                {/* PATH 4 - FOREGROUND */}
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={isHovered ? 1.5 : 1}
                  d={FP_4}
                  animate={isHovered ? {
                    d: [FP_4, C_4, C_5, C_6],
                    opacity: [1, 1, 0.1, 0]
                  } : {
                    d: FP_4,
                    opacity: 1
                  }}
                  transition={isHovered ? {
                    d: { type: "spring", stiffness: 180, damping: 12 },
                    opacity: { duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.6 }
                  } : {
                    d: { type: "spring", stiffness: 180, damping: 12 },
                    opacity: { duration: 0.4 }
                  }}
                />
              </svg>

              {/* Glowing Laser Scan Bar */}
              <div className={`absolute left-0 right-0 h-0.5 animate-bounce ${
                isLockedDown ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-[#00ff41] shadow-[0_0_8px_#00ff41]'
              }`} style={{ animationDuration: '4s' }} />
            </div>
          </div>

          {/* Live Diagnostics Log output */}
          <div 
            data-lenis-prevent
            className={`border rounded-xl p-4 text-[11px] leading-relaxed flex flex-col gap-1.5 h-28 md:h-36 overflow-y-auto backdrop-blur-md transition-all duration-500 ${
              isLockedDown 
                ? 'bg-red-950/10 border-red-500/25 text-red-500/85' 
                : 'bg-black/30 border-[#00ff41]/15 text-[#00ff41]/85 cyber-glass-card'
            }`}
          >
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className={isLockedDown ? 'text-red-500/40' : 'text-[#00ff41]/40'}>❯</span>
                <span>{log}</span>
              </div>
            ))}
          </div>

          {/* Console Input and Actions */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 backdrop-blur-md transition-all duration-500 ${
              isLockedDown 
                ? 'bg-red-950/10 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.06)]' 
                : 'bg-black/30 border-[#00ff41]/30 shadow-[0_0_15px_rgba(0,255,65,0.04)] cyber-glass-card'
            }`}>
              <span className={`font-bold select-none animate-pulse ${isLockedDown ? 'text-red-500/50' : 'text-[#00ff41]/50'}`}>❯</span>
              <input
                ref={inputRef}
                type="text"
                placeholder={isLockedDown ? `[ SYSTEM LOCKOUT: ${lockdownSeconds}s ]` : "ENTER SYSTEM DECK PASSPHRASE..."}
                value={code}
                onChange={handleInputChange}
                disabled={isUnlocked || isLockedDown}
                className={`flex-grow bg-transparent border-none outline-none tracking-wider text-xs uppercase transition-colors ${
                  isLockedDown ? 'text-red-500 placeholder-red-500/35' : 'text-[#00ff41] placeholder-[#00ff41]/35'
                }`}
              />
            </div>

            <div className={`flex justify-between items-center text-[10px] uppercase px-1 transition-all duration-500 ${
              isLockedDown ? 'text-red-500/60' : 'text-[#00ff41]/60'
            }`}>
              <span>CodeHint: Owner's First Name</span>
              <button
                type="button"
                onClick={handleBypassClick}
                disabled={isUnlocked || isLockedDown}
                className={`font-bold border px-3 py-1.5 rounded-lg active:scale-95 transition-all tracking-widest ${
                  isLockedDown 
                    ? 'border-red-500/20 text-red-500/40 cursor-not-allowed' 
                    : 'border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/10'
                }`}
              >
                [ Bypass scan ]
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

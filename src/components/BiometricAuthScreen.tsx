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
  const [sysSpecs, setSysSpecs] = useState({
    ip: '192.168.1.72',
    res: '1920x1080',
    browser: 'Chrome/WebKit Engine',
  });
  
  const inputRef = useRef<HTMLInputElement | null>(null);

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
        // Play soft keyboard click when printing logs
        soundFX.playClick();
      } else {
        clearInterval(interval);
        // Autofocus code input once logs finish
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }, 450);

    return () => clearInterval(interval);
  }, [sysSpecs]);

  // Handle typing inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setCode(value);
    
    // Play sound FX for keypress
    soundFX.playClick();

    // Check passphrase trigger
    if (value === 'NISARG') {
      setIsUnlocked(true);
      setIsExploding(true);
      
      // Play high chime and trigger reveal transition after 1.5 seconds
      setTimeout(() => {
        soundFX.playSuccess();
      }, 200);

      setTimeout(() => {
        onUnlock();
      }, 1500);
    }
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
      className="fixed inset-0 z-[9999] bg-[#030603] text-[#00ff41] font-mono flex flex-col items-center justify-center p-6 select-none bg-scanlines overflow-hidden"
    >
      {/* Background Matrix Rain Simulation when Authorized */}
      {isExploding && (
        <div className="absolute inset-0 bg-[#000]/90 z-20 flex flex-col justify-center items-center text-center">
          <div className="text-[#00ff41] text-3xl md:text-5xl font-extrabold tracking-widest mb-4 animate-pulse uppercase">
            ⚡ Auth Verified ⚡
          </div>
          <div className="text-xs md:text-sm text-[#00ff41]/60 max-w-md px-4 leading-relaxed uppercase">
            System override engaged. Unlocking hidden telemetry streams and diagnostic HUD overlays...
          </div>
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-black to-black" />
        </div>
      )}

      {/* Frame Container */}
      <div className="w-full max-w-xl border border-[#00ff41]/20 rounded-2xl p-6 bg-black/60 backdrop-blur-md relative flex flex-col gap-6 shadow-[0_0_40px_rgba(0,255,65,0.08)]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[#00ff41]/20 pb-3 text-[10px] tracking-wider text-[#00ff41]/60">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 animate-pulse" />
            <span>GATEWAY_SECURE_AUTH</span>
          </div>
          <span>ACCESS_LEVEL: RESTRICTED</span>
        </div>

        {/* Biometric SVG Scanner */}
        <div className="relative flex justify-center py-6">
          <div className="w-28 h-28 border border-[#00ff41]/30 rounded-full flex items-center justify-center relative bg-emerald-950/20 overflow-hidden shadow-[inset_0_0_20px_rgba(0,255,65,0.1)]">
            {/* Pulsing Scanner Rings */}
            <span className="absolute inset-2 border border-[#00ff41]/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            <span className="absolute inset-6 border border-[#00ff41]/10 rounded-full animate-pulse" />
            
            {/* Fingerprint Vector */}
            <svg 
              className={`w-14 h-14 ${isUnlocked ? 'text-emerald-300 scale-110 shadow-emerald-500' : 'text-[#00ff41]'} transition-all`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 11c0-1.105-.895-2-2-2s-2 .895-2 2M12 11c0 1.105.895 2 2 2s2-.895 2-2m-4 0v4m0 0h4m-4 0v2m8-8c0-4.418-3.582-8-8-8S4 7.582 4 12s3.582 8 8 8 8-3.582 8-8zM8 12h8" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 17c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z" />
            </svg>

            {/* Glowing Laser Scan Bar */}
            <div className="absolute left-0 right-0 h-0.5 bg-[#00ff41] shadow-[0_0_8px_#00ff41] animate-bounce" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        {/* Live Diagnostics Log output */}
        <div className="bg-[#020402] border border-[#00ff41]/15 rounded-xl p-4 text-[11px] leading-relaxed flex flex-col gap-1.5 min-h-[140px] text-[#00ff41]/85 overflow-y-auto">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-[#00ff41]/40">❯</span>
              <span>{log}</span>
            </div>
          ))}
        </div>

        {/* Console Input and Actions */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-black/60 border border-[#00ff41]/30 rounded-xl px-4 py-3 shadow-[0_0_15px_rgba(0,255,65,0.04)]">
            <span className="text-[#00ff41]/50 font-bold select-none animate-pulse">❯</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="ENTER SYSTEM DECK PASSPHRASE..."
              value={code}
              onChange={handleInputChange}
              disabled={isUnlocked}
              className="flex-grow bg-transparent border-none outline-none text-[#00ff41] placeholder-[#00ff41]/35 tracking-wider text-xs uppercase"
            />
          </div>

          <div className="flex justify-between items-center text-[10px] uppercase text-[#00ff41]/60 px-1">
            <span>CodeHint: Owner's First Name</span>
            <button
              onClick={handleBypassClick}
              disabled={isUnlocked}
              className="font-bold border border-[#00ff41]/30 px-3 py-1.5 rounded-lg hover:bg-[#00ff41]/10 active:scale-95 transition-all text-[#00ff41] tracking-widest"
            >
              [ Bypass scan ]
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

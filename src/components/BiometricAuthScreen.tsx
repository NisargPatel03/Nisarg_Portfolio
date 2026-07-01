import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { soundFX } from '../utils/terminalAudio';

interface BiometricAuthScreenProps {
  onBypass: () => void;
  onUnlock: () => void;
}

interface NodeCoord {
  id: number;
  x: number;
  y: number;
  rune: string;
}

const RUNES = ["ᛗ", "ᚠ", "ᚻ", "ᛉ", "ᛏ", "ᛒ", "ᛖ", "ᛚ", "ᛟ"]; // Ancient cybernetic runes
const NODES: NodeCoord[] = Array.from({ length: 9 }, (_, i) => {
  const row = Math.floor(i / 3);
  const col = i % 3;
  return {
    id: i,
    x: 40 + col * 80,
    y: 40 + row * 80,
    rune: RUNES[i],
  };
});

const TARGET_SEQUENCE = [6, 3, 0, 4, 8, 5, 2]; // Spells the "N" shape

export const BiometricAuthScreen: React.FC<BiometricAuthScreenProps> = ({
  onBypass,
  onUnlock,
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isSweeping, setIsSweeping] = useState(false);

  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [activePath, setActivePath] = useState<number[]>([]);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);

  // Hint sequence states
  const [hintPath, setHintPath] = useState<number[]>([]);
  const [isHintPlaying, setIsHintPlaying] = useState(false);
  const [isErrorShake, setIsErrorShake] = useState(false);

  const hintIntervalRef = useRef<any>(null);

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
      'INITIALIZING COGNITIVE RUNIC GATEWAY...',
      'LOADING MATRIX NODE SHIELDS... OK',
      `RESOLVING LOCAL SUBNET ROUTE... ADDR: ${sysSpecs.ip}`,
      `CALIBRATING RUNE FIELD SENSORS... GRID: 3x3`,
      'WARNING: ACCESS IS RESTRICTED TO AUTHORIZED RECRUITERS',
      'DRAW THE FLASHING PATTERN SEQUENCE TO DECRYPT THE DECK PORTFOLIO.'
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < logSequence.length) {
        setLogs((prev) => [...prev, logSequence[currentIdx]]);
        currentIdx++;
        soundFX.playClick();
      } else {
        clearInterval(interval);
        // Play hint sequence automatically after logs load
        playHint();
      }
    }, 450);

    return () => clearInterval(interval);
  }, [sysSpecs]);

  // Flash pattern hint
  const playHint = () => {
    if (isUnlocked) return;
    setIsHintPlaying(true);
    setHintPath([]);
    setLogs((prev) => [...prev, 'SYSTEM HINT: DISPATCHING GLYPH SEQUENCE [N]...']);
    
    if (hintIntervalRef.current) {
      clearInterval(hintIntervalRef.current);
    }
    
    let step = 0;
    hintIntervalRef.current = setInterval(() => {
      if (step < TARGET_SEQUENCE.length) {
        setHintPath((prev) => [...prev, TARGET_SEQUENCE[step]]);
        soundFX.playClick();
        step++;
      } else {
        if (hintIntervalRef.current) {
          clearInterval(hintIntervalRef.current);
          hintIntervalRef.current = null;
        }
        setTimeout(() => {
          setHintPath([]);
          setIsHintPlaying(false);
          setLogs((prev) => [...prev, 'SYSTEM HINT: FIELD CALIBRATED. TRACE THE SEQUENCE.']);
        }, 800);
      }
    }, 300);
  };

  // Node pointer down handler to initiate drawing
  const handleNodePointerDown = (nodeId: number, e: React.PointerEvent) => {
    if (isHintPlaying || isUnlocked || isErrorShake) return;
    e.preventDefault();
    setIsDrawing(true);
    setActivePath([nodeId]);
    soundFX.playClick();
    
    // Find node coords to seed initial pointer position
    const node = NODES[nodeId];
    setPointerPos({ x: node.x, y: node.y });
  };

  // SVG-wide pointer move to update line coordinates
  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDrawing || isHintPlaying || isUnlocked || isErrorShake) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setPointerPos({ x: px, y: py });
  };

  // Node hover handler (pointer enter) to connect nodes
  const handleNodePointerEnter = (nodeId: number) => {
    if (!isDrawing || isHintPlaying || isUnlocked || isErrorShake) return;
    if (activePath.includes(nodeId)) return; // Prevent duplicate node connections
    
    setActivePath((prev) => [...prev, nodeId]);
    soundFX.playClick();
    setLogs((prev) => [...prev, `RUNE_${RUNES[nodeId]} CONNECTED [INDEX_${nodeId}]`]);
  };

  // Complete drawing and verify path
  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setPointerPos(null);

    // Validate path length and sequence
    const isValid = activePath.length === TARGET_SEQUENCE.length && 
                    activePath.every((val, index) => val === TARGET_SEQUENCE[index]);

    if (isValid) {
      setIsUnlocked(true);
      setIsSweeping(true);
      setLogs((prev) => [
        ...prev,
        'CRITICAL: SYSTEM GATEWAY SECURITY BREACHED.',
        'RUNNING OPTICAL DECRYPTION LASER SWEEP...',
        'PASSPHRASE DECODED. SYSTEM ACCESS GRANTED.'
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
    } else {
      if (activePath.length > 0) {
        soundFX.playError();
        setIsErrorShake(true);
        setLogs((prev) => [...prev, 'ACCESS DENIED: INCORRECT GLYPH SEQUENCE LOCK.']);
        setActivePath([]);
        
        setTimeout(() => {
          setIsErrorShake(false);
          playHint(); // Re-flash the pattern hint to guide user
        }, 800);
      }
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
      if (hintIntervalRef.current) {
        clearInterval(hintIntervalRef.current);
      }
    };
  }, []);

  const displayPath = isHintPlaying ? hintPath : activePath;

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
        <motion.div
          animate={isErrorShake ? {
            x: [-10, 10, -10, 10, -5, 5, -2, 2, 0],
            transition: { duration: 0.5 }
          } : { x: 0 }}
          className="w-full max-w-lg border rounded-2xl p-5 md:p-6 bg-black/45 backdrop-blur-md relative flex flex-col gap-4 md:gap-5 border-[#00ff41]/20 shadow-[0_0_40px_rgba(0,255,65,0.08)] cyber-glass-bezel"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3 text-[10px] tracking-wider font-orbitron border-[#00ff41]/20 text-[#00ff41]/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse bg-emerald-500" />
              <span className="font-glow">HOLOGRAPHIC_RUNE_GATE</span>
            </div>
            <span className="font-glow">STATUS: {isUnlocked ? 'DECRYPTED' : 'RESTRICTED'}</span>
          </div>

          {/* Rune Grid SVG Canvas */}
          <div 
            onPointerUp={handlePointerUp}
            className="relative flex justify-center py-4 bg-black/25 border border-white/5 rounded-xl overflow-hidden touch-none"
          >
            
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
              width="240"
              height="240"
              viewBox="0 0 240 240"
              className="overflow-visible select-none"
              onPointerMove={handleSvgPointerMove}
            >
              <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(0, 255, 65, 0.12)" />
                  <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                </radialGradient>
              </defs>

              {/* Central background grid glows */}
              <circle cx="120" cy="120" r="110" fill="url(#glow)" />

              {/* Connecting lines of the path */}
              {displayPath.map((nodeId, idx) => {
                if (idx === 0) return null;
                const prevNode = NODES[displayPath[idx - 1]];
                const currNode = NODES[nodeId];
                if (!prevNode || !currNode) return null;
                return (
                  <line
                    key={idx}
                    x1={prevNode.x}
                    y1={prevNode.y}
                    x2={currNode.x}
                    y2={currNode.y}
                    stroke={isErrorShake ? "#ef4444" : "#00ff41"}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="transition-colors duration-200"
                    style={{
                      filter: `drop-shadow(0 0 4px ${isErrorShake ? '#ef4444' : '#00ff41'})`
                    }}
                  />
                );
              })}

              {/* Dotted cursor connector line */}
              {isDrawing && activePath.length > 0 && pointerPos && (
                <line
                  x1={NODES[activePath[activePath.length - 1]].x}
                  y1={NODES[activePath[activePath.length - 1]].y}
                  x2={pointerPos.x}
                  y2={pointerPos.y}
                  stroke="#00ff41"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 4"
                  className="opacity-70"
                />
              )}

              {/* Grid Nodes */}
              {NODES.map((node) => {
                const isActive = displayPath.includes(node.id);
                
                let circleColor = "rgba(0, 255, 65, 0.25)";
                let nodeBg = "rgba(0, 0, 0, 0.65)";
                let shadow = "";

                if (isActive) {
                  circleColor = isErrorShake ? "#ef4444" : "#00ff41";
                  nodeBg = isErrorShake ? "rgba(239, 68, 68, 0.15)" : "rgba(0, 255, 65, 0.25)";
                  shadow = isErrorShake ? "drop-shadow(0 0 6px #ef4444)" : "drop-shadow(0 0 6px #00ff41)";
                }

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer select-none"
                    onPointerDown={(e) => handleNodePointerDown(node.id, e)}
                    onPointerEnter={() => handleNodePointerEnter(node.id)}
                  >
                    {/* Enlarged invisible hover trigger for mobile and mouse */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="28"
                      fill="transparent"
                      pointerEvents="all"
                    />

                    {/* Node Base Frame */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="18"
                      stroke={circleColor}
                      strokeWidth={isActive ? "2.5" : "1.5"}
                      fill={nodeBg}
                      style={{ filter: shadow }}
                      className="transition-all duration-300"
                    />

                    {/* Runic Symbol */}
                    <text
                      x={node.x}
                      y={node.y}
                      fill={isActive ? (isErrorShake ? "#ef4444" : "#00ff41") : "rgba(0, 255, 65, 0.5)"}
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="select-none transition-colors duration-300"
                    >
                      {node.rune}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Diagnostics Logs Terminal */}
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

          {/* Action Footer */}
          <div className="flex justify-between items-center text-[10px] uppercase px-1 text-[#00ff41]/60">
            <button
              type="button"
              onClick={playHint}
              disabled={isHintPlaying || isUnlocked}
              className="hover:text-[#00ff41] transition-colors font-bold disabled:opacity-40"
            >
              [ Show Hint Sequence ]
            </button>
            <button
              type="button"
              onClick={handleBypassClick}
              disabled={isUnlocked}
              className="font-bold border px-3 py-1.5 rounded-lg active:scale-95 transition-all tracking-widest border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/10"
            >
              [ Bypass scan ]
            </button>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { soundFX } from '../utils/terminalAudio';
import { Terminal, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Riddle {
  question: string;
  answers: string[]; // Accept multiple variations of correct answers
  hint: string;
}

const RIDDLES: Riddle[] = [
  {
    question: "What is the return value of typeof null in JavaScript?",
    answers: ["object"],
    hint: "Think about basic JavaScript type classification quirk."
  },
  {
    question: "Worst-case time complexity of Bubble Sort?",
    answers: ["o(n^2)", "o(n*n)", "o(n2)", "n^2"],
    hint: "Enter in Big-O notation, e.g., O(n^2)"
  },
  {
    question: "Which keyword is used to declare a block-scoped variable in modern JS?",
    answers: ["let", "const"],
    hint: "It starts with 'l' or 'c'"
  },
  {
    question: "What is the result of [] + [] in JavaScript?",
    answers: ["\"\"", "''", "empty string", "empty"],
    hint: "It evaluates to an empty value of a specific type."
  },
  {
    question: "Type the system override code to stabilize the core.",
    answers: ["/fix"],
    hint: "The command specified in the warning message: /fix"
  }
];

export const MeltdownOverlay: React.FC = () => {
  const [riddle, setRiddle] = useState<Riddle>(RIDDLES[4]); // default
  const [inputValue, setInputValue] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isStabilizing, setIsStabilizing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Select a random riddle on mount
    const randomIdx = Math.floor(Math.random() * RIDDLES.length);
    setRiddle(RIDDLES[randomIdx]);

    // Keep focus inside terminal input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedInput = inputValue.trim().toLowerCase();
    
    // Check if correct (either matches the active riddle's answers OR is the universal override command "/fix")
    const isCorrect = 
      normalizedInput === '/fix' || 
      riddle.answers.some(ans => normalizedInput === ans.toLowerCase());

    if (isCorrect) {
      setIsStabilizing(true);
      setIsError(false);
      soundFX.playSuccess();
      if ((window as any).stabilizeMeltdown) {
        setTimeout(() => {
          (window as any).stabilizeMeltdown();
        }, 1500); // Wait for stabilization flash animation
      }
    } else {
      setIsError(true);
      soundFX.playError();
      setErrorMessage("ACCESS REFUSED. STABILIZATION DECRYPT FAILED.");
      setInputValue('');
      setTimeout(() => {
        setIsError(false);
      }, 500); // Shaking animation duration
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050000]/95 font-mono select-none px-6 text-red-500 overflow-hidden ${
        isStabilizing ? 'animate-stabilize-flash' : ''
      }`}
    >
      {/* Retro CRIT overlay scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px'
        }}
      />

      {/* Flashing Hazard Header Banner */}
      <div className="w-full max-w-2xl bg-red-600 text-black font-black py-2.5 px-4 mb-8 rounded-t-lg flex items-center justify-between text-sm sm:text-base animate-pulse">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>[ !!! SYSTEM REACTOR MELTDOWN IN PROGRESS !!! ]</span>
        </div>
        <span>T-MINUS CORES</span>
      </div>

      {/* Terminal Main Window */}
      <div 
        className={`w-full max-w-2xl bg-black border-2 border-red-600 rounded-b-lg p-6 flex flex-col gap-6 relative shadow-[0_0_50px_rgba(220,38,38,0.25)] ${
          isError ? 'animate-shake-input' : ''
        }`}
      >
        <div className="flex items-center justify-between border-b border-red-950 pb-3 text-xs text-red-700">
          <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> NISARG_OS // EMERGENCY_SHELL</span>
          <span>STABILITY: 4.02%</span>
        </div>

        {/* Console Log Reports */}
        <div className="text-xs sm:text-sm text-red-600/90 leading-relaxed flex flex-col gap-1">
          <p className="font-bold text-red-500">WARNING: REACTOR CORE CRITICAL MELTDOWN STATUS TRIGGERED.</p>
          <p>- Core Temperature: 890°C (Max Safelimit: 400°C)</p>
          <p className="text-red-500/80">- CSS Grid Alignments & Coordinate Matrices: SEVERED.</p>
          <p className="text-red-500/80">- Visual Stack Cards: COLLAPSED (Gravity Physics Active).</p>
          <p className="text-yellow-500">- DAMAGE RESOLUTION CODE NEEDED TO PREVENT SITE CRASH.</p>
        </div>

        {/* Riddle Panel */}
        <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 flex flex-col gap-2.5">
          <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest">[ DECRYPT RIDDLE ]</span>
          <p className="text-white text-sm sm:text-base font-bold">{riddle.question}</p>
          <p className="text-[11px] text-red-500/70 italic">Hint: {riddle.hint}</p>
        </div>

        {/* Terminal Input Box */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-red-400 uppercase tracking-widest pl-1">
              Enter Restoration Code:
            </label>
            <div className="flex items-center gap-2 bg-red-950/30 border border-red-600/40 rounded-xl px-4 py-3 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 transition-all">
              <span className="text-red-500 font-bold select-none">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                required
                disabled={isStabilizing}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type decryption answer or /fix..."
                className="w-full bg-transparent outline-none border-none text-white text-sm"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center mt-2 gap-4">
            {/* Status Alert */}
            <div className="text-xs font-bold text-red-600">
              {isError && <span className="animate-pulse">{errorMessage}</span>}
              {isStabilizing && (
                <span className="text-green-400 font-black animate-pulse flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> INJECTING COOLANT...
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isStabilizing}
              className={`px-6 py-2.5 rounded-xl border-2 border-red-600 bg-red-950/20 text-red-500 font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 hover:bg-red-600 hover:text-black active:scale-95 ${
                isStabilizing ? 'opacity-50 cursor-default' : 'cursor-pointer'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Submit Decrypt</span>
            </button>
          </div>
        </form>
      </div>

      {/* Screen stabilization CSS overlay animation styles injected locally for cleanliness */}
      <style>{`
        @keyframes shake-input {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake-input {
          animation: shake-input 0.4s ease-in-out;
        }
        @keyframes stabilize-flash {
          0% { background-color: #050000; filter: brightness(1); }
          50% { background-color: #002200; filter: brightness(1.8); }
          100% { background-color: #000000; filter: brightness(0); opacity: 0; }
        }
        .animate-stabilize-flash {
          animation: stabilize-flash 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

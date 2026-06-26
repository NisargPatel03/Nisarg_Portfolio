import React, { useEffect, useState } from 'react';

export const BlueprintOverlay: React.FC = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => {
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const rows = ['1', '2', '3', '4', '5', '6', '7', '8'];

  return (
    <div className="fixed inset-0 pointer-events-none z-[997] overflow-hidden select-none">
      {/* Outer frame */}
      <div className="absolute inset-4 border border-cyan-500/25" />
      
      {/* Inner dashed frame */}
      <div className="absolute inset-[20px] border border-dashed border-cyan-500/10" />

      {/* Coordinate ticks around border */}
      <div className="absolute top-4 bottom-4 left-4 border-r border-cyan-500/10" />
      <div className="absolute top-4 bottom-4 right-4 border-l border-cyan-500/10" />
      <div className="absolute left-4 right-4 top-4 border-b border-cyan-500/10" />
      <div className="absolute left-4 right-4 bottom-4 border-t border-cyan-500/10" />

      {/* Cursor tracking lines */}
      {coords.x > 0 && coords.y > 0 && (
        <>
          <div 
            className="absolute top-4 bottom-4 border-l border-dotted border-cyan-400/20"
            style={{ left: coords.x, transform: 'translateX(-0.5px)' }}
          />
          <div 
            className="absolute left-4 right-4 border-t border-dotted border-cyan-400/20"
            style={{ top: coords.y, transform: 'translateY(-0.5px)' }}
          />
        </>
      )}

      {/* Floating tooltip near cursor showing screen space coordinates */}
      {coords.x > 0 && coords.y > 0 && (
        <div 
          className="absolute bg-[#040d1a]/95 border border-cyan-500/50 px-2 py-0.5 rounded font-mono text-[8px] text-cyan-400 shadow-lg pointer-events-none"
          style={{ 
            left: coords.x + 14, 
            top: coords.y + 14,
          }}
        >
          X:{String(coords.x).padStart(4, '0')} Y:{String(coords.y).padStart(4, '0')}
        </div>
      )}

      {/* Corner Crosshairs */}
      <div className="absolute top-4 left-4 font-mono text-cyan-400/40 text-[10px] -translate-x-1.5 -translate-y-2 select-none">+</div>
      <div className="absolute top-4 right-4 font-mono text-cyan-400/40 text-[10px] translate-x-1.5 -translate-y-2 select-none">+</div>
      <div className="absolute bottom-4 left-4 font-mono text-cyan-400/40 text-[10px] -translate-x-1.5 translate-y-1 select-none">+</div>
      <div className="absolute bottom-4 right-4 font-mono text-cyan-400/40 text-[10px] translate-x-1.5 translate-y-1 select-none">+</div>

      {/* Top Margin Coordinate Letters */}
      <div className="absolute top-1 left-4 right-4 flex justify-between px-10 text-[8px] font-mono text-cyan-400/40">
        {cols.map((col, idx) => <span key={idx}>{col}</span>)}
      </div>

      {/* Bottom Margin Coordinate Letters */}
      <div className="absolute bottom-1 left-4 right-4 flex justify-between px-10 text-[8px] font-mono text-cyan-400/40">
        {cols.map((col, idx) => <span key={idx}>{col}</span>)}
      </div>

      {/* Left Margin Coordinate Numbers */}
      <div className="absolute left-1 top-4 bottom-4 flex flex-col justify-between py-10 text-[8px] font-mono text-cyan-400/40">
        {rows.map((row, idx) => <span key={idx}>{row}</span>)}
      </div>

      {/* Right Margin Coordinate Numbers */}
      <div className="absolute right-1 top-4 bottom-4 flex flex-col justify-between py-10 text-[8px] font-mono text-cyan-400/40">
        {rows.map((row, idx) => <span key={idx}>{row}</span>)}
      </div>

      {/* Blueprint Title Block (Bottom-Right) */}
      <div 
        className="absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-[#040d1a]/95 border border-cyan-500 text-cyan-400 p-2 font-mono text-[7px] tracking-wider z-[998] shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex flex-col gap-1 w-[160px] pointer-events-auto"
        style={{ borderCollapse: 'collapse' }}
      >
        <div className="font-bold border-b border-cyan-500/70 pb-1 mb-1 text-[8px] text-center text-cyan-300">
          CAD BLUEPRINT LAYOUT
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
          <span className="text-cyan-500/50">PROJECT:</span>
          <span>N_PATEL_PORTFOLIO</span>
          <span className="text-cyan-500/50">DWG NO:</span>
          <span>CAD-SGP-05</span>
          <span className="text-cyan-500/50">SCALE:</span>
          <span>1:1 (PIXEL)</span>
          <span className="text-cyan-500/50">SIZE:</span>
          <span>{dimensions.w} x {dimensions.h}</span>
          <span className="text-cyan-500/50">ENGINEER:</span>
          <span>NISARG PATEL</span>
          <span className="text-cyan-500/50">STATUS:</span>
          <span className="text-cyan-300 animate-pulse">WIRE_SKEL</span>
        </div>
        <div className="border-t border-cyan-500/30 pt-1 mt-1 text-[5px] text-cyan-400/35 text-center uppercase tracking-tight">
          CONFIDENTIAL DEVELOPMENT COPY
        </div>
      </div>
    </div>
  );
};

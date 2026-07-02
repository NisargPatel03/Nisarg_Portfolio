import React, { useEffect, useRef, useState } from 'react';
import { soundFX } from '../utils/terminalAudio';

interface ScrollCircuitPathProps {
  activeSection: string;
}

export const ScrollCircuitPath: React.FC<ScrollCircuitPathProps> = ({ activeSection }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 80, height: 800 });
  const [pathLength, setPathLength] = useState(0);
  const [beadPos, setBeadPos] = useState({ x: 40, y: 50 });
  const [isLightTheme, setIsLightTheme] = useState(false);

  const pathRef = useRef<SVGPathElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Monitor background brightness to support light themes automatically
  useEffect(() => {
    const checkTheme = () => {
      const bg = getComputedStyle(document.body).backgroundColor;
      if (bg) {
        const rgbValues = bg.match(/\d+/g);
        if (rgbValues && rgbValues.length >= 3) {
          const r = parseInt(rgbValues[0], 10);
          const g = parseInt(rgbValues[1], 10);
          const b = parseInt(rgbValues[2], 10);
          // Calculate perceived brightness (standard formula)
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          setIsLightTheme(brightness > 128);
          return;
        }
      }
      setIsLightTheme(false);
    };

    checkTheme();

    // Set up a MutationObserver to detect theme or style shifts on the document
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });

    window.addEventListener('resize', checkTheme);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkTheme);
    };
  }, []);

  // Resize listener to adapt SVG coordinates to viewport height
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate a beautiful wavy path curve from top (8% height) to bottom (92% height)
  const marginY = dimensions.height * 0.08;
  const startY = marginY;
  const endY = dimensions.height - marginY;
  
  const sectionLabels = [
    { label: 'SYS_BOOT', id: 'hero' },
    { label: 'BIO_NET', id: 'skills' },
    { label: 'SYS_ARCH', id: 'architecture' },
    { label: 'BIO_CORE', id: 'about' },
    { label: 'GIT_TREE', id: 'work-experience' },
    { label: 'SANDBOX', id: 'services' },
    { label: '3D_DECK', id: 'projects-section' },
    { label: 'CERT_VER', id: 'certifications' },
    { label: 'COM_UPLINK', id: 'contact' },
  ];

  const nodes: { x: number; y: number; label: string; sectionId: string }[] = [];

  // Calculate coordinates for nodes
  for (let i = 0; i < sectionLabels.length; i++) {
    const y = startY + (i * (endY - startY)) / (sectionLabels.length - 1);
    // Alternate left/right wave displacement around the horizontal center line (x=32)
    const x = 32 + (i % 2 === 0 ? 15 : -15);
    nodes.push({ x, y, label: sectionLabels[i].label, sectionId: sectionLabels[i].id });
  }

  // Draw smooth cubic Bezier curve through the nodes
  let pathD = '';
  if (nodes.length > 0) {
    pathD = `M ${nodes[0].x}, ${nodes[0].y}`;
    for (let i = 0; i < nodes.length - 1; i++) {
      const curr = nodes[i];
      const next = nodes[i + 1];
      const cpY1 = curr.y + (next.y - curr.y) / 3;
      const cpY2 = curr.y + (2 * (next.y - curr.y)) / 3;
      // Exaggerate x-wave curves to make them look beautifully winding
      const cpX1 = curr.x + (i % 2 === 0 ? 25 : -25);
      const cpX2 = next.x + (i % 2 === 0 ? -25 : 25);
      pathD += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${next.x},${next.y}`;
    }
  }

  // Measure path length and update bead position at current scroll progress
  useEffect(() => {
    if (pathRef.current && pathD) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      try {
        const point = pathRef.current.getPointAtLength(scrollProgress * length);
        if (point) {
          setBeadPos({ x: point.x, y: point.y });
        }
      } catch (e) {
        // Fallback for older browsers
      }
    }
  }, [scrollProgress, pathD, dimensions]);

  const handleNodeClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      soundFX.playClick();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // SVG color definitions depending on light or dark background
  const trackStroke = isLightTheme ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.16)';
  const inactiveNodeFill = isLightTheme ? '#ffffff' : '#0b0f19';
  const inactiveNodeStroke = isLightTheme ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)';
  const inactiveTextFill = isLightTheme ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.4)';
  const activeTextFill = isLightTheme ? '#005577' : 'var(--accent-color, #00f3ff)';
  const beadCenterFill = isLightTheme ? '#0b0f19' : '#ffffff';

  return (
    <div
      ref={containerRef}
      className="fixed left-4 top-0 bottom-0 w-24 z-[49] pointer-events-none hidden xl:flex items-center justify-center select-none"
    >
      <svg className="w-full h-full overflow-visible">
        <defs>
          {/* Glowing neon filter */}
          <filter id="circuit-neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background track path */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke={trackStroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {/* Animated fill track path */}
        {pathD && (
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="var(--accent-color, #00f3ff)" // variable binding with cyan fallback
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength - pathLength * scrollProgress}
            filter="url(#circuit-neon-glow)"
            className="transition-all duration-75 ease-out"
          />
        )}

        {/* Anchor nodes */}
        {nodes.map((node, i) => {
          const isActive = activeSection === node.label;
          return (
            <g key={i} className="pointer-events-auto cursor-pointer group" onClick={() => handleNodeClick(node.sectionId)}>
              {/* Outer scan ring for active node */}
              {isActive && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="9"
                  fill="none"
                  stroke="var(--accent-color, #00f3ff)"
                  strokeWidth="1"
                  className="animate-ping opacity-60"
                />
              )}
              {/* Node core circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isActive ? "5" : "3.5"}
                fill={isActive ? "var(--accent-color, #00f3ff)" : inactiveNodeFill}
                stroke={isActive ? "var(--accent-color, #00f3ff)" : inactiveNodeStroke}
                strokeWidth="1.5"
                className="transition-all duration-300 group-hover:scale-125"
              />
              
              {/* Side tooltip text */}
              <text
                x={node.x + 14}
                y={node.y + 3.5}
                fill={isActive ? activeTextFill : inactiveTextFill}
                className={`font-mono text-[8px] tracking-widest font-semibold transition-all duration-300 group-hover:opacity-100 ${
                  isActive ? 'translate-x-1 opacity-100' : 'opacity-0'
                }`}
                style={{
                  textShadow: isActive && !isLightTheme ? '0 0 8px var(--accent-glow, rgba(0, 243, 255, 0.4))' : 'none',
                }}
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {/* Traveling energy bead */}
        {pathLength > 0 && (
          <g>
            {/* Traveling bead halo */}
            <circle
              cx={beadPos.x}
              cy={beadPos.y}
              r="7"
              fill="none"
              stroke="var(--accent-color, #00f3ff)"
              strokeWidth="1.5"
              filter="url(#circuit-neon-glow)"
              className="animate-pulse"
            />
            {/* Core bead */}
            <circle
              cx={beadPos.x}
              cy={beadPos.y}
              r="3.5"
              fill={beadCenterFill}
              filter="url(#circuit-neon-glow)"
            />
            {/* Realtime percentage telemetry display */}
            <text
              x={beadPos.x - 52}
              y={beadPos.y + 3.5}
              fill={activeTextFill}
              className="font-mono text-[7px] font-bold tracking-widest"
              style={{
                textShadow: isActive && !isLightTheme ? '0 0 5px var(--accent-glow, rgba(0, 243, 255, 0.4))' : 'none',
              }}
            >
              {`VAL:[${Math.round(scrollProgress * 100)}%]`}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

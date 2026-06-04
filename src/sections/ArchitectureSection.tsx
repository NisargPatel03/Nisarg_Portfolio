import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TechNode {
  id: string;
  name: string;
  category: string;
  column: 'client' | 'gateway' | 'ai' | 'database';
  color: string;
  description: string;
  pairedWith: string[];
  icon: React.ReactNode;
}

interface Connection {
  from: string;
  to: string;
}

interface SimStep {
  nodeId: string;
  log: string;
  duration: number; // relative delay in ms from start
}

interface SimulationFlow {
  name: string;
  description: string;
  steps: SimStep[];
}

export const ArchitectureSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<SVGSVGElement>(null);
  
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeSim, setActiveSim] = useState<string | null>(null);
  const [simStepIndex, setSimStepIndex] = useState<number>(-1);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [nodePositions, setNodePositions] = useState<Record<string, DOMRect>>({});
  const [canvasPosition, setCanvasPosition] = useState<DOMRect | null>(null);

  // Define the tech nodes in a precise 4x3 row-major order:
  // Row 1: Client, Gateway, AI, Database
  // Row 2: Client, Gateway, AI, Database
  // Row 3: Client, Gateway, AI, Database
  const nodes: TechNode[] = [
    // --- ROW 1 ---
    {
      id: 'react',
      name: 'React',
      category: 'Web App Engine',
      column: 'client',
      color: '#00D8FF',
      description: 'Used for crafting responsive, component-driven web interfaces, state management pipelines, and interactive dashboards.',
      pairedWith: ['TypeScript', 'Zustand', 'Tailwind CSS'],
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(90 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(150 12 12)" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      )
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      category: 'Backend Runtime',
      column: 'gateway',
      color: '#339933',
      description: 'Core runtime for scaling server environments, handling non-blocking WebSockets, and running REST API logic.',
      pairedWith: ['Express', 'MongoDB', 'Supabase'],
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M12 12v10" />
        </svg>
      )
    },
    {
      id: 'python',
      name: 'Python AI',
      category: 'AI Pipeline Core',
      column: 'ai',
      color: '#3776AB',
      description: 'Primary script environment for cleaning data sets, constructing predictive analytics, and loading neural models.',
      pairedWith: ['TensorFlow', 'PyTorch', 'Node.js'],
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    },
    {
      id: 'supabase',
      name: 'Supabase',
      category: 'Cloud Postgres',
      column: 'database',
      color: '#3ECF8E',
      description: 'Backend-as-a-service cloud provider, delivering real-time PostgreSQL listeners, Edge functions, and secure authentication.',
      pairedWith: ['React', 'Flutter', 'PostgreSQL'],
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    },

    // --- ROW 2 ---
    {
      id: 'flutter',
      name: 'Flutter',
      category: 'Mobile Core SDK',
      column: 'client',
      color: '#02569B',
      description: 'Engine for compiling compiled native mobile apps for iOS and Android from a single Dart codebase.',
      pairedWith: ['Dart', 'Supabase', 'REST APIs'],
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2L6 10l8 8M20 2L12 10l8 8" />
        </svg>
      )
    },
    {
      id: 'express',
      name: 'Express',
      category: 'API Routing',
      column: 'gateway',
      color: '#F7DF1E',
      description: 'Lightweight web framework utilized to build secure endpoints, orchestrate middleware, and manage REST requests.',
      pairedWith: ['Node.js', 'MongoDB', 'TypeScript'],
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 8h10M7 12h10M7 16h6" />
        </svg>
      )
    },
    {
      id: 'tensorflow',
      name: 'TensorFlow',
      category: 'Deep Learning',
      column: 'ai',
      color: '#FF9900',
      description: 'Powerhouse ML library used for compiling neural classifications and hosting inference models.',
      pairedWith: ['Python', 'Deep Learning'],
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <path d="M12 6v12M8 10h8" />
        </svg>
      )
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      category: 'Document Storage',
      column: 'database',
      color: '#47A248',
      description: 'Document database hosting complex user profiles, application logs, and message boards for web portals.',
      pairedWith: ['Node.js', 'Express', 'React'],
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2c0 0-5 4-5 9s3 7 5 11c2-4 5-7 5-11s-5-9-5-9z" />
        </svg>
      )
    },

    // --- ROW 3 ---
    {
      id: 'typescript',
      name: 'TypeScript',
      category: 'Type Safety',
      column: 'client',
      color: '#3178C6',
      description: 'Brings type integrity and OOP practices to the frontend modules, protecting app architectures against unexpected regressions.',
      pairedWith: ['React', 'Node.js', 'Express'],
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 8h6M11 8v8M16 11c0-1-1-2-2-2s-2 1-2 2v2c0 1 1 2 2 2s2-1 2-2" />
        </svg>
      )
    },
    {
      id: 'php',
      name: 'PHP / XAMPP',
      category: 'Local APIs & Legacy',
      column: 'gateway',
      color: '#777BB4',
      description: 'Used for scripting on-premise local dashboards, local database integration, and legacy blood bank dashboard systems.',
      pairedWith: ['MySQL', 'Bootstrap', 'XAMPP'],
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="12" rx="10" ry="6" />
          <path d="M8 9h4a2 2 0 1 1 0 4H8v3M16 9h4a2 2 0 1 1 0 4h-4v3" />
        </svg>
      )
    },
    {
      id: 'pytorch',
      name: 'PyTorch',
      category: 'Deep Learning',
      column: 'ai',
      color: '#EE4C2C',
      description: 'An open-source machine learning library used for training deep neural networks, computer vision, and NLP models.',
      pairedWith: ['Python', 'TensorFlow', 'Deep Learning'],
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M9 12h6" />
        </svg>
      )
    },
    {
      id: 'mysql',
      name: 'MySQL',
      category: 'Relational DB',
      column: 'database',
      color: '#00758F',
      description: 'Structured database manager processing ledger audits, relational user grids, and cricket tournament rosters.',
      pairedWith: ['PHP', 'Node.js', 'XAMPP'],
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="6" rx="9" ry="3" />
          <path d="M3 6v12c0 1.66 4 3 9 3s9-1.34 9-3V6" />
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
        </svg>
      )
    },
  ];

  // System connection paths
  const connections: Connection[] = [
    { from: 'react', to: 'nodejs' },
    { from: 'react', to: 'express' },
    { from: 'react', to: 'php' },
    { from: 'flutter', to: 'nodejs' },
    { from: 'typescript', to: 'react' },
    { from: 'typescript', to: 'nodejs' },
    
    { from: 'nodejs', to: 'python' },
    { from: 'express', to: 'python' },
    
    { from: 'nodejs', to: 'mongodb' },
    { from: 'nodejs', to: 'supabase' },
    { from: 'express', to: 'supabase' },
    
    { from: 'php', to: 'mysql' },
    { from: 'nodejs', to: 'mysql' },
    
    { from: 'python', to: 'tensorflow' },
    { from: 'python', to: 'pytorch' },
  ];

  // Simulation workflows
  const workflows: Record<string, SimulationFlow> = {
    welfare: {
      name: 'Welfare Eligibility Profile Match',
      description: 'Simulates a user assessing benefit eligibility with real-time neural sorting.',
      steps: [
        { nodeId: 'react', log: 'User submits profile (income: ₹3L, age: 21) on frontend form', duration: 0 },
        { nodeId: 'express', log: 'POST request received by Express router, initiating validation', duration: 800 },
        { nodeId: 'python', log: 'Express calls Python backend running AI sorting scripts', duration: 1600 },
        { nodeId: 'tensorflow', log: 'TensorFlow model predicts eligibility compatibility at 98%', duration: 2400 },
        { nodeId: 'supabase', log: 'Persisting audited eligibility lookup to cloud PostgreSQL', duration: 3200 },
        { nodeId: 'react', log: 'Success! Dynamic results render to citizen dashboard', duration: 4000 }
      ]
    },
    tournament: {
      name: 'Tournament Scoreboard Update',
      description: 'Simulates real-time mobile referee scoreboard updates syncing to the web client.',
      steps: [
        { nodeId: 'flutter', log: 'Referee increments match run counter on Flutter mobile app', duration: 0 },
        { nodeId: 'nodejs', log: 'Secure Socket connection payload received by Node.js middleware', duration: 800 },
        { nodeId: 'mysql', log: 'Writing score registry transactions to relational MySQL DB', duration: 1600 },
        { nodeId: 'react', log: 'Broadcasting updates; React scoreboard client polls & updates', duration: 2400 }
      ]
    },
    pos: {
      name: 'Savaliya Scoops POS Checkout',
      description: 'Simulates offline POS systems processing orders and queueing receipts.',
      steps: [
        { nodeId: 'react', log: 'POS Operator clicks complete checkout on web interface', duration: 0 },
        { nodeId: 'php', log: 'Forwarding transaction logs locally to XAMPP / PHP API server', duration: 800 },
        { nodeId: 'mysql', log: 'Auditing receipt order entries locally inside MySQL schema', duration: 1600 },
        { nodeId: 'php', log: 'PHP backend starts raw protocol transmission to thermal printer', duration: 2400 }
      ]
    }
  };

  // Measure positions of the nodes on screen resize or load
  const measurePositions = () => {
    if (!containerRef.current || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    setCanvasPosition(canvasRect);

    const positions: Record<string, DOMRect> = {};
    nodes.forEach((node) => {
      const el = document.getElementById(`node-${node.id}`);
      if (el) {
        positions[node.id] = el.getBoundingClientRect();
      }
    });
    setNodePositions(positions);
  };

  useEffect(() => {
    measurePositions();
    window.addEventListener('resize', measurePositions);
    // Extra timeouts to handle any layout shifts after initial load
    const timer1 = setTimeout(measurePositions, 200);
    const timer2 = setTimeout(measurePositions, 800);
    
    return () => {
      window.removeEventListener('resize', measurePositions);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Simulation handler loop
  useEffect(() => {
    if (!activeSim) {
      setSimStepIndex(-1);
      setSimLogs([]);
      return;
    }

    const flow = workflows[activeSim];
    if (!flow) return;

    setSimStepIndex(0);
    setSimLogs([`[0.00s] ➜ ${flow.steps[0].log}`]);

    const timers: number[] = [];
    
    flow.steps.forEach((step, idx) => {
      if (idx === 0) return;
      const timer = window.setTimeout(() => {
        setSimStepIndex(idx);
        const sec = (step.duration / 1000).toFixed(2);
        setSimLogs((prev) => [...prev, `[${sec}s] ➜ ${step.log}`]);
        
        // Auto-end simulation after last step
        if (idx === flow.steps.length - 1) {
          window.setTimeout(() => {
            setActiveSim(null);
          }, 2000);
        }
      }, step.duration);
      timers.push(timer);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [activeSim]);

  // Check if a connection is active (hovered or currently in simulation)
  const isConnectionActive = (from: string, to: string) => {
    // 1. Hover state highlight
    if (hoveredNode) {
      if (from === hoveredNode || to === hoveredNode) {
        return true;
      }
    }
    
    // 2. Simulation state highlight
    if (activeSim && simStepIndex !== -1) {
      const flow = workflows[activeSim];
      
      // Highlight the paths directly connecting the nodes executed in the workflow up to current step
      const stepNodeIds = flow.steps.slice(0, simStepIndex + 1).map(s => s.nodeId);
      const fromIdx = stepNodeIds.indexOf(from);
      const toIdx = stepNodeIds.indexOf(to);
      
      if (fromIdx !== -1 && toIdx !== -1 && Math.abs(fromIdx - toIdx) <= 1) {
        return true;
      }
    }

    return false;
  };

  // Node highlight status helper
  const getNodeState = (id: string) => {
    if (activeSim && simStepIndex !== -1) {
      const currentSimNodeId = workflows[activeSim].steps[simStepIndex].nodeId;
      if (id === currentSimNodeId) return 'sim-active';
      if (workflows[activeSim].steps.slice(0, simStepIndex).some(s => s.nodeId === id)) return 'sim-passed';
    }
    if (hoveredNode === id) return 'hovered';
    if (hoveredNode) {
      const activeTech = nodes.find(n => n.id === hoveredNode);
      if (activeTech?.pairedWith.includes(nodes.find(n => n.id === id)?.name || '')) return 'paired';
      return 'dimmed';
    }
    return 'idle';
  };

  // Path generator linking coordinates relative to SVG canvas
  const renderPath = (conn: Connection) => {
    const fromRect = nodePositions[conn.from];
    const toRect = nodePositions[conn.to];
    
    if (!fromRect || !toRect || !canvasPosition) return null;

    const x1_center = fromRect.left + fromRect.width / 2 - canvasPosition.left;
    const y1_center = fromRect.top + fromRect.height / 2 - canvasPosition.top;
    const x2_center = toRect.left + toRect.width / 2 - canvasPosition.left;
    const y2_center = toRect.top + toRect.height / 2 - canvasPosition.top;

    const isHorizontal = Math.abs(x1_center - x2_center) > Math.abs(y1_center - y2_center);

    let x1 = x1_center;
    let y1 = y1_center;
    let x2 = x2_center;
    let y2 = y2_center;

    if (isHorizontal) {
      if (x1_center < x2_center) {
        x1 = fromRect.right - canvasPosition.left;
        x2 = toRect.left - canvasPosition.left;
      } else {
        x1 = fromRect.left - canvasPosition.left;
        x2 = toRect.right - canvasPosition.left;
      }
    } else {
      if (y1_center < y2_center) {
        y1 = fromRect.bottom - canvasPosition.top;
        y2 = toRect.top - canvasPosition.top;
      } else {
        y1 = fromRect.top - canvasPosition.top;
        y2 = toRect.bottom - canvasPosition.top;
      }
    }

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    
    let path = '';
    if (isHorizontal) {
      const offset = dx * 0.45;
      path = `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2} ${y2}`;
    } else {
      const offset = dy * 0.45;
      path = `M ${x1} ${y1} C ${x1} ${y1 + offset}, ${x2} ${y2 - offset}, ${x2} ${y2}`;
    }

    const active = isConnectionActive(conn.from, conn.to);
    const fromNode = nodes.find(n => n.id === conn.from);
    const activeColor = fromNode?.color || '#FF00C7';

    return (
      <g key={`${conn.from}-${conn.to}`}>
        {/* Base connection path */}
        <path
          d={path}
          fill="none"
          stroke={active ? activeColor : 'rgba(255, 255, 255, 0.05)'}
          strokeWidth={active ? 2.5 : 1}
          className="transition-all duration-300"
        />

        {/* Pulse effect overlay on active routes */}
        {active && (
          <path
            d={path}
            fill="none"
            stroke={activeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            className="animate-pulse opacity-40 blur-[1px]"
          />
        )}

        {/* Moving glowing dot along the path during active/simulation state */}
        {active && (
          <motion.circle
            r="4"
            fill={activeColor}
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{
              duration: 2.2,
              ease: "easeInOut",
              repeat: Infinity
            }}
            style={{
              offsetPath: `path('${path}')`,
              filter: `drop-shadow(0 0 6px ${activeColor})`
            }}
          />
        )}
      </g>
    );
  };

  const currentHoveredNodeData = nodes.find(n => n.id === hoveredNode);

  return (
    <section 
      ref={containerRef}
      className="bg-[#0C0C0C] text-[#D7E2EA] pb-24 md:pb-32 w-full relative select-none"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-5 h-5 text-[#FF00C7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-mono text-[#D7E2EA]/50 uppercase tracking-widest text-[10px] sm:text-xs">
              System Architecture Blueprint
            </span>
            <div className="flex-grow h-[1px] bg-white/5" />
          </div>
          
          <h3 className="text-white font-extrabold uppercase text-xl sm:text-2xl md:text-3xl tracking-wider mb-3">
            Full-Stack Integration Map
          </h3>
          <p className="text-[#D7E2EA]/60 text-xs sm:text-sm font-light leading-relaxed max-w-3xl">
            This diagram maps out my core technical toolkits aligned in a structured architecture grid. Hover over any node to trace dependency paths, or trigger a simulator to trace a live data pipeline.
          </p>
        </div>

        {/* WORKFLOW SIMULATOR CONTROLLERS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12 bg-[#121212]/30 border border-white/5 p-4 rounded-3xl backdrop-blur-md">
          {Object.entries(workflows).map(([key, flow]) => {
            const isRunning = activeSim === key;
            return (
              <button
                key={key}
                disabled={activeSim !== null && !isRunning}
                onClick={() => setActiveSim(isRunning ? null : key)}
                className={`flex flex-col gap-1.5 p-4 rounded-2xl border text-left transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${
                  isRunning 
                    ? 'bg-[#FF00C7]/15 border-[#FF00C7] shadow-[0_0_15px_rgba(255,0,199,0.15)]' 
                    : 'bg-[#121212]/50 border-white/5 hover:border-white/10 hover:bg-[#121212]/80'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#D7E2EA]/40">
                    Workflow Simulation
                  </span>
                  {isRunning && (
                    <span className="w-2.5 h-2.5 bg-[#FF00C7] rounded-full animate-ping" />
                  )}
                </div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wide">
                  {flow.name}
                </h4>
                <p className="text-[#D7E2EA]/50 text-[10px] font-light leading-normal">
                  {flow.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* BLUEPRINT BOARD CONTENT CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full relative">
          
          {/* LEFT COLUMN: INTERACTIVE BLUEPRINT CANVAS (8/12 Columns) */}
          <div className="lg:col-span-8 flex flex-col bg-[#121212]/15 border border-white/5 rounded-3xl p-5 sm:p-7 relative min-h-[500px] overflow-hidden">
            
            {/* Column Headers: desktop-only alignment row */}
            <div className="hidden md:grid grid-cols-4 w-full text-center mb-6 z-10 relative pb-2 border-b border-white/5">
              <span className="font-mono text-[9px] text-[#D7E2EA]/35 uppercase tracking-widest">Client UI</span>
              <span className="font-mono text-[9px] text-[#D7E2EA]/35 uppercase tracking-widest">APIs & Gateways</span>
              <span className="font-mono text-[9px] text-[#D7E2EA]/35 uppercase tracking-widest">AI & Inference</span>
              <span className="font-mono text-[9px] text-[#D7E2EA]/35 uppercase tracking-widest">Storage & Cloud</span>
            </div>

            {/* SVG Connector overlay behind node boxes */}
            <svg
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              style={{ mixBlendMode: 'screen' }}
            >
              {connections.map((conn) => renderPath(conn))}
            </svg>

            {/* Flat 4x3 Grid (Row-major: Client -> Gateway -> AI -> DB) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 w-full z-10 relative my-auto">
              {nodes.map((node) => {
                const nodeState = getNodeState(node.id);
                const isSimActive = nodeState === 'sim-active';
                const isSimPassed = nodeState === 'sim-passed';
                
                // Determine indicator status dot color
                let dotClass = 'bg-white/20';
                if (isSimActive) dotClass = 'bg-[#FF00C7] animate-pulse shadow-[0_0_8px_#FF00C7]';
                else if (isSimPassed) dotClass = 'bg-emerald-400 shadow-[0_0_8px_#34d399]';
                else if (nodeState === 'hovered') dotClass = 'shadow-[0_0_8px_currentColor]';
                
                return (
                  <div
                    key={node.id}
                    id={`node-${node.id}`}
                    onMouseEnter={() => !activeSim && setHoveredNode(node.id)}
                    onMouseLeave={() => !activeSim && setHoveredNode(null)}
                    className={`flex flex-col items-center gap-2 px-3 py-4 rounded-2xl bg-[#121212] border backdrop-blur-md transition-all duration-300 cursor-crosshair text-center relative w-full ${
                      nodeState === 'hovered' ? 'border-white/20' : 'border-white/5'
                    } ${nodeState === 'dimmed' ? 'opacity-25 scale-95' : 'opacity-100 scale-100'} ${
                      isSimActive ? 'ring-2 ring-offset-2 ring-offset-black ring-[#FF00C7]' : ''
                    }`}
                    style={{
                      borderColor: nodeState === 'hovered' || isSimActive ? node.color : 'rgba(255,255,255,0.05)',
                      boxShadow: nodeState === 'hovered' || isSimActive
                        ? `0 0 25px ${node.color}25` 
                        : isSimPassed 
                        ? `0 0 10px ${node.color}15`
                        : 'none',
                    }}
                  >
                    {/* Glowing status indicator dot in node corner */}
                    <div className="absolute top-2.5 right-2.5 flex items-center justify-center">
                      <span 
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${dotClass}`} 
                        style={{ color: node.color }} 
                      />
                    </div>

                    {/* Node Brand Vector Icon */}
                    <div 
                      className="p-2.5 rounded-xl bg-[#181818] border border-white/5 transition-colors duration-300"
                      style={{ color: nodeState === 'hovered' || isSimActive || isSimPassed ? node.color : '#D7E2EA' }}
                    >
                      {node.icon}
                    </div>

                    {/* Node Label Details */}
                    <div className="flex flex-col gap-0.5 mt-1">
                      <span className="text-white font-extrabold text-[11px] sm:text-xs tracking-wider uppercase">
                        {node.name}
                      </span>
                      <span className="font-mono text-[8px] text-[#D7E2EA]/40 uppercase tracking-wide md:hidden">
                        {node.column}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT COLUMN: DETAIL DESCRIPTIONS / SIMULATOR LOGS (4/12 Columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Terminal Pipeline Simulator Log */}
            <div className="bg-[#0e0e0e] border border-white/5 rounded-3xl p-5 flex flex-col gap-4 font-mono h-[240px] shadow-lg relative overflow-hidden group">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full opacity-60" />
                  <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full opacity-60" />
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full opacity-60" />
                </div>
                <span className="text-[10px] text-[#D7E2EA]/30 uppercase tracking-widest">
                  Pipeline Shell
                </span>
              </div>
              
              <div className="flex-grow overflow-y-auto flex flex-col gap-2.5 text-[10px] sm:text-[11px] text-[#D7E2EA]/60 leading-normal scrollbar-none">
                {simLogs.length === 0 ? (
                  <div className="text-[#D7E2EA]/30 italic h-full flex items-center justify-center text-center">
                    Select a workflow above to execute a system data pipeline trace.
                  </div>
                ) : (
                  simLogs.map((log, lIdx) => (
                    <motion.div 
                      key={lIdx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-emerald-400 font-mono"
                    >
                      {log}
                    </motion.div>
                  ))
                )}
              </div>
              
              {activeSim && (
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-[#FF00C7] font-semibold bg-[#FF00C7]/10 px-2 py-1 rounded-md border border-[#FF00C7]/20">
                  <span className="w-1.5 h-1.5 bg-[#FF00C7] rounded-full animate-ping" />
                  Streaming Logs...
                </div>
              )}
            </div>

            {/* Dynamic Toolkit Info panel */}
            <div className="flex-grow bg-[#121212]/30 border border-white/5 rounded-3xl p-6 flex flex-col gap-5 backdrop-blur-md min-h-[260px] justify-center">
              <AnimatePresence mode="wait">
                {currentHoveredNodeData ? (
                  <motion.div
                    key={currentHoveredNodeData.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div 
                        className="p-3 rounded-2xl bg-[#161616] border border-white/5 shadow-md"
                        style={{ color: currentHoveredNodeData.color }}
                      >
                        {currentHoveredNodeData.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#D7E2EA]/50">
                          {currentHoveredNodeData.category}
                        </span>
                        <h4 className="text-white font-black uppercase text-base tracking-wider mt-0.5">
                          {currentHoveredNodeData.name}
                        </h4>
                      </div>
                    </div>

                    <p className="text-[#D7E2EA]/75 text-xs font-light leading-relaxed">
                      {currentHoveredNodeData.description}
                    </p>

                    <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#D7E2EA]/40">
                        Common Integrations
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentHoveredNodeData.pairedWith.map((pair) => (
                          <span
                            key={pair}
                            className="bg-[#181818] border border-white/5 text-[#D7E2EA]/80 text-[9px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md"
                          >
                            {pair}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-6 flex flex-col items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full border border-dashed border-white/10 flex items-center justify-center text-[#D7E2EA]/30">
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(45 12 12)" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-[#D7E2EA]/70 font-bold text-xs uppercase tracking-wider">
                        Inspector Node Panel
                      </h4>
                      <p className="text-[#D7E2EA]/40 text-[10px] font-light leading-normal max-w-[200px] mx-auto mt-1">
                        Hover over any grid node to view deep integrations and architectural features.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

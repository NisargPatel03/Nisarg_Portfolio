import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TechNode {
  id: string;
  name: string;
  symbol: string;
  category: string;
  group: 'client' | 'backend' | 'ai' | 'data' | 'languages';
  color: string;
  description: string;
  pairedWith: string[];
  subskills: string[];
  // Physics parameters (handled in refs for performance)
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
}

interface Connection {
  from: string;
  to: string;
}

interface MicroParticle {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  life: number; // decays from 1.0 to 0.0
  decay: number;
  parentTechId: string;
}

interface SimStep {
  nodeId: string;
  log: string;
  duration: number; // delay in ms
}

interface SimulationFlow {
  name: string;
  description: string;
  steps: SimStep[];
}

export const ArchitectureSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const nodesRef = useRef<TechNode[]>([]);
  const microParticlesRef = useRef<MicroParticle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const rotationRef = useRef<number>(0);

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeSim, setActiveSim] = useState<string | null>(null);
  const [simStepIndex, setSimStepIndex] = useState<number>(-1);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const hoveredNodeIdRef = useRef<string | null>(null);
  const activeSimRef = useRef<string | null>(null);
  const simStepIndexRef = useRef<number>(-1);

  useEffect(() => {
    hoveredNodeIdRef.current = hoveredNodeId;
  }, [hoveredNodeId]);

  useEffect(() => {
    activeSimRef.current = activeSim;
  }, [activeSim]);

  useEffect(() => {
    simStepIndexRef.current = simStepIndex;
  }, [simStepIndex]);

  // List of all 27 technical skills mapped from Nisarg's portfolio
  const staticNodesData = [
    // --- 1. CLIENT CORE ---
    {
      id: 'react',
      name: 'React',
      symbol: 'Re',
      category: 'Web App Engine',
      group: 'client' as const,
      color: '#00D8FF',
      description: 'Used for crafting responsive, component-driven web interfaces, state management pipelines, and interactive dashboards.',
      pairedWith: ['TypeScript', 'Zustand', 'Tailwind CSS'],
      subskills: ['Context API', 'Zustand', 'Hooks', 'Chart.js', 'Recharts']
    },
    {
      id: 'flutter',
      name: 'Flutter',
      symbol: 'Fl',
      category: 'Mobile SDK',
      group: 'client' as const,
      color: '#02569B',
      description: 'Engine for compiling native cross-platform mobile apps for iOS and Android from a single Dart codebase.',
      pairedWith: ['Dart', 'Supabase', 'REST APIs'],
      subskills: ['Widgets', 'Pub.dev', 'Cupertino', 'State Management']
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      symbol: 'Ts',
      category: 'Type Safety',
      group: 'client' as const,
      color: '#3178C6',
      description: 'Brings type integrity and OOP practices to frontend modules, protecting app architectures against unexpected regressions.',
      pairedWith: ['React', 'Node.js', 'Express'],
      subskills: ['Interfaces', 'Generics', 'Union Types', 'Compiler']
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      symbol: 'Tw',
      category: 'Utility Styling',
      group: 'client' as const,
      color: '#38BDF8',
      description: 'A utility-first CSS framework for rapid UI styling, custom configurations, and responsive systems.',
      pairedWith: ['React', 'Framer Motion'],
      subskills: ['Flexbox', 'Grid', 'Utility Classes', 'JIT Compiler']
    },
    {
      id: 'framer',
      name: 'Framer Motion',
      symbol: 'Fm',
      category: 'Motion Physics',
      group: 'client' as const,
      color: '#FF00C7',
      description: 'Production-ready motion library for React, powering high-fidelity animations and scroll-linked transitions.',
      pairedWith: ['React', 'Tailwind CSS'],
      subskills: ['AnimatePresence', 'motion.div', 'Spring', 'LayoutId']
    },
    {
      id: 'redux',
      name: 'Redux',
      symbol: 'Rx',
      category: 'State Store',
      group: 'client' as const,
      color: '#764ABC',
      description: 'Global state management library commonly paired with React for predictable state updates and debugging.',
      pairedWith: ['React', 'TypeScript'],
      subskills: ['Redux Toolkit', 'Actions', 'Reducers', 'Thunks']
    },
    {
      id: 'context',
      name: 'Context API',
      symbol: 'Cx',
      category: 'State Propagation',
      group: 'client' as const,
      color: '#61DAFB',
      description: 'React’s built-in state propagation system, eliminating prop drilling in complex component trees.',
      pairedWith: ['React', 'JavaScript'],
      subskills: ['useContext', 'Providers', 'State sharing']
    },

    // --- 2. APIS & RUNTIMES ---
    {
      id: 'nodejs',
      name: 'Node.js',
      symbol: 'Nj',
      category: 'Server Runtime',
      group: 'backend' as const,
      color: '#339933',
      description: 'Core runtime for scaling server environments, handling non-blocking WebSockets, and running REST API logic.',
      pairedWith: ['Express', 'MongoDB', 'Supabase'],
      subskills: ['V8 Engine', 'Event Loop', 'NPM', 'HTTP Modules']
    },
    {
      id: 'express',
      name: 'Express',
      symbol: 'Ex',
      category: 'API Routing',
      group: 'backend' as const,
      color: '#828282',
      description: 'Lightweight web framework utilized to build secure endpoints, orchestrate middleware, and manage REST requests.',
      pairedWith: ['Node.js', 'MongoDB', 'TypeScript'],
      subskills: ['Middleware', 'Router', 'JWT Auth', 'CORS Config']
    },
    {
      id: 'php',
      name: 'PHP',
      symbol: 'Ph',
      category: 'Server Scripting',
      group: 'backend' as const,
      color: '#777BB4',
      description: 'Used for scripting on-premise local dashboards, local database integration, and legacy blood bank systems.',
      pairedWith: ['MySQL', 'Bootstrap', 'XAMPP'],
      subskills: ['PDO', 'Sessions', 'Composer', 'Apache']
    },
    {
      id: 'xampp',
      name: 'XAMPP',
      symbol: 'Xa',
      category: 'Dev Environment',
      group: 'backend' as const,
      color: '#FB7A24',
      description: 'Local development environment compiling Apache, MariaDB/MySQL, and PHP scripts.',
      pairedWith: ['PHP', 'MySQL'],
      subskills: ['Apache Server', 'Control Panel', 'Localhost', 'phpMyAdmin']
    },
    {
      id: 'excel',
      name: 'Excel API',
      symbol: 'Xl',
      category: 'Data Exporter',
      group: 'backend' as const,
      color: '#107C41',
      description: 'API endpoints integrated to read, write, and export spreadsheet invoices for POS inventory controllers.',
      pairedWith: ['React', 'Supabase'],
      subskills: ['SheetJS', 'CSV Parsing', 'Blob Downloads', 'File System']
    },

    // --- 3. AI & INTELLIGENCE ---
    {
      id: 'python',
      name: 'Python',
      symbol: 'Py',
      category: 'Scientific Logic',
      group: 'ai' as const,
      color: '#3776AB',
      description: 'Primary script environment for cleaning data sets, constructing predictive analytics, and loading neural models.',
      pairedWith: ['TensorFlow', 'PyTorch', 'Node.js'],
      subskills: ['Pandas', 'NumPy', 'Scikit-learn', 'Anaconda']
    },
    {
      id: 'ml',
      name: 'Machine Learning',
      symbol: 'Ml',
      category: 'Statistical Math',
      group: 'ai' as const,
      color: '#FF6F00',
      description: 'Algorithmic architectures performing classification, regressions, and predictive data analytics.',
      pairedWith: ['Python', 'Deep Learning'],
      subskills: ['Linear Regression', 'SVM', 'Random Forest', 'KNN']
    },
    {
      id: 'dl',
      name: 'Deep Learning',
      symbol: 'Dl',
      category: 'Neural Networks',
      group: 'ai' as const,
      color: '#9C27B0',
      description: 'Multi-layered neural architectures solving high-dimensional computer vision and text classifications.',
      pairedWith: ['TensorFlow', 'PyTorch'],
      subskills: ['CNN', 'RNN', 'Backpropagation', 'Optimizers']
    },
    {
      id: 'tensorflow',
      name: 'TensorFlow',
      symbol: 'Tf',
      category: 'Tensor Flowing',
      group: 'ai' as const,
      color: '#FF9900',
      description: 'Powerhouse ML library used for compiling neural classifications and hosting inference models.',
      pairedWith: ['Python', 'Deep Learning'],
      subskills: ['Keras', 'Neural Layers', 'Conv2D', 'Tensorboard']
    },
    {
      id: 'pytorch',
      name: 'PyTorch',
      symbol: 'Pt',
      category: 'Dynamic Graph ML',
      group: 'ai' as const,
      color: '#EE4C2C',
      description: 'An open-source machine learning library used for training deep neural networks, computer vision, and NLP models.',
      pairedWith: ['Python', 'TensorFlow'],
      subskills: ['Tensors', 'Autograd', 'TorchVision', 'NLP Models']
    },

    // --- 4. DATA & CLOUD ---
    {
      id: 'mongodb',
      name: 'MongoDB',
      symbol: 'Mg',
      category: 'NoSQL Storage',
      group: 'data' as const,
      color: '#47A248',
      description: 'Document database hosting complex user profiles, application logs, and message boards for web portals.',
      pairedWith: ['Node.js', 'Express', 'React'],
      subskills: ['Mongoose', 'BSON Schema', 'Aggregations', 'Indexing']
    },
    {
      id: 'supabase',
      name: 'Supabase',
      symbol: 'Sb',
      category: 'Cloud Postgres',
      group: 'data' as const,
      color: '#3ECF8E',
      description: 'Backend-as-a-service cloud provider, delivering real-time PostgreSQL listeners, Edge functions, and secure authentication.',
      pairedWith: ['React', 'Flutter', 'PostgreSQL'],
      subskills: ['Realtime Sync', 'Auth GoTrue', 'PostgREST', 'Storage Buckets']
    },
    {
      id: 'mysql',
      name: 'MySQL',
      symbol: 'My',
      category: 'Relational DB',
      group: 'data' as const,
      color: '#00758F',
      description: 'Structured database manager processing ledger audits, relational user grids, and cricket tournament rosters.',
      pairedWith: ['PHP', 'Node.js', 'XAMPP'],
      subskills: ['SQL Joins', 'Triggers', 'Stored Procedures', 'Indexing']
    },
    {
      id: 'vercel',
      name: 'Vercel',
      symbol: 'Vc',
      category: 'Serverless Edge',
      group: 'data' as const,
      color: '#FFFFFF',
      description: 'Frontend cloud platform optimized for serverless deployments, edge caching, and automated Git CI/CD.',
      pairedWith: ['React', 'Git'],
      subskills: ['Edge Functions', 'CI/CD Pipelines', 'Analytics', 'DNS Routing']
    },
    {
      id: 'git',
      name: 'Git',
      symbol: 'Gt',
      category: 'Version Control',
      group: 'data' as const,
      color: '#F05032',
      description: 'Distributed version control system logging source code changes, branches, and remote repositories.',
      pairedWith: ['Vercel', 'GitHub'],
      subskills: ['Branching', 'Merging', 'Rebasing', 'Git Hooks']
    },

    // --- 5. LANGUAGES ---
    {
      id: 'cpp',
      name: 'C++',
      symbol: 'C+',
      category: 'Systems Language',
      group: 'languages' as const,
      color: '#00599C',
      description: 'Fast systems language used for algorithmic foundations, competitive programming, and Hackerrank milestones.',
      pairedWith: ['C', 'Java'],
      subskills: ['STL Libraries', 'Pointers', 'OOP', 'Memory Management']
    },
    {
      id: 'java',
      name: 'Java',
      symbol: 'Jv',
      category: 'OOP Software',
      group: 'languages' as const,
      color: '#E76F51',
      description: 'Object-oriented programming language driving cross-platform enterprise software and backend databases.',
      pairedWith: ['C++', 'SQL'],
      subskills: ['Multithreading', 'JVM Virtual Machine', 'Spring Boot', 'Collections']
    },
    {
      id: 'c',
      name: 'C',
      symbol: 'C',
      category: 'Foundations',
      group: 'languages' as const,
      color: '#A8B9CC',
      description: 'Procedural system foundation language teaching memory management and hardware-level operations.',
      pairedWith: ['C++', 'Assembly'],
      subskills: ['Pointers', 'Structs', 'Malloc/Free', 'Header Files']
    },
    {
      id: 'dart',
      name: 'Dart',
      symbol: 'Dt',
      category: 'UI Compiler',
      group: 'languages' as const,
      color: '#00B4AB',
      description: 'Client-optimized programming language compiling native mobile apps via the Flutter SDK.',
      pairedWith: ['Flutter'],
      subskills: ['Asynchronous Streams', 'AOT Compilers', 'Sound Null Safety']
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      symbol: 'Js',
      category: 'Scripting Core',
      group: 'languages' as const,
      color: '#F7DF1E',
      description: 'The core scripting engine of the web, powering frontend UI reactivity and server-side runtimes.',
      pairedWith: ['React', 'TypeScript', 'Node.js'],
      subskills: ['ES6 Syntax', 'Promises', 'Asynchronous Events', 'Closures']
    }
  ];

  // Inter-node connection paths representing architectural dependencies
  const connections: Connection[] = [
    { from: 'javascript', to: 'typescript' },
    { from: 'javascript', to: 'react' },
    { from: 'javascript', to: 'nodejs' },
    { from: 'typescript', to: 'react' },
    { from: 'typescript', to: 'nodejs' },
    { from: 'typescript', to: 'express' },
    
    { from: 'react', to: 'redux' },
    { from: 'react', to: 'context' },
    { from: 'react', to: 'tailwind' },
    { from: 'react', to: 'framer' },
    
    { from: 'nodejs', to: 'express' },
    { from: 'nodejs', to: 'mongodb' },
    { from: 'nodejs', to: 'supabase' },
    { from: 'express', to: 'mongodb' },
    { from: 'express', to: 'supabase' },
    
    { from: 'php', to: 'xampp' },
    { from: 'php', to: 'mysql' },
    { from: 'xampp', to: 'mysql' },
    { from: 'excel', to: 'supabase' },
    
    { from: 'python', to: 'ml' },
    { from: 'python', to: 'dl' },
    { from: 'python', to: 'tensorflow' },
    { from: 'python', to: 'pytorch' },
    { from: 'ml', to: 'dl' },
    { from: 'dl', to: 'tensorflow' },
    { from: 'dl', to: 'pytorch' },
    
    { from: 'flutter', to: 'dart' },
    { from: 'flutter', to: 'supabase' },
    
    { from: 'cpp', to: 'c' },
    { from: 'cpp', to: 'java' },
    { from: 'java', to: 'c' },
    
    { from: 'git', to: 'vercel' },
    { from: 'vercel', to: 'react' }
  ];

  // Live simulation workflows
  const workflows: Record<string, SimulationFlow> = {
    welfare: {
      name: 'Welfare Eligibility Profile Match',
      description: 'User submits profile (income, age) on React frontend, runs AI eligibility analysis, logs to Supabase.',
      steps: [
        { nodeId: 'react', log: 'User submits profile metrics on React frontend form', duration: 0 },
        { nodeId: 'express', log: 'Secure POST request verified by Express REST endpoints', duration: 800 },
        { nodeId: 'python', log: 'Python analysis engine initiates data cleaning & feature parsing', duration: 1600 },
        { nodeId: 'tensorflow', log: 'TensorFlow ML model outputs compatibility predictions', duration: 2400 },
        { nodeId: 'supabase', log: 'Persisting audited eligibility records inside Cloud Supabase DB', duration: 3200 },
        { nodeId: 'react', log: 'Success! Results rendered to citizen dashboard UI', duration: 4000 }
      ]
    },
    tournament: {
      name: 'Tournament Scoreboard Update',
      description: 'Referee increments scores on Flutter mobile app, logs securely to Node.js, syncing to MySQL DB.',
      steps: [
        { nodeId: 'flutter', log: 'Referee registers score events on Flutter mobile client', duration: 0 },
        { nodeId: 'nodejs', log: 'Socket event packets verified by Node.js web runtime controller', duration: 800 },
        { nodeId: 'mysql', log: 'Recording transactional ledger registers to relational MySQL', duration: 1600 },
        { nodeId: 'react', log: 'Success! Broadcaster synced updates to React spectator boards', duration: 2400 }
      ]
    },
    pos: {
      name: 'Savaliya Scoops POS Checkout',
      description: 'POS Operator initiates cash checkout on React panel, triggering local PHP logs and Excel spreadsheets.',
      steps: [
        { nodeId: 'react', log: 'POS Operator presses complete checkout button in React panel', duration: 0 },
        { nodeId: 'php', log: 'Forwarding transaction logs locally to local PHP server script', duration: 800 },
        { nodeId: 'mysql', log: 'Committing local receipt invoice orders inside MySQL database', duration: 1600 },
        { nodeId: 'excel', log: 'Success! PHP script triggers Excel API to export POS report', duration: 2400 }
      ]
    }
  };

  // Calculates gravity centers depending on screen size
  const getClusterCenters = (width: number, height: number) => {
    if (width < 640) {
      // Mobile stack layout
      return {
        client: { x: width * 0.5, y: height * 0.16 },
        backend: { x: width * 0.5, y: height * 0.36 },
        ai: { x: width * 0.5, y: height * 0.56 },
        data: { x: width * 0.5, y: height * 0.74 },
        languages: { x: width * 0.5, y: height * 0.88 }
      };
    } else {
      // Tablet/Desktop constellations
      return {
        client: { x: width * 0.22, y: height * 0.28 },
        backend: { x: width * 0.5, y: height * 0.22 },
        ai: { x: width * 0.78, y: height * 0.32 },
        data: { x: width * 0.68, y: height * 0.72 },
        languages: { x: width * 0.32, y: height * 0.72 }
      };
    }
  };

  // Initialize node arrays and start loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const centers = getClusterCenters(width, height);

    // Initialize tech nodes with positioning & velocities
    const initializedNodes: TechNode[] = staticNodesData.map((node) => {
      const center = centers[node.group];
      const offsetAngle = Math.random() * Math.PI * 2;
      const offsetDist = 30 + Math.random() * 50;
      return {
        ...node,
        x: center.x + Math.cos(offsetAngle) * offsetDist,
        y: center.y + Math.sin(offsetAngle) * offsetDist,
        vx: 0,
        vy: 0,
        baseX: center.x,
        baseY: center.y,
        radius: width < 640 ? 30 : 38
      };
    });

    nodesRef.current = initializedNodes;

    // Resizing listener
    const handleResize = () => {
      const innerCanvas = canvasRef.current;
      if (!innerCanvas) return;
      const innerParent = innerCanvas.parentElement;
      if (!innerParent) return;
      
      const newW = innerParent.clientWidth;
      const newH = innerParent.clientHeight;
      innerCanvas.width = newW;
      innerCanvas.height = newH;

      const innerCenters = getClusterCenters(newW, newH);
      nodesRef.current.forEach((n) => {
        const center = innerCenters[n.group];
        n.baseX = center.x;
        n.baseY = center.y;
        n.radius = newW < 640 ? 30 : 38;
      });
    };

    window.addEventListener('resize', handleResize);

    // Animation physics loop
    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // Clear with background opacity trail effect
      ctx.fillStyle = 'rgba(12, 12, 12, 0.22)';
      ctx.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Rotation counters for spinning UI details
      rotationRef.current += 0.015;

      // --- PHYSICS CALCULATION ---
      const activeStepNodeId = (activeSimRef.current && simStepIndexRef.current !== -1)
        ? workflows[activeSimRef.current].steps[simStepIndexRef.current].nodeId
        : null;

      nodesRef.current.forEach((node) => {
        // 1. Attraction to cluster center
        let attractionStrength = 0.008;
        if (node.id === activeStepNodeId) attractionStrength = 0.02; // Pull focused node quickly to front
        
        const dx = node.baseX - node.x;
        const dy = node.baseY - node.y;
        node.vx += dx * attractionStrength;
        node.vy += dy * attractionStrength;

        // 2. Mouse gravity pull
        if (mx !== null && my !== null) {
          const mdx = mx - node.x;
          const mdy = my - node.y;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist < 200) {
            const pull = (200 - mdist) * 0.015;
            node.vx += (mdx / mdist) * pull;
            node.vy += (mdy / mdist) * pull;
          }
        }

        // 3. Collision repulsion from other nodes
        nodesRef.current.forEach((other) => {
          if (node.id === other.id) return;
          const odx = other.x - node.x;
          const ody = other.y - node.y;
          const odist = Math.hypot(odx, ody);
          const minDist = node.radius + other.radius + 38;
          if (odist < minDist) {
            const push = (minDist - odist) * 0.018;
            const angle = Math.atan2(ody, odx);
            node.vx -= Math.cos(angle) * push;
            node.vy -= Math.sin(angle) * push;
            other.vx += Math.cos(angle) * push;
            other.vy += Math.sin(angle) * push;
          }
        });

        // 4. Update coordinates & apply damping friction
        node.vx *= 0.85;
        node.vy *= 0.85;
        node.x += node.vx;
        node.y += node.vy;

        // 5. Keep nodes inside canvas walls
        const margin = node.radius + 15;
        if (node.x < margin) { node.x = margin; node.vx *= -0.5; }
        if (node.x > w - margin) { node.x = w - margin; node.vx *= -0.5; }
        if (node.y < margin) { node.y = margin; node.vy *= -0.5; }
        if (node.y > h - margin) { node.y = h - margin; node.vy *= -0.5; }
      });

      // --- UPDATE MICRO PARTICLES (CLICK DETONATION) ---
      microParticlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Gravity pull back to parent node
        const parent = nodesRef.current.find((n) => n.id === p.parentTechId);
        if (parent && p.life < 0.6) {
          const pdx = parent.x - p.x;
          const pdy = parent.y - p.y;
          const pdist = Math.hypot(pdx, pdy);
          p.vx += (pdx / pdist) * 0.16;
          p.vy += (pdy / pdist) * 0.16;
        }

        p.life -= p.decay;
      });

      // Filter out microparticles that decayed fully
      microParticlesRef.current = microParticlesRef.current.filter((p) => p.life > 0.02);

      // --- RENDERING STATIC CONNECTIONS ---
      connections.forEach((conn) => {
        const fromNode = nodesRef.current.find((n) => n.id === conn.from);
        const toNode = nodesRef.current.find((n) => n.id === conn.to);
        if (!fromNode || !toNode) return;

        const dist = Math.hypot(fromNode.x - toNode.x, fromNode.y - toNode.y);
        const maxDist = 280;

        const isHovered = hoveredNodeIdRef.current === fromNode.id || hoveredNodeIdRef.current === toNode.id;

        if (isHovered || dist < maxDist) {
          ctx.strokeStyle = isHovered ? fromNode.color : 'rgba(255, 255, 255, 0.03)';
          ctx.lineWidth = isHovered ? 1.6 : 0.6;
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.stroke();
        }
      });

      // --- RENDERING ACTIVE SIMULATION PATH ---
      if (activeSimRef.current && simStepIndexRef.current > 0) {
        const steps = workflows[activeSimRef.current].steps;
        for (let i = 1; i <= simStepIndexRef.current; i++) {
          const prevId = steps[i - 1].nodeId;
          const currId = steps[i].nodeId;
          const prevNode = nodesRef.current.find((n) => n.id === prevId);
          const currNode = nodesRef.current.find((n) => n.id === currId);
          if (prevNode && currNode) {
            // Draw active connection line
            ctx.strokeStyle = prevNode.color;
            ctx.lineWidth = 2.2; // Thicker, glowing line for the simulation trace
            ctx.shadowColor = prevNode.color;
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.moveTo(prevNode.x, prevNode.y);
            ctx.lineTo(currNode.x, currNode.y);
            ctx.stroke();
            ctx.shadowBlur = 0; // Reset shadow

            // Draw spark for the current step
            if (i === simStepIndexRef.current) {
              const progress = (Date.now() % 1200) / 1200;
              const spx = prevNode.x + (currNode.x - prevNode.x) * progress;
              const spy = prevNode.y + (currNode.y - prevNode.y) * progress;
              ctx.fillStyle = prevNode.color;
              ctx.shadowColor = prevNode.color;
              ctx.shadowBlur = 12;
              ctx.beginPath();
              ctx.arc(spx, spy, 6, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0; // Reset shadow
            }
          }
        }
      }

      // --- RENDERING TECH NODES ---
      nodesRef.current.forEach((node) => {
        const isHovered = hoveredNodeIdRef.current === node.id;
        const isSimFocused = node.id === activeStepNodeId;
        const isSimPassed = activeSimRef.current && workflows[activeSimRef.current].steps.slice(0, simStepIndexRef.current).some((s) => s.nodeId === node.id);

        ctx.save();

        // Node Glow Backdrop
        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius + 18);
        grad.addColorStop(0, isHovered || isSimFocused ? `${node.color}35` : isSimPassed ? `${node.color}15` : `${node.color}05`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 18, 0, Math.PI * 2);
        ctx.fill();

        // Dotted Spinning Halo Outer Border
        if (isHovered || isSimFocused) {
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8, rotationRef.current, rotationRef.current + Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Base capsule pill drawing
        ctx.fillStyle = 'rgba(10, 10, 10, 0.95)';
        ctx.strokeStyle = isHovered || isSimFocused ? node.color : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = isHovered || isSimFocused ? 2.5 : 1;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isHovered || isSimFocused ? 14 : 0;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

        // Abbreviated Symbol Label in Center
        ctx.fillStyle = isHovered || isSimFocused || isSimPassed ? node.color : '#FFFFFF';
        ctx.font = `bold ${node.radius * 0.5}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.symbol, node.x, node.y - 4);

        // Subtitle Title below Symbol
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.font = `${node.radius * 0.28}px sans-serif`;
        ctx.fillText(node.name, node.x, node.y + (node.radius * 0.45));

        ctx.restore();
      });

      // --- RENDERING MICRO PARTICLES ---
      microParticlesRef.current.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        
        ctx.fillStyle = 'rgba(15, 15, 15, 0.95)';
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        
        ctx.font = '8px monospace';
        const txtWidth = ctx.measureText(p.name).width;
        const pHeight = 16;
        const pWidth = txtWidth + 14;

        ctx.beginPath();
        ctx.roundRect(p.x - pWidth / 2, p.y - pHeight / 2, pWidth, pHeight, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.name, p.x, p.y);

        ctx.restore();
      });

      // --- RENDERING CONSTELATION NAMES (Labels) ---
      if (w > 640) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.font = 'bold 9px monospace';
        ctx.letterSpacing = '1px';
        ctx.textAlign = 'center';
        ctx.fillText('CLIENT CORE', centers.client.x, centers.client.y - 100);
        ctx.fillText('APIs & RUNTIMES', centers.backend.x, centers.backend.y - 80);
        ctx.fillText('AI & INTELLIGENCE', centers.ai.x, centers.ai.y - 100);
        ctx.fillText('CLOUD & DATABASES', centers.data.x, centers.data.y + 100);
        ctx.fillText('LANGUAGES', centers.languages.x, centers.languages.y + 100);
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Track Mouse movement relative to canvas element
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    mouseRef.current = { x: mx, y: my };

    // Hover detection checks
    let foundNodeId: string | null = null;
    nodesRef.current.forEach((n) => {
      const dist = Math.hypot(n.x - mx, n.y - my);
      if (dist < n.radius + 8) {
        foundNodeId = n.id;
      }
    });

    if (foundNodeId !== hoveredNodeId) {
      setHoveredNodeId(foundNodeId);
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: null, y: null };
    setHoveredNodeId(null);
  };

  // Triggers click detonations on selected tech nodes
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    nodesRef.current.forEach((node) => {
      const dist = Math.hypot(node.x - mx, node.y - my);
      if (dist < node.radius + 8) {
        spawnMicroParticles(node);
      }
    });
  };

  const spawnMicroParticles = (node: TechNode) => {
    const skills = node.subskills;
    const count = skills.length;
    const newMicros: MicroParticle[] = skills.map((skill, idx) => {
      const angle = (idx / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 2.5 + Math.random() * 3.5;
      return {
        id: `${node.id}-micro-${idx}`,
        name: skill,
        x: node.x,
        y: node.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: node.color,
        radius: 8,
        life: 1.0,
        decay: 0.004 + Math.random() * 0.004,
        parentTechId: node.id
      };
    });

    microParticlesRef.current = [...microParticlesRef.current, ...newMicros];
  };

  // Run simulation sequence handler
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
        
        // Auto stop simulation
        if (idx === flow.steps.length - 1) {
          window.setTimeout(() => {
            setActiveSim(null);
          }, 3000);
        }
      }, step.duration);
      timers.push(timer);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [activeSim]);

  const activeHoveredNodeData = staticNodesData.find((n) => n.id === hoveredNodeId);

  return (
    <section 
      ref={containerRef}
      className="bg-[#0C0C0C] text-[#D7E2EA] pb-24 md:pb-32 w-full relative select-none overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-5 h-5 text-[#FF00C7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M9 12h6" />
            </svg>
            <span className="font-mono text-[#D7E2EA]/50 uppercase tracking-widest text-[10px] sm:text-xs">
              Cybernetic Skill Synthesizer
            </span>
            <div className="flex-grow h-[1px] bg-white/5" />
          </div>
          
          <h3 className="text-white font-extrabold uppercase text-xl sm:text-2xl md:text-3xl tracking-wider mb-3">
            Bioluminescent Neural Canvas
          </h3>
          <p className="text-[#D7E2EA]/60 text-xs sm:text-sm font-light leading-relaxed max-w-3xl">
            Explore 27 technical toolkits modeled as responsive floating nodes. Move your cursor to bend paths using gravitational force. Click any node to explode it into sub-libraries, or run pipeline workflows to trace live data packages.
          </p>
        </div>

        {/* WORKFLOW PIPELINE SIMULATORS */}
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
                    Neural Pipeline Trace
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

        {/* BLUEPRINT BOARD CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full relative">
          
          {/* PHYSICS CANVAS FIELD (8/12 Columns) */}
          <div className="lg:col-span-8 bg-[#121212]/15 border border-white/5 rounded-3xl relative overflow-hidden min-h-[580px] sm:min-h-[640px] flex items-center justify-center">
            
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleCanvasClick}
              className="absolute inset-0 w-full h-full cursor-crosshair"
            />
            
            {/* Visual indicators */}
            <div className="absolute top-4 left-4 font-mono text-[8px] text-[#D7E2EA]/30 pointer-events-none flex flex-col gap-1">
              <span>CANV: HTML5_2D_ACTIVE</span>
              <span>NODE_COUNT: 27</span>
              <span>RENDER_RATE: 120_FPS_REFRESH</span>
            </div>
            
          </div>

          {/* TELEMETRY INSPECTOR & CLI TERMINAL (4/12 Columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Console Log Terminal */}
            <div className="bg-[#0e0e0e] border border-white/5 rounded-3xl p-5 flex flex-col gap-4 font-mono h-[240px] shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full opacity-60" />
                  <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full opacity-60" />
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full opacity-60" />
                </div>
                <span className="text-[10px] text-[#D7E2EA]/35 uppercase tracking-widest">
                  Pipeline Shell
                </span>
              </div>
              
              <div className="flex-grow overflow-y-auto flex flex-col gap-2.5 text-[10.5px] text-[#D7E2EA]/60 leading-normal scrollbar-none">
                {simLogs.length === 0 ? (
                  <div className="text-[#D7E2EA]/30 italic h-full flex items-center justify-center text-center">
                    Select a pipeline trace above to watch real-time connection signals travel down the network synapses.
                  </div>
                ) : (
                  simLogs.map((log, lIdx) => (
                    <motion.div 
                      key={lIdx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
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
                  Pulse Streaming
                </div>
              )}
            </div>

            {/* Dynamic Glass Toolkit Info Panel */}
            <div className="flex-grow bg-[#121212]/30 border border-white/5 rounded-3xl p-6 flex flex-col gap-5 backdrop-blur-md min-h-[280px] justify-center">
              <AnimatePresence mode="wait">
                {activeHoveredNodeData ? (
                  <motion.div
                    key={activeHoveredNodeData.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div 
                        className="p-3 rounded-2xl bg-[#161616] border border-white/5 shadow-md flex items-center justify-center w-12 h-12 text-lg font-black font-mono"
                        style={{ color: activeHoveredNodeData.color, borderColor: activeHoveredNodeData.color }}
                      >
                        {activeHoveredNodeData.symbol}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#D7E2EA]/50">
                          {activeHoveredNodeData.category}
                        </span>
                        <h4 className="text-white font-black uppercase text-base tracking-wider mt-0.5">
                          {activeHoveredNodeData.name}
                        </h4>
                      </div>
                    </div>

                    <p className="text-[#D7E2EA]/75 text-xs font-light leading-relaxed">
                      {activeHoveredNodeData.description}
                    </p>

                    <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#D7E2EA]/40">
                        Constellation Partners
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeHoveredNodeData.pairedWith.map((pair) => (
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
                        Telemetry HUD Inspector
                      </h4>
                      <p className="text-[#D7E2EA]/40 text-[10px] font-light leading-normal max-w-[220px] mx-auto mt-1">
                        Hover over any glowing synapse to read telemetry. Click nodes to release microparticle sub-libraries!
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

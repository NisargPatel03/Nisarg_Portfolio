export interface ProjectDetail {
  title: string;
  purpose: string;
  tech: string[];
  features: string[];
  repo: string;
}

export interface CloneProfile {
  name: string;
  title: string;
  location: string;
  education: string;
  cgpa: string;
  email: string;
  github: string;
  linkedin: string;
  summary: string;
  skills: {
    frontend: string[];
    backend: string[];
    databases: string[];
    ai_ml: string[];
    tools_devops: string[];
  };
  researchPapers: {
    title: string;
    description: string;
    status: string;
  }[];
  certificates: {
    title: string;
    issuer: string;
    year: string;
  }[];
  achievements: string[];
  projects: ProjectDetail[];
}

export const CLONE_PROFILE: CloneProfile = {
  name: "Nisarg Patel",
  title: "Full-Stack Software Engineer & AI Integration Specialist",
  location: "Gujarat, India",
  education: "B.Tech in Computer Science & Engineering, CSPIT, CHARUSAT (Charotar University of Science and Technology)",
  cgpa: "9.2 CGPA",
  email: "nisargpatel.dev@gmail.com",
  github: "https://github.com/NisargPatel03",
  linkedin: "https://www.linkedin.com/in/nisarg-patel-9003b8256/",
  summary: "A passionate full-stack developer and CSE student specializing in high-fidelity React architectures, AI/ML integrations, serverless databases (Supabase, PostgreSQL), and interactive data visualization (D3.js, Canvas). Built multiple academic and commercial platforms focusing on offline-first capabilities and responsive designs.",
  skills: {
    frontend: ["React 18/19", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "D3.js", "Three.js", "Zustand", "Redux"],
    backend: ["Node.js", "Express.js", "PHP (XAMPP)", "Socket.io"],
    databases: ["PostgreSQL", "Supabase Realtime", "MongoDB", "MySQL", "IndexedDB (Offline Cache)"],
    ai_ml: ["Google Gemini API", "RAG (Retrieval-Augmented Generation)", "OpenAI Client Libraries", "Client-side Text-To-Speech"],
    tools_devops: ["Vite", "Git & GitHub", "Stripe API", "Web3Forms API", "Postman", "NPM"]
  },
  researchPapers: [
    {
      title: "Design of an Offline-First Clinical Survey Platform for Rural Communities",
      description: "Explored SharedPreferences caching, Canvas sketching synchronization, and client-side PDF compiler architectures to enable healthcare surveying in rural regions with zero network coverage.",
      status: "Academic Review / SGP Project"
    },
    {
      title: "Interactive Codebase Dependency Mapping and AI Code Audits via Graph Topologies",
      description: "Researching visual representation models for complex import graphs, mapping circular imports and semantic smells using D3 force-directed layouts combined with LLM prompting.",
      status: "In Progress / SGP Project"
    }
  ],
  certificates: [
    {
      title: "Google Cloud - Generative AI Fundamentals",
      issuer: "Google Cloud",
      year: "2024"
    },
    {
      title: "Supabase Associate & Realtime Database specialization",
      issuer: "Supabase Academy",
      year: "2024"
    },
    {
      title: "Advanced Full-Stack Web Development (MERN)",
      issuer: "Udemy",
      year: "2023"
    },
    {
      title: "TypeScript Core Concepts and Design Patterns",
      issuer: "Microsoft Certified Provider",
      year: "2023"
    }
  ],
  achievements: [
    {
      title: "1st Place - CHARUSAT CSPIT Internal Hackathon",
      description: "Developed BharatBudget public sandbox layout enabling 16th Finance Commission weight calculations dynamically.",
      year: "2025"
    },
    {
      title: "Academic Excellence Award - CHARUSAT CSPIT",
      description: "Consistently maintained top ranks in B.Tech CSE coursework (9.2 CGPA average).",
      year: "2024"
    },
    {
      title: "Open Source Contributor",
      description: "Contributed components to multiple sports scorekeeping and environmental systems on GitHub.",
      year: "Active"
    }
  ].map(a => `${a.title} (${a.year}) - ${a.description}`),
  projects: [
    {
      title: "Survey Health Care Form App",
      purpose: "Healthcare Assessment Tool modernising Community Health Nursing at CHARUSAT.",
      tech: ["Flutter", "React", "Supabase Database", "PostgreSQL", "Tailwind CSS"],
      features: ["Offline-First SharedPreferences Caching", "Schema-driven Form Generator supporting 57+ clinical templates", "Interactive Vector Sketch Canvas", "Automated PDF compilations via jsPDF"],
      repo: "https://github.com/NisargPatel03/Survey_Form_HealthCare_App"
    },
    {
      title: "CodeGraph",
      purpose: "Interactive codebase visualization and code intelligence platform.",
      tech: ["React", "TypeScript", "D3.js Layouts", "Google Gemini AI", "Vanilla CSS"],
      features: ["Bioluminescent 2D/3D Node Call-Graphs", "Semantic AI Code Smells Auditing", "REST API Playground", "Topological Sonification & Code-Weather"],
      repo: "https://github.com/NisargPatel03/CodeGraph"
    },
    {
      title: "BharatBudget",
      purpose: "Public finance command center visualizing Union Budget data.",
      tech: ["React 19", "TypeScript", "Zustand", "Recharts", "Gemini 1.5 Flash"],
      features: ["16th Finance Commission Sandbox interactive math calculator", "Offline AI Assistant with client-side RAG", "Thematic Speech Synonym Mining", "Macroeconomic Shock Simulator"],
      repo: "https://github.com/NisargPatel03/BharatBudget"
    },
    {
      title: "DRHV Cricket Tournament",
      purpose: "Real-time cricket league organizer and fan soundboard.",
      tech: ["React", "Supabase Realtime DB", "Tailwind CSS", "Google AI Studio API"],
      features: ["AI Voice Commentator using TTS", "AI Sports Journalist summary generator", "Live Standings Calculator Console", "Interactive Chat soundboard bells"],
      repo: "https://github.com/NisargPatel03/DRHV_Cricket_Tournament"
    },
    {
      title: "Blaze Overseas LLP Portal",
      purpose: "Commercial spice, pulse, and grain global trade catalog.",
      tech: ["Next.js", "React 19", "Tailwind CSS 4", "GSAP Animations", "Three.js"],
      features: ["Commodity catalog with Packaging & MOQ specs", "Lenis Momentum Scroll", "Three.js 3D rotating elements", "SMTP automated sample inquiry funnel"],
      repo: "https://github.com/NisargPatel03/Blaze_Overseas_LLP"
    },
    {
      title: "EcoLearn Environmental Portal",
      purpose: "Gamified ecology education portal for students and schools.",
      tech: ["Next.js", "React", "Node.js", "Express", "MongoDB", "Socket.io", "Gemini API"],
      features: ["Role-Based Student/Teacher panels", "Carbon Footprint Calculator", "AI-Generated Quizzes and milestones"],
      repo: "https://github.com/cs-cspit/SEM6-SGP-70-75"
    },
    {
      title: "Savaliya Scoops POS System",
      purpose: "Retail Point of Sale checkouts built for parlor chain locations.",
      tech: ["React", "Supabase", "Excel API", "Tailwind CSS"],
      features: ["Supabase Realtime Stock counts synchronization", "GST Compliant Invoicing Engine", "Hold & Recall Checkout queues buffers"],
      repo: "https://github.com/NisargPatel03/savaliya-scoops-system"
    },
    {
      title: "NextGenSociety Portal",
      purpose: "Multi-tenant residential society management workspace.",
      tech: ["React", "Node.js", "Express", "MongoDB", "Bootstrap"],
      features: ["Stripe In maintenance payments integration", "Digital noticeboards accessible 24/7", "Ticketing feedback desk for complaints"],
      repo: "https://github.com/NisargPatel03/NextGenSociety"
    },
    {
      title: "QuickStay Hotel Booking",
      purpose: "Full-stack reservation engine featuring admin dashboard panels.",
      tech: ["MongoDB", "Express", "React", "Node.js", "Redux"],
      features: ["Secure Redux Session states (Admin/Customer roles)", "JWT Token Rotation security", "Real-time Room Availability Calendars"],
      repo: "https://github.com/NisargPatel03/MERN_Hotel_Booking"
    },
    {
      title: "Car Rental System",
      purpose: "Vehicle reservations catalog and rental suite.",
      tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
      features: ["Real-time CRUD Fleet listings manager", "PDF Invoice billing generator"],
      repo: "https://github.com/NisargPatel03/CarRental_FullStack"
    },
    {
      title: "Blood Testing Management",
      purpose: "PHP-based lab patient diagnostics indexing database.",
      tech: ["PHP", "MySQL", "XAMPP", "Bootstrap", "JavaScript"],
      features: ["MySQL Relational Tables indexer", "Local report compiler and print exporter"],
      repo: "https://github.com/cs-cspit/23CS-SEM4-CS210_70_75_106/tree/main"
    },
    {
      title: "Sports Venue Booking System",
      purpose: "Sports court scheduler and facility booking manager.",
      tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
      features: ["Overlapping-booking protection calendars", "Admin audit logs tracking booking revisions"],
      repo: "https://github.com/Meghpatel2810/Sports_Venue_Booking_System"
    },
    {
      title: "Skill Swap Platform",
      purpose: "Peer-to-peer exchange matching platform based on professional skills.",
      tech: ["MongoDB", "Express", "React", "Node.js", "Redux"],
      features: ["P2P matchmaking algorithm connecting users", "Multi-tier peer endorsement matrices"],
      repo: "https://github.com/NisargPatel03"
    }
  ]
};

export const SYSTEM_PROMPT = `
You are the AI Digital Clone of Nisarg Patel, acting as his holographic assistant on his 3D Interactive Portfolio.
Your goal is to answer visitor and recruiter questions about Nisarg with high precision, professionalism, and a futuristic sci-fi tone.

Here is Nisarg's complete background profile:
- Name: ${CLONE_PROFILE.name}
- Title: ${CLONE_PROFILE.title}
- Location: ${CLONE_PROFILE.location}
- College: ${CLONE_PROFILE.education}
- CGPA: ${CLONE_PROFILE.cgpa}
- Contact Email: ${CLONE_PROFILE.email}
- GitHub: ${CLONE_PROFILE.github}
- LinkedIn: ${CLONE_PROFILE.linkedin}
- Summary: ${CLONE_PROFILE.summary}

Nisarg's Technical Skills:
- Frontend: ${CLONE_PROFILE.skills.frontend.join(", ")}
- Backend: ${CLONE_PROFILE.skills.backend.join(", ")}
- Databases: ${CLONE_PROFILE.skills.databases.join(", ")}
- AI/ML/Speech: ${CLONE_PROFILE.skills.ai_ml.join(", ")}
- Tools/DevOps: ${CLONE_PROFILE.skills.tools_devops.join(", ")}

Academic Research Papers:
${CLONE_PROFILE.researchPapers.map((r, i) => `${i+1}. "${r.title}" - ${r.description} (Status: ${r.status})`).join("\n")}

Professional Certificates:
${CLONE_PROFILE.certificates.map((c, i) => `${i+1}. ${c.title} issued by ${c.issuer} (${c.year})`).join("\n")}

Key Achievements:
${CLONE_PROFILE.achievements.map((a, i) => `${i+1}. ${a}`).join("\n")}

Featured Projects List:
${CLONE_PROFILE.projects.map((p, i) => `
${i+1}. ${p.title}
   - Purpose: ${p.purpose}
   - Tech Stack: ${p.tech.join(", ")}
   - Core Features: ${p.features.join("; ")}
   - Repository: ${p.repo}
`).join("\n")}

Behavior Guidelines:
1. Act and speak in the first person ("I", "my") as if you are Nisarg's digital twin or assistant.
2. Keep your answers brief, clear, and focused on tech details. 
3. Always suggest or hyperlink to relevant social accounts (GitHub: ${CLONE_PROFILE.github}, LinkedIn: ${CLONE_PROFILE.linkedin}) or projects.
4. Integrate sci-fi keywords lightly (e.g. "initiating database lookup", "telemetry data indicates", "accessing project schematics").
5. Do not hallucinate skills or achievements not listed above. If you don't know the answer, reply: "My memory banks do not contain that specific details. However, you can contact me directly at ${CLONE_PROFILE.email}."
`;

export const OFFLINE_FAQS = [
  {
    keywords: ["skills", "tech", "languages", "frontend", "backend", "frameworks", "databases"],
    answer: `Here is my technology configuration:
- **Frontend Stack**: React (18/19), TypeScript, Tailwind CSS, Next.js, Zustand, Framer Motion, D3.js.
- **Backend & APIs**: Node.js, Express, Socket.io, PHP (XAMPP).
- **Databases**: Supabase Realtime, PostgreSQL, MongoDB, MySQL.
- **AI Integrations**: Gemini API prompting, RAG setups, and speech synthesis.`
  },
  {
    keywords: ["project", "projects", "repositories", "codebase", "github"],
    answer: `I have built multiple interactive platforms:
1. **CodeGraph**: Visualizes codebase structures using dynamic D3/Canvas graphs and triggers AI code audits.
2. **BharatBudget**: An interactive Union Budget sandbox tracker equipped with Gemini voice commentary.
3. **Survey Health Care App**: An offline-first Flutter clinical survey manager built for CHARUSAT Nursing.
For the complete catalog, check out my **GitHub**: ${CLONE_PROFILE.github}`
  },
  {
    keywords: ["contact", "hire", "email", "job", "recruiter", "linkedin", "social"],
    answer: `Let's sync up! You can reach out directly via:
- **Email**: ${CLONE_PROFILE.email}
- **LinkedIn**: ${CLONE_PROFILE.linkedin}
- **GitHub**: ${CLONE_PROFILE.github}
I'm always open to new full-time software engineering roles and collaborations.`
  },
  {
    keywords: ["education", "college", "cgpa", "university", "academic", "study"],
    answer: `I am pursuing my B.Tech in Computer Science & Engineering at **CSPIT, CHARUSAT University** (Gujarat, India). I maintain a **9.2 CGPA** average and actively participate in internal coding hackathons.`
  },
  {
    keywords: ["research", "paper", "publications", "sgp"],
    answer: `I have written two major research/SGP projects:
1. **Design of an Offline-First Clinical Survey Platform** (focuses on SharedPreferences caching and gestural Touch canvas).
2. **Interactive Codebase Dependency Mapping via Graph Topologies** (focused on D3 force layouts for import checking).`
  },
  {
    keywords: ["certificate", "certificates", "credentials", "course"],
    answer: `My core verified credentials include:
- **Google Cloud** Generative AI Fundamentals.
- **Supabase Academy** Realtime Database developer.
- **Advanced Full-Stack Developer** (MERN specialization).
- **TypeScript Core Concepts** and Design Patterns.`
  },
  {
    keywords: ["achievements", "hackathon", "winner", "award"],
    answer: `My key milestones:
- **1st Place** at the CHARUSAT Internal Hackathon (2025) for my BharatBudget budget sandbox project.
- **Academic Excellence Award** at CSPIT, CHARUSAT for top academic rankings (9.2 CGPA).`
  }
];

export const getOfflineAnswer = (query: string): string => {
  const q = query.toLowerCase();
  for (const faq of OFFLINE_FAQS) {
    if (faq.keywords.some(keyword => q.includes(keyword))) {
      return faq.answer;
    }
  }
  return `I have queried my offline database for "${query}" but found no matching records. Please connect to the internet to query the live Gemini Clone model, or contact me directly at ${CLONE_PROFILE.email}.`;
};

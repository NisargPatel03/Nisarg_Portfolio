# ✨ Nisarg Patel -- 3D Interactive Portfolio

A cutting-edge, ultra-premium developer portfolio designed with sleek futuristic aesthetics, immersive animations, audio-reactive interfaces, and robust mobile-first responsive architecture. Built utilizing React, TypeScript, Tailwind CSS, and Framer Motion.

---

## 🎨 Design & Premium Features

### 📐 1. Holographic CAD "Blueprint Mode"
*   **Heavy Metal Toggle**: An industrial brushed-metal toggle panel with corner rivets, functional status LEDs (Amber for Normal, Cyan for CAD override), and a 3D cylindrical lever that tilts dynamically on click.
*   **Responsive Mobile Switch**: On mobile viewports, the large industrial 3D lever collapses into a space-saving glassmorphic pill button displaying "CAD MODE" / "NORM MODE" alongside a layering wireframe icon.
*   **Viewport Rulers Overlay**: Renders columns `A` to `H` and rows `1` to `8` ticks around the screen margins, complete with dotted cursor crosshair tracking and a coordinate HUD.
*   **Clean Blueprint Layout**: The layout has been optimized by removing the bottom-right CAD Title Block, ensuring floating triggers (Command Palette, AI Chat, and footer buttons) remain fully accessible and visible on all viewports without overlaps.
*   **Dynamic Database Schema Maps**: Dynamically parses the active project's database schema checklist to render custom vector ER diagrams (with tables, primary keys, and relational linkage paths) in place of standard project mockup images.
*   **Vector Asset Overrides**: Replaced generic image elements with high-fidelity CAD drafting vectors (concentric targets, isometric chassis blocks, mechanical gears, linkages, and a detailed cybernetic face mesh for the portrait).
*   **Monochrome Typography**: Enforces a strict monochrome cyan color palette, grid background, cards outline offset annotations (`[SYS_MODULE]`, `W: 100% | H: AUTO`), and monospace fonts.

### 🚨 2. Emergency "Core Meltdown" Simulator
*   **Gamified Emergency Protocol**: Toggled by entering terminal override codes or commands, simulating a system core destabilization.
*   **Immersive VFX**: Displays flashing red danger screens, screen-wide rumble/shaking transformations, alarms, and emergency hazard alerts.
*   **Stabilizer Panel**: Launches a warning terminal overlay containing manual override stabilizers to cooling down reactor values and restore the portfolio state.

### 🔐 3. Biometric Authorization Gateway Gatekeeper
*   **Restricted Entry Terminal**: A sci-fi security gate screen displayed on boot to verify credentials before exposing the portfolio content.
*   **Premium Glassmorphic Layout**: Upgraded card interfaces, log readout containers, and input panels with frosted glass blurs (`backdrop-blur-md` and `.cyber-glass-card`) and custom-designed high-fidelity vector wireframe coordinate grids and vignette backdrops.
*   **Interactive Fingerprint Scanner**: Embedded SVG scanner with glowing laser sweep lines, pulse ring beacons, and audio confirmation cues.
*   **Sequential Console Logging**: Displays simulated network routing logs, browser diagnostics, and resolution auditing.
*   **Intrusion Alert & Lockdown**: Restricts password input attempts to 3. On failure, triggers flashing red hazard panels, sound FX alarm loops, and locks out inputs with a 30-second timer countdown.
*   **Bypass Mode**: Offers a manual override shortcut to skip authorization.

### 🎛️ 4. Command Search Palette Shell
*   **Quick Action Console**: Toggled via shortcut keys (`Ctrl+K` or search icons) to execute terminal commands globally.
*   **Isolated Navigation Flow**: Separated mouse hover event scopes and keyboard event arrows so hovering over items does not trigger jarring auto-scrolling behaviors.
*   **Dynamic System Controls**: Direct toggle commands for sound FX, ambient loops, cursor trails, Matrix rain canvas overlays, diagnostics panel visibility, and color theme modifications.

### 📊 5. Diagnostics HUD Sidebar
*   **Real-time Diagnostics**: A sticky right-aligned telemetry dashboard containing active scrolling CPU/Memory logs, system uptime counters, live scrolling position metrics, and interactive stats dials.

### 🌌 6. Interactive 3D Hero Section
*   **Magnetic Portrait**: A centered profile avatar equipped with organic magnet physics that follows pointer movements dynamically.
*   **Branded Favicon**: A custom-designed glassmorphic "NP" monogram glow set in neon purple and cyan.

### ☔ 7. Matrix Digital Rain Easter Egg
*   **Bioluminescent Canvas**: Cascades green glowing binary stream rain behind container cards when toggled, adding a retro cyber-hacker aesthetic layer.

### 🔊 8. Immersive Audio Engine
*   **Tactile Auditory Cues**: Integrated synthesizer clicks and menu navigation hover ticks.
*   **Dynamic Section-Based Ambient Soundtrack**: Synthesizes a real-time synthwave soundtrack using the Web Audio API. As the visitor scrolls, the soundtrack dynamically shifts chord progressions (D minor for Hero, E minor for Skills, C minor for Projects, F major for About, and G major for Contact) via a smooth, 2-second frequency pitch-glide transition.

### 💼 9. Spring Experience Timeline
*   **Elastic Timeline Entries**: Timeline cards animate dynamically on scroll using customized springs. Even timeline cards slide in from the **LEFT** (`x: -100`), and odd cards slide in from the **RIGHT** (`x: 100`).

### 💎 10. Cyber-Glassmorphic HUD & Design System
*   **Liquid Glass Aesthetic**: Utilizes custom frosted panel styling with `backdrop-filter: blur(28px)` and transparent background blends (`bg-black/45`).
*   **Reflective Bezels**: Integrates a dynamic reflected border highlight using custom CSS masks and linear gradients (`.cyber-glass-bezel`), rendering premium highlights on all card elements.
*   **Dynamic Theme Sync**: Automatically synchronizes all glowing accents and border variables across the whole portfolio with the selected color theme:
    *   **Toxic Radar** (Neon Green)
    *   **Vapor Matrix** (Cyberpunk Pink)
    *   **Amber Console** (Retro Gold)
    *   **Blueprint Arctic** (Drafting Blue)
*   **Universal Card Adapters**: Applied uniformly across the entire portfolio—affecting Hero tiles, Skills cards, Projects, Services, Timeline blocks, Diagnostics HUD, and the AI Terminal.

### ✉️ 11. Secure Contact Portal
*   **Web3Forms Integration**: Fully functional contact form forwarding inquiries straight to email.
*   **Zero-Leak Secrets**: Fully protected access keys stored in a gitignored `.env` file, securing production keys from public version-control leaks.

### 🤖 12. Nisarg Aether: Holographic AI Twin
*   **Gemini 1.5 Flash Integration**: A fully functional conversation terminal powered by Gemini 1.5 Flash, acting as a real-time digital clone of Nisarg.
*   **Dual Mode Operations (Online & Offline)**: Supports online querying via Gemini API, and automatically falls back to an offline FAQs local matching engine if the system key is missing or offline.
*   **Custom Glassmorphic Avatar**: Features a custom-generated futuristic neural network avatar (`aether_avatar.png`) that preserves its styling even in Blueprint CAD mode.
*   **Advanced Markdown Link Parsing**: Detects raw emails, social links (LinkedIn/GitHub), and web URLs in AI responses, automatically parsing them into interactive glassmorphic anchors (`target="_blank"`).
*   **Telemetry Quick-Chips**: Features quick-click diagnostic chips that auto-inject inquiries into the terminal input for instant developer info lookup.
*   **Vocal TTS Stream**: Synthesizes speech outputs of AI responses using browser Web Speech APIs, paired with a dynamic SVG audio visualizer.
### 🎬 13. Cinematic Monogram Preloader (System Boot Sequence)
*   **Vector Build Animation**: Traces geometric letters `N` and `P` using Framer Motion SVG `pathLength` properties in the center of the coordinate grid axes.
*   **Cleaned Telemetry**: Removed secondary technical noise tags (`SYS_SPEED`, `BOOT_MODULE`, `SEC_GATE`, `CLOCK_REF`, `NODE_X`, `NODE_Y`, `SYS_CORE`, `MEM_ALLOC`) to keep the intro sequence visually focused and uncluttered.
*   **Bold Monogram Path Weight**: Configured the vector "NP" drawing path to render with a heavy, premium `23px` stroke width during the centered layout build.
*   **Drift Stroke Interpolation**: The path automatically scales down dynamically from a heavy `23px` line weight in the center to a clean `13px` width at the final top-left header position.
*   **Centered Reticle Grid**: Configured the coordinate grid alignment and expanded the monogram's bounding box size to `380px x 280px` in the center of a `460px` diameter dashed circular target reticle for a striking, balanced visual.
*   **Spring-Based Shared Layout Transition**: Replaced component switching with a unified, persistent floating container. Utilizes physical spring properties (`stiffness: 50, damping: 13`) to seamlessly drift from the preloader center coordinates to the navigation header without flickering.

### 🛠️ 14. Infinite Skills Marquee & Telemetry Registry
*   **Three-Tier Multidirectional Tracks**: Renders three independent horizontal scrolling marquee skill rows animating at variable speed thresholds (Row 1: left-fast, Row 2: right-medium, Row 3: left-slow).
*   **Tactile 3D Hover Tilt**: The badges tilt dynamically in 3D perspective space following the user's cursor vector offsets (`--x`, `--y` variables), paired with glowing drop shadows of their respective brand colors.
*   **Detailed Telemetry Modals**: Clicking any skill suspends the tracks and reveals a premium glassmorphic registry modal detailing the item's Proficiency, Exp Level, Core Competencies (tags), and specific Portfolio Integrations (linked projects) over a retro CRT scanline raster backdrop.

### 🕸️ 15. Technical Architecture Simulation (Force-Directed Node Graph)
*   **Custom Physics Solver Canvas**: Implements a HTML5 Canvas-based 2D force-directed node graph mapping Nisarg's development toolchains (Client, Backend, AI, Data, Languages) with custom attraction/repulsion coefficients and drag-and-drop node physics.
*   **Data Routing Flow Pipeline**: Features live animated simulation scenarios (such as AI Inference pipelines, Web Services request cycles, and Supabase Database synchronizations) which dispatch electrical packet sparks traveling along connection pathways in real-time.
*   **Topological Web Audio Synth**: Synthesizes real-time sound effects (spark sweeps and detonation bursts) mapped to visual event coordinates using Web Audio API nodes.

---

## 🛠️ Tech Stack & Architecture

*   **Core**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (Type-safe component design)
*   **Build Tool**: [Vite 8](https://vite.dev/) (Instant HMR & blazing-fast production builds)
*   **Styles**: [Tailwind CSS](https://tailwindcss.com/) (Utility-first responsive styling)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) (Hardware-accelerated physics and transitions)
*   **Icons**: [Lucide React](https://lucide.dev/) (Modern minimalist vectors)
*   **Forms**: [Web3Forms API](https://web3forms.com/) (Serverless secure form submissions)

---

## 📂 Featured Projects Directory

Here is a detailed breakdown of the featured projects showcased within the interactive terminal:

### 1. Survey Health Care Form App (Healthcare Assessment Tool)
*   **Purpose**: A state-of-the-art clinical solution modernising fieldwork and requirements for Community Health Nursing at CHARUSAT.
*   **Key Features**:
    *   **Offline-First Core**: SharedPreferences caching for zero-network fields.
    *   **Dynamic UI Builder**: Schema-driven form generator supporting 57+ clinical templates.
    *   **Interactive Vector Painter**: Gestural sketch canvas Screen converting user touches to high-res maps.
    *   **Automated PDF Compiler**: Evaluator-driven jsPDF dynamic transcript generation.
*   **Tech Stack**: Flutter, React, Supabase Cloud Database & Auth, PostgreSQL, Tailwind CSS
*   **Repository**: [Survey_Form_HealthCare_App](https://github.com/NisargPatel03/Survey_Form_HealthCare_App)

### 2. CodeGraph (AI Code Visualization & Intelligence)
*   **Purpose**: An AI-powered interactive codebase visualization and intelligence platform.
*   **Key Features**:
    *   **Bioluminescent Graph Layouts**: Dynamic 2D D3 and 3D Canvas visualizers showing call-graphs and dependencies.
    *   **Semantic AI Audits**: Google Gemini-driven code smell audits, explanation layers, and unit test generation.
    *   **REST API Playground**: Integrated client playground with schema extractors and request testers.
    *   **Topological Sonification**: Interactive audio representation and code-weather visualizers.
*   **Tech Stack**: React, TypeScript, D3.js, Gemini AI, Vanilla CSS
*   **Repository**: [CodeGraph](https://github.com/NisargPatel03/CodeGraph)

### 3. BharatBudget (Public Finance Command Center)
*   **Purpose**: State-of-the-art public finance visualization dashboard decoding Indian Union Budget data.
*   **Key Features**:
    *   **16th Finance Commission Sandbox**: Interactive math calculator adjusting weight parameters dynamically.
    *   **Offline AI Assistant**: Client-side RAG engine with voice synthesizers.
    *   **Thematic Speech Miner**: Interactive word clouds paired with synonym parsing.
    *   **Macroeconomic Shock Simulator**: Stress-tests GDP, CPI, and outlays against global crises.
*   **Tech Stack**: React 19, TypeScript, Zustand, Recharts, Tailwind CSS, Google Gemini 1.5 Flash
*   **Repository**: [BharatBudget](https://github.com/NisargPatel03/BharatBudget)

### 4. DRHV Cricket Tournament (Sports Management Platform)
*   **Purpose**: Real-time league organizer and fan soundboard built for local tournament campaigns.
*   **Key Features**:
    *   **AI Voice Commentator**: Live delivery text-to-speech audio using Google Gemini 1.5.
    *   **AI Editorial Writer**: Sports-journalist summary writing on-demand.
    *   **Real-time Scorekeeper Console**: Dynamic input triggers instantly updating standings.
    *   **Fan Soundboard & Chat**: Live interactive cheer bells and chat channels.
*   **Tech Stack**: React, Supabase Realtime DB, Tailwind CSS, Google AI Studio REST API
*   **Repository**: [DRHV_Cricket_Tournament](https://github.com/NisargPatel03/DRHV_Cricket_Tournament)

### 5. Blaze Overseas LLP Portal (Commercial Business Platform)
*   **Purpose**: High-fidelity corporate product catalog for international spices, grains, and pulses trade.
*   **Key Features**:
    *   **Dynamic Catalogue Directory**: Specs, MOQ, packaging sizes, and HS codes for 24+ commodities.
    *   **Preloading Pre-loader**: Smooth pre-loader paired with Lenis momentum scroll.
    *   **Sample Inquiry Funnel**: Secure automated mail notifications to SMTP receivers.
*   **Tech Stack**: Next.js 16 (App Router), React 19, Tailwind CSS 4, GSAP, Framer Motion, Three.js
*   **Repository**: [Blaze_Overseas_LLP](https://github.com/NisargPatel03/Blaze_Overseas_LLP)

### 6. EcoLearn Environmental Portal (Ecology Learning Platform)
*   **Purpose**: Gamified ecology education platform utilizing interactive modules and carbon calculators.
*   **Key Features**:
    *   **Gamified System**: Quizzes, biodiversity milestones, and carbon footprint calculators.
    *   **Role-Based Portals**: Customized panels for Students, Teachers, and Administrators.
    *   **AI-Driven Quizzes**: Automated dynamic quiz creation powered by Gemini.
*   **Tech Stack**: Next.js 16, React 19, Node.js, Express, MongoDB (Mongoose), Socket.io, Google Generative AI
*   **Repository**: [SEM6-SGP-70-75](https://github.com/cs-cspit/SEM6-SGP-70-75)

### 7. Savaliya Scoops POS System (Client Point of Sale)
*   **Purpose**: Customized retail checkouts built for parlor chain locations.
*   **Key Features**:
    *   **Hold & Recall Buffers**: Saves client orders during checkout rushes.
    *   **GST Invoice Generator**: Renders compliant transaction files.
    *   **Supabase Realtime Sync**: Active sync updating menu stock counts dynamically.
*   **Tech Stack**: React, Supabase, Excel API, Tailwind CSS
*   **Repository**: [savaliya-scoops-system](https://github.com/NisargPatel03/savaliya-scoops-system)

### 8. NextGenSociety Portal (Smart Society Management)
*   **Purpose**: Multi-tenant residential management system automating payments, notice circulars, and complaints.
*   **Key Features**:
    *   **Online Maintenance Portal**: Instant billing calculations and online Stripe transactions.
    *   **Noticeboards**: Digital circulars accessible 24/7.
    *   **Ticketing Desk**: Real-time admin feedback channels for complaints.
*   **Tech Stack**: React, Node.js, Express, MongoDB, Bootstrap
*   **Repository**: [NextGenSociety](https://github.com/NisargPatel03/NextGenSociety)

### 9. QuickStay Hotel Booking (MERN Reservation Suite)
*   **Purpose**: Responsive full-stack reservation engine featuring admin rooms.
*   **Key Features**:
    *   **Secure Redux Sessions**: Multi-role logins (Admin & Customer).
    *   **JWT Rotation**: Security features guarding credentials.
    *   **Availability Grids**: Real-time room calendars.
*   **Tech Stack**: MongoDB, Express, React, Node.js, Redux
*   **Repository**: [MERN_Hotel_Booking](https://github.com/NisargPatel03/MERN_Hotel_Booking)

### 10. Car Rental System (Personal MERN Project)
*   **Purpose**: Car exploration, reservation, and rental management catalog.
*   **Key Features**:
    *   **Fleet Catalog Listings**: Real-time CRUD management for vehicles.
    *   **Invoice Generator**: PDF billing receipts.
*   **Tech Stack**: React, Node.js, Express, MongoDB, Tailwind CSS
*   **Repository**: [CarRental_FullStack](https://github.com/NisargPatel03/CarRental_FullStack)

### 11. Blood Testing Management (Backend Dashboard System)
*   **Purpose**: PHP-based clinical patient laboratory portal managing appointment slots.
*   **Key Features**:
    *   **Patient Indexer DB**: Relational MySQL tables holding diagnostic histories.
    *   **Report PDF Compiler**: Local on-prem report exporter.
*   **Tech Stack**: PHP, MySQL, XAMPP, Bootstrap, JavaScript
*   **Repository**: [23CS-SEM4-CS210_70_75_106](https://github.com/cs-cspit/23CS-SEM4-CS210_70_75_106/tree/main)

### 12. Sports Venue Booking System (Reservation Suite)
*   **Purpose**: Court scheduling and reservation portal.
*   **Key Features**:
    *   **Court Availability Calendar**: Prevents double-booking overlaps.
    *   **Admin Access Audit Logs**: Tracks booking histories.
*   **Tech Stack**: React, Node.js, Express, MongoDB, Tailwind CSS
*   **Repository**: [Sports_Venue_Booking_System](https://github.com/Meghpatel2810/Sports_Venue_Booking_System)

### 13. Skill Swap Platform (MERN Web App)
*   **Purpose**: Peer-to-peer exchange platform matching users based on professional skills.
*   **Key Features**:
    *   **P2P Matcher Algorithm**: Connects learners with experts.
    *   **Endorsement Matrices**: Multi-tier user ratings.
*   **Tech Stack**: MongoDB, Express, React, Node.js, Redux
*   **Repository**: [NisargPatel03 Profiles](https://github.com/NisargPatel03)

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/NisargPatel03/Nisarg_Portfolio.git
cd Nisarg_Portfolio
npm install
```

### 2. Environment Setup
Create a local `.env` file in the root directory:
```env
VITE_WEB3FORMS_KEY=your_web3forms_access_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Local Development
Launch the development server locally with hot module replacement (HMR):
```bash
npm run dev
```

### 4. Build & Production Compilation
Generate a fully optimized, compiled, and minified production build:
```bash
npm run build
```
The compiled output is outputted inside the `/dist` directory, fully optimized and ready for zero-config deployments on [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

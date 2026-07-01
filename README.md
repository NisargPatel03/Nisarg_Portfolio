# ✨ Nisarg Patel -- 3D Interactive Portfolio

A cutting-edge, ultra-premium developer portfolio designed with sleek futuristic aesthetics, immersive animations, audio-reactive interfaces, and robust mobile-first responsive architecture. Built utilizing React, TypeScript, Tailwind CSS, and Framer Motion.

---

## 🎨 Design & Premium Features

### 📐 1. Holographic CAD "Blueprint Mode"
*   **Heavy Metal Toggle**: An industrial brushed-metal toggle panel with corner rivets, functional status LEDs (Amber for Normal, Cyan for CAD override), and a 3D cylindrical lever that tilts dynamically on click.
*   **Responsive Mobile Switch**: On mobile viewports, the large industrial 3D lever collapses into a space-saving glassmorphic pill button displaying "CAD MODE" / "NORM MODE" alongside a layering wireframe icon.
*   **Viewport Rulers Overlay**: Renders columns `A` to `H` and rows `1` to `8` ticks around the screen margins, complete with dotted cursor crosshair tracking and a coordinate HUD.
*   **Clean Blueprint Layout**: The layout has been optimized by removing the bottom-right CAD Title Block, ensuring floating triggers (Command Palette, AI Chat, and footer buttons) remain fully accessible and visible on all viewports without overlaps.
*   **CAD Switch & Telemetry Collision Avoidance**: Programmatically hides the industrial CAD Toggle Switch when the Diagnostics HUD sidebar expands, and restores it when collapsed to prevent visual clutter and layout overlap.
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
*   **Quick Action Console**: Toggled via shortcut keys (`Ctrl+K` or search icons) or by pressing `/` globally. Executes commands and navigation triggers from a unified window.
*   **Isolated Navigation Flow**: Separated mouse hover event scopes and keyboard event arrows so hovering over items does not trigger jarring auto-scrolling behaviors.
*   **Dynamic System Controls**: Direct toggle commands for sound FX (`S K`), ambient loops (`S A`), cursor trails (`C T`), Matrix rain canvas overlays (`M R`), diagnostics panel visibility (`S H`), WebGL refraction shaders (`W G`), and color theme modifications.

### 📊 5. Diagnostics HUD Sidebar
*   **Real-time Diagnostics**: A sticky, collapsible right-aligned telemetry dashboard containing active scrolling CPU/Memory logs, system uptime counters, live scrolling position metrics, and interactive stats dials.
*   **Radial Progress Gauge**: An SVG-driven circular tracking beacon showing the exact scroll depth percentage down the portfolio.
*   **Oscilloscope Sparkline**: A canvas-based wave visualizer that plots live sound frequencies using Web Audio API nodes or defaults to scroll-velocity-controlled superposed sine equations.

### 🔮 6. WebGL Liquified Glass Refraction Canvas
*   **Command Palette Toggle (Default Off)**: Set to disabled by default to guarantee maximum rendering performance across all devices. Can be dynamically toggled on/off in real-time from the Command Palette (`Ctrl+K` -> `W G`).
*   **Clean Pointer Aesthetics**: Removed the large distracting cursor-following liquid circle to maintain a clean, ultra-professional cyber-grid design.
*   **Interactive WebGL Shaders**: A background canvas powered by WebGL 2 running custom vertex and fragment shaders. High-performance rendering is capped at a pixel ratio of 1.5 to prevent GPU bottlenecking.
*   **Cursor Refraction Lens**: A dynamic, aspect-ratio corrected magnifying glass lens that tracks pointer coordinates, warping background grids and rain streams under a hovering blur.
*   **3D Perspective Warp**: Physical scroll triggers or command palette skips tilt the canvas grid along a 3D Z-axis perspective projection, creating depth during transit.

### 🌌 7. Interactive 3D Hero Section
*   **Magnetic Portrait**: A centered profile avatar equipped with organic magnet physics that follows pointer movements dynamically.
*   **Branded Favicon**: A custom-designed glassmorphic "NP" monogram glow set in neon purple and cyan.

### ☔ 8. Matrix Digital Rain Easter Egg
*   **Bioluminescent Canvas**: Cascades green glowing binary stream rain behind container cards when toggled. When WebGL is active, the rain is sampled as a texture and displaced realistically by cursor refractions.

### 🔊 9. Immersive Audio Engine
*   **Tactile Auditory Cues**: Integrated synthesizer clicks and menu navigation hover ticks.
*   **Dynamic Section-Based Ambient Soundtrack**: Synthesizes a real-time synthwave soundtrack using the Web Audio API. As the visitor scrolls, the soundtrack dynamically shifts chord progressions (D minor for Hero, E minor for Skills, C minor for Projects, F major for About, and G major for Contact) via a smooth, 2-second frequency pitch-glide transition.

### 💼 10. Spring Experience Timeline
*   **Elastic Timeline Entries**: Timeline cards animate dynamically on scroll using customized springs. Even timeline cards slide in from the **LEFT** (`x: -100`), and odd cards slide in from the **RIGHT** (`x: 100`).

### 💎 11. Cyber-Glassmorphic HUD & Design System
*   **Liquid Glass Aesthetic**: Utilizes custom frosted panel styling with `backdrop-filter: blur(28px)` and transparent background blends (`bg-black/45`).
*   **Reflective Bezels**: Integrates a dynamic reflected border highlight using custom CSS masks and linear gradients (`.cyber-glass-bezel`), rendering premium highlights on all card elements.
*   **Dynamic Theme Sync**: Automatically synchronizes all glowing accents and border variables across the whole portfolio with the selected color theme:
    *   **Toxic Radar** (Neon Green)
    *   **Vapor Matrix** (Cyberpunk Pink)
    *   **Amber Console** (Retro Gold)
    *   **Blueprint Arctic** (Drafting Blue)
*   **Universal Card Adapters**: Applied uniformly across the entire portfolio—affecting Hero tiles, Skills cards, Projects, Services, Timeline blocks, Diagnostics HUD, and the AI Terminal.

### 🏆 12. Validated Accolades & Certifications Filter Browser
*   **Dynamic Category Tabs**: Filters credentials on-the-fly between "All Credentials", "Academic & National", "NPTEL Topper", and "Professional Tech".
*   **Premium Badge Integration**: Highlights elite titles including the **Devang Mehta IT Award (First Rank Across IT/CS)**, **GATE 2026 Scorecard (Ministry of Education)**, and **NPTEL National Topper Status (Top 1-2%)** in DSA, DBMS, and DAA.
*   **Direct Verification Pipeline**: Embedded validation buttons linking directly to academic transcripts and PDF files stored securely within the local directory structure.

### 🤝 13. Commercial Engagements & Client Projects Slide Deck
*   **Interactive Contract Slides**: A commercial projects section detailing contracted deliverables and organizational engagements:
    *   **Blaze Overseas LLP Portal**: A lead developer engagement (₹30,000 INR) detailing commodities catalogs, automated lead generation scheduling, and serverless mail SMTP integration.
    *   **Savaliya Ice Cream POS System**: An official CSE CSPIT collaboration for a retail point-of-sale checkout system deployed at the Nadiad Welcome Plazza outlet. Features multi-mode settlement (cash, Paytm ledger), hold/recall order queues, pre-order alerts, and local Excel database vaults.

### 👤 14. Interactive 3D About Me Cards & Assets
*   **Animated Text bio**: A scroll-driven typography mask that reveals bio details dynamically based on viewport intersection.
*   **Floating 3D Ornaments**: Corner-positioned graphic elements (3D Spike, Moon, Lego block, Composition mesh) performing physical bounce and pulse oscillations.
*   **Glitch-Hover Tilt Cards**: Responsive grid cards utilizing 3D perspective mouse tilt coordinates paired with visual CRT scanline glitches.

### ✉️ 15. Secure Contact Portal
*   **Web3Forms Integration**: Fully functional contact form forwarding inquiries straight to email.
*   **Zero-Leak Secrets**: Fully protected access keys stored in a gitignored `.env` file, securing production keys from public version-control leaks.

### 🤖 16. Nisarg Aether: Holographic AI Twin & Living Digital Twin Tour Guide
*   **Living Digital Twin Tour Guide (Proactive Agency)**: The AI is no longer a passive chatbot; it has full agency to guide visitors. It outputs custom execution brackets `[TOUR: scroll=section, project=slug, blueprint=true/false]` that programmatically steer the UI.
*   **Decoupled Custom Event Pipeline**: Communicates with the site's layouts via custom browser events (`aiTourCommand`) to run automated scrolls, deploy specific projects in the terminal, compile codebases, and toggle CAD blueprint mode.
*   **Tour Bypass Toggle**: A custom `🌐 tour: active` / `🔒 tour: off` toggle button is integrated in the console footer. When turned off, the AI twin functions strictly as a text-based chatbot, keeping the screen static.
*   **Adaptive suggestion chips**: Automatically switches text labels from Tour triggers (`🧬 Tour CodeGraph`) to static information queries (`🧬 Info CodeGraph`) depending on the tour toggle state.
*   **Sanitized Vocal Streams & Output**: The terminal regex-filters all machine command brackets from user-visible chat logs and the Web Speech Synthesis voice engine, keeping raw code instructions invisible to visitors.
*   **Telemetry Status Indicator**: Features a pulsing `[SYSTEM_CONTROL: ACTIVE]` alert in the header telemetry bar during automated tours to inform the user of system control status.
*   **Gemini 1.5 Flash Integration**: A fully functional conversation terminal powered by Gemini 1.5 Flash, acting as a real-time digital clone of Nisarg.
*   **Dual Mode Operations (Online & Offline)**: Supports online querying via Gemini API, and automatically falls back to an offline FAQs local matching engine with rich project schemas if the system key is missing or offline.
*   **Custom Glassmorphic Avatar**: Features a custom-generated futuristic neural network avatar (`aether_avatar.png`) that preserves its styling even in Blueprint CAD mode.
*   **Advanced Markdown Link Parsing**: Detects raw emails, social links (LinkedIn/GitHub), and web URLs in AI responses, automatically parsing them into interactive glassmorphic anchors (`target="_blank"`).

### 🎬 17. Cinematic Monogram Preloader (System Boot Sequence)
*   **Vector Build Animation**: Traces geometric letters `N` and `P` using Framer Motion SVG `pathLength` properties in the center of the coordinate grid axes.
*   **Cleaned Telemetry**: Removed secondary technical noise tags to keep the intro sequence visually focused and uncluttered.
*   **Bold Monogram Path Weight**: Configured the vector "NP" drawing path to render with a heavy, premium `23px` stroke width during the centered layout build.
*   **Drift Stroke Interpolation**: The path automatically scales down dynamically from a heavy `23px` line weight in the center to a clean `13px` width at the final top-left header position.
*   **Centered Reticle Grid**: Configured the coordinate grid alignment and expanded the monogram's bounding box size to `380px x 280px` in the center of a `460px` diameter dashed circular target reticle for a striking, balanced visual.
*   **Spring-Based Shared Layout Transition**: Replaced component switching with a unified, persistent floating container. Utilizes physical spring properties (`stiffness: 50, damping: 13`) to seamlessly drift from the preloader center coordinates to the navigation header without flickering.

### 🛠️ 18. Infinite Skills Marquee & Telemetry Registry
*   **Three-Tier Multidirectional Tracks**: Renders three independent horizontal scrolling marquee skill rows animating at variable speed thresholds (Row 1: left-fast, Row 2: right-medium, Row 3: left-slow).
*   **Tactile 3D Hover Tilt**: The badges tilt dynamically in 3D perspective space following the user's cursor vector offsets (`--x`, `--y` variables), paired with glowing drop shadows of their respective brand colors.
*   **Detailed Telemetry Modals**: Clicking any skill suspends the tracks and reveals a premium glassmorphic registry modal detailing the item's Proficiency, Exp Level, Core Competencies (tags), and specific Portfolio Integrations (linked projects) over a retro CRT scanline raster backdrop.

### 🕸️ 19. Technical Architecture Simulation (Force-Directed Node Graph)
*   **Custom Physics Solver Canvas**: Implements a HTML5 Canvas-based 2D force-directed node graph mapping Nisarg's development toolchains (Client, Backend, AI, Data, Languages) with custom attraction/repulsion coefficients and drag-and-drop node physics.
*   **Data Routing Flow Pipeline**: Features live animated simulation scenarios (such as AI Inference pipelines, Web Services request cycles, and Supabase Database synchronizations) which dispatch electrical packet sparks traveling along connection pathways in real-time.
*   **Topological Web Audio Synth**: Synthesizes real-time sound effects (spark sweeps and detonation bursts) mapped to visual event coordinates using Web Audio API nodes.

### 💻 20. Interactive Projects Terminal Deck UI
*   **Boot & System Scan**: Automatically launches a terminal boot sequence simulation detailing diagnostics logs, RAM audits, and mounting protocols before revealing project cards.
*   **Slide Gestures & Physics**: A swipe deck utilizing touch gestures, drag coordinates, and inertia vectors to navigate active projects.
*   **Multi-Tab Info Cards**: An active project UI featuring sub-navigation tabs to audit project Overview (description), Features list, Tech Stack tags, and Sys Info host records.
*   **System Controls**: Integrates controls to activate a CRT scanline monitor shader, toggle typewriting click SFX, and pull out preview drawers displaying full project screenshots.

### 💡 21. Dynamic Cursor-Tracking Border Reflections
*   **Cursor Refraction Glow**: A high-performance hover border tracking highlight that lights up elements only at the point closest to the cursor.
*   **Optimized Styling & Masks**: Implemented via a lightweight global pointer event listener in `App.tsx` updating CSS variables `--mouse-x` and `--mouse-y` dynamically without causing React re-renders. Uses custom CSS radial-gradient borders and dual mask configurations (`mask-composite: exclude`) for crisp border-only reflections.
*   **Layout Safety Overrides**: Integrated with safety overrides preventing absolute/fixed cards (such as the AI Chat Clone) from losing their position and alignment on various viewport layouts.

### ⚔️ 22. Cyberpunk Katana Cuts Section Transitions
*   **Diagonal Shutter Wipe**: A premium transition effect triggered when navigating between page sections via header links, the Command Palette, or AI Clone tours.
*   **Laser Slashes & Split Curtains**: Flashes dual animated SVG neon path laser slashes across the screen, followed by two dark glassmorphic panels sliding in diagonally at a 45-degree angle from opposite corners to meet in the center.
*   **Topological Web Audio Sound FX**: Generates custom futuristic blade swoosh/slash sound effects dynamically in real-time using a white noise buffer swept through a BiquadFilterNode sweep.
*   **Seamless Under-Curtain Scrolling**: Locks the scrolling experience while panels are closed and jumps instantly to the target section using `lenis.scrollTo(element, { immediate: true })` to prevent scroll-motion sickness and keep the navigation experience extremely snappy and responsive.

### 🧬 23. Morphing SVG Micro-Animations (Vector Assets)
*   **Interactive Tab Icons**: Hovering the **Projects** tab morphs the folder icon into a rotating mechanical gear. Hovering the **Contact** tab morphs the envelope icon into a flying paper airplane.
*   **Concentric Biometric Ripples**: Hovering the biometric fingerprint scanner triggers concentric scan vectors that morph and ripple outward in waves.
*   **Premium Sensory Enhancements**: Incorporates snappy spring physics (`stiffness: 180, damping: 12`), dual-layered neon plasma glows (foreground + blurred glow background), synchronized audio synthesis feedback (ticks, swooshes, sonar pings), and interactive exhaust/spark particle emitters.

### 💈 24. Chromatic Glitch SVG Header Typography
*   **Layered SVG Text Nodes**: Replaced traditional `<h2>` text headings in all major sections (About, Work Experience, Projects, Client Projects, Certifications, Contact) with high-performance inline SVG `<text>` elements.
*   **Stereoscopic Chromatic Aberration**: Layers three separate colored outlines (Cyan, Magenta, and Green) beneath the solid foreground text. On hover, these layers undergo high-frequency micro-oscillations in opposite directions, simulating a real-time analog lens/CRT chromatic glitch.
*   **Adaptive Light Mode Rendering**: Built with a dynamic `lightMode` property to swap the foreground fill (white vs. dark gray) depending on the background section theme, ensuring perfect contrast and readability on both white and cyber-black backdrops.

---

## 🛠️ Tech Stack & Architecture

*   **Core**: [React 19](https://react.dev/) + [TypeScript 6](https://www.typescriptlang.org/) (Type-safe component design)
*   **Build Tool**: [Vite 8](https://vite.dev/) (Instant HMR & blazing-fast production builds)
*   **Styles**: [Tailwind CSS 3](https://tailwindcss.com/) + [PostCSS](https://postcss.org/) (Utility-first responsive styling)
*   **Animations**: [Framer Motion 12](https://www.framer.com/motion/) (Hardware-accelerated physics and transitions)
*   **Smooth Scrolling**: [Lenis 1.3](https://lenis.darkroom.engineering/) (Exponential deceleration scrolling mechanics)
*   **AI Integration**: [Google Generative AI](https://ai.google.dev/) (Powered by Gemini 1.5 Flash API)
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
    *   **Offline AI Assistant**: Client-side RAG engine with Gujarati/Hindi TTS synthesizers.
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

## 📂 Project Directory Structure

```
Nisarg_Portfolio/
├── .vscode/                 # IDE workspace configuration
├── Certificates/            # Local copy of academic & professional credentials
├── NPTEL_Certi/             # Local copy of NPTEL topper certificates
├── Research_Certi/          # Local copy of published research papers
├── public/                  # Static assets (images, PDFs, SVGs)
│   ├── certificates/        # Publicly accessible certificate documents
│   ├── aether_avatar.png    # Neural AI twin avatar asset
│   └── *_mockup.png         # Project screenshot mockups
├── src/                     # Core application codebase
│   ├── assets/              # Static styling assets
│   ├── components/          # Reusable UI widgets & canvas overlays
│   │   ├── AiCloneTerminal.tsx     # Gemini-powered Aether chatbot
│   │   ├── BiometricAuthScreen.tsx # Multi-stage security gateway
│   │   ├── CommandPalette.tsx      # Central command search palette
│   │   ├── DiagnosticsHUD.tsx      # Sidebar telemetry oscilloscope
│   │   ├── KatanaWipe.tsx          # Diagonal SVG slice section transition
│   │   ├── LiquidGlassCanvas.tsx   # WebGL 2 liquid glass shader
│   │   ├── MatrixRain.tsx          # Bioluminescent digital rain canvas
│   │   ├── MeltdownOverlay.tsx     # Nuclear reactor core meltdown overlay
│   │   ├── Preloader.tsx           # Monogram vector boot-up sequence
│   │   └── ...
│   ├── data/                # Data structures & FAQ fallback registries
│   │   ├── cloneKnowledge.ts       # AI system instructions & offline FAQs
│   │   └── projectsTerminal.ts     # 13 featured projects & terminal logs
│   ├── sections/            # Core sections of the page layout
│   │   ├── HeroSection.tsx         # Center magnetic portrait & greetings
│   │   ├── MarqueeSection.tsx      # Skills marquee row tracks
│   │   ├── ArchitectureSection.tsx # Technical node graph simulation
│   │   ├── AboutSection.tsx        # 3D about details & tilt cards
│   │   ├── WorkExperience.tsx      # Spring-driven job timeline
│   │   ├── ServicesSection.tsx     # Blaze & Savaliya commercial decks
│   │   ├── ProjectsSection.tsx     # Drag-and-swipe interactive terminal
│   │   ├── CertificationsSection.tsx # Tabbed accolades & PDF checkers
│   │   └── ContactSection.tsx      # Web3Forms gateway & footer details
│   ├── utils/               # Helper modules
│   │   └── terminalAudio.ts        # Web Audio API ambient synth & sound FX
│   ├── App.tsx              # Application layout root & global state hooks
│   ├── main.tsx             # DOM mounting entrypoint
│   └── index.css            # Custom glassmorphic styles & design system
├── tailwind.config.js       # Tailwind style configurations
├── vite.config.ts           # Vite compile parameters
└── tsconfig.json            # TypeScript directives
```

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

# ✨ Nisarg Patel -- 3D Interactive Portfolio

A cutting-edge, ultra-premium developer portfolio designed with sleek futuristic aesthetics, immersive animations, and robust mobile-first responsive architecture. Built utilizing React, TypeScript, Tailwind CSS, and Framer Motion.

---

## 🎨 Design & Premium Features

### 1. Immersive 3D Interactive Hero
*   **Magnet headshot**: A centered 3D portrait rendering equipped with organic magnetic hover physics. The head reacts and follows mouse movement dynamically, creating a tactile depth effect.
*   **Branded Favicon**: A custom-designed glassmorphic **"NP"** monogram logo glow set in neon purple and cyan, replacing standard generic icons.
*   **Webkit-Optimized Title**: Features a dual-layer metallic typography banner with responsive safe clamps that scale perfectly across all phone viewports without horizontal clipping.

### 📱 2. Fluid Responsive Navbar Drawer
*   **Hamburger Overlay**: Screen sizes under 768px auto-collapse into a neat hamburger toggle.
*   **Backdrop Dismissal**: Tapping the icon launches an animated full-screen drawer modal, which can be dismissed instantly by tapping any blank space in the background.

### 💼 3. Spring Experience Timeline
*   **Left-and-Right Slide entries**: Timeline cards animate dynamically on scroll using customized springs. Even timeline cards slide in from the **LEFT** (`x: -100`), and odd cards slide in from the **RIGHT** (`x: 100`).
*   **Relaxed Mobile Viewports**: Optimized viewports (`once: true`, `amount: 0.05`) ensure cards animate smoothly and stay visible permanently on short mobile screens.

### 🎈 4. Float Layered 3D Assets
*   **Corner Elements**: Implements floating 3D icons (Moon, Lego block, Smiley face, Mouse Cursor) that scale responsively on mobile.
*   **Depth Stacking**: Uses layered `z-index` properties so elements float smoothly behind text and cards without blocking readability.

### ✉️ 5. Secure Contact Portal
*   **Web3Forms Integration**: Fully functional contact form forwarding inquiries straight to email.
*   **Zero-Leak Secrets**: Fully protected access keys stored in a gitignored `.env` file, securing production keys from public version-control leaks.

---

## 🛠️ Tech Stack & Architecture

*   **Core**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (Type-safe component design)
*   **Build Tool**: [Vite 8](https://vite.dev/) (Instant HMR & blazing-fast production builds)
*   **Styles**: [Tailwind CSS](https://tailwindcss.com/) (Utility-first responsive styling)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) (Hardware-accelerated physics and transitions)
*   **Icons**: [Lucide React](https://lucide.dev/) (Modern minimalist vectors)
*   **Forms**: [Web3Forms API](https://web3forms.com/) (Serverless secure form submissions)

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

# MAYA — Mindful AI Companion

> **MAYA** (Mindful Adaptive Yielding Assistant) is a full-stack, responsive AI companion application crafted with React, Vite, Tailwind CSS, Express, and Google Gemini API. MAYA exhibits a consistent, warm personality with subtle, transparently simulated emotional states that adjust her visual aesthetic and conversational tone in real time.

---

## ✨ Features

- **Consistently Warm & Thoughtful Persona**: MAYA offers compassionate listening, deep intellectual inquiry, and calm presence.
- **Dynamic Simulated Emotions Engine**:
  - 7 Simulated States: `Warm`, `Empathetic`, `Curious`, `Thoughtful`, `Playful`, `Calm`, `Optimistic`.
  - Responsive visual aura rings, eye expressions, and subtle pulse rhythms.
  - Ethical transparency tooltips and dedicated disclosure modal clarifying that emotions are simulated computational expressions, not conscious feelings.
- **Midnight Purple Aesthetic**:
  - Dark midnight-purple background (`#06040d`) with violet and cyan glowing accents.
  - Glassmorphic panels, ambient radial glows, and smooth CSS transitions.
- **Full Conversational Flow**:
  - Landing hero page with interactive emotion tester and quick "Start Chat" CTA.
  - Interactive chat panel with rich message bubbles, markdown formatting, copy-to-clipboard, and timestamps.
  - Dynamic typing indicator showing Maya's active cognitive thought state.
  - Suggested starter prompts (stress relief, creative spark, philosophy, playful banter).
  - Message persistence via `localStorage`.
  - Clear conversation dialog with safety confirmation.
- **Security & Privacy**:
  - Google Gemini API key is isolated on the Node.js Express server (`server/.env`).
  - Zero API key leakage to client-side bundles.
  - Built-in graceful offline simulation mode when no API key is provided.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 18
  - Vite 6
  - Tailwind CSS 3
  - Lucide React (Icons)
- **Backend**:
  - Node.js & Express
  - `@google/genai` & `@google/generative-ai`
  - `dotenv` & `cors`

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **npm** v9+

### 2. Installation

You can install all dependencies across the project with a single command from the project root:

```bash
npm run install:all
```

Or install them individually:
```bash
# Install root orchestrator dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Install frontend dependencies
cd client && npm install && cd ..
```

### 3. Configure Gemini API Key (Server-Side)

1. Open `server/.env` (or copy from `server/.env.example`).
2. Add your Google Gemini API key obtained from [Google AI Studio](https://aistudio.google.com/):

```env
PORT=5000
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

> **Note**: If you run without setting a key, MAYA automatically operates in an offline simulation fallback mode, ensuring zero crashes while you explore the interface!

### 4. Running the Application

Run both the server and client concurrently with:

```bash
npm run dev
```

- **Frontend UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📂 Project Structure

```
maya/
├── package.json              # Monorepo runner scripts
├── .gitignore                # Git exclusions
├── .env.example              # Environment variables template
├── README.md                 # Project documentation
├── server/
│   ├── package.json          # Express & Gemini SDK dependencies
│   ├── .env                  # Backend secrets (never exposed to frontend)
│   ├── .env.example          # Server environment sample
│   ├── index.js              # Express app & REST API endpoints
│   ├── services/
│   │   └── gemini.js         # Gemini API service & offline fallback engine
│   └── prompts/
│       └── mayaPersona.js    # System instructions & simulated emotion schema
└── client/
    ├── package.json          # React, Tailwind, Vite dependencies
    ├── vite.config.js        # Vite config with /api reverse proxy to :5000
    ├── tailwind.config.js    # Custom midnight colors, glow shadows, keyframes
    ├── postcss.config.js     # PostCSS setup
    ├── index.html            # Webpage entry shell
    └── src/
        ├── main.jsx          # React DOM entry
        ├── App.jsx           # App layout & view management
        ├── index.css         # Tailwind & glassmorphism custom styles
        ├── components/
        │   ├── Navbar.jsx           # Header with branding and modal triggers
        │   ├── LandingHero.jsx      # Hero with live interactive avatar preview
        │   ├── ChatInterface.jsx    # Full responsive chat container
        │   ├── MayaAvatar.jsx       # Emotion-reactive SVG animated avatar
        │   ├── EmotionBadge.jsx     # Active simulated emotion badge + tooltip
        │   ├── MessageList.jsx      # Message feed with timestamps & copy
        │   ├── MessageInput.jsx     # Auto-expanding input with shortcuts
        │   ├── SuggestedPrompts.jsx # Quick starter prompt buttons
        │   ├── DisclaimerModal.jsx  # Ethical AI & simulated emotion disclosure
        │   └── ClearChatDialog.jsx  # Clear conversation confirmation modal
        ├── hooks/
        │   └── useChat.js           # Chat state & localStorage sync hook
        └── utils/
            └── emotions.js          # Emotion themes, colors, and descriptors
```

---

## 🛡️ Responsible AI & Ethical Boundaries

MAYA incorporates clear disclosures:
- Simulated emotions enhance relational context and warmth, but **do not represent sentient feelings or biological consciousness**.
- The interface features an **Ethics & Simulated Emotions Disclosure** accessible from the header and every message's emotion badge.
- Maya is designed for mindful companionship and reflection, not clinical psychiatric treatment.

---

## 📄 License
MIT License.

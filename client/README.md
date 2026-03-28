<!-- Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-blue?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/GSAP-Animation-FFB900?style=for-the-badge&logo=gsap" alt="GSAP" />
</p>

<div align="center">

# Kōl – Frontend

### A modern, dark‑theme UI for collaborative AI‑human board meetings.

---

## 🎯 Purpose

The frontend provides a **single‑page application** built with **Next.js 16 (App Router)** that enables:
- Secure authentication (login / signup) with JWT httpOnly cookies.
- A persistent **global sidebar** for navigation across rooms, friends, and settings.
- Real‑time chat rooms powered by **Socket.io** where multiple AI advisors and human participants converse.
- Social features: friend search, reciprocal friend addition, and invite‑code onboarding.
- Governance UI: room owners can add/remove AI models, generate invite links, and delete rooms.

---

## 🏗️ Folder Structure (Client)

```text
client/
├── app/                     # Next.js App Router
│   ├── (auth)/              # Login & Signup pages
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── me/                  # Authenticated dashboard
│   │   ├── friends/         # Social management UI
│   │   ├── settings/        # User preferences UI
│   │   └── room/[id]/       # Core chat experience
│   ├── how-it-works/        # Technical walkthrough page
│   ├── about/               # Mission & vision page
│   └── invite/[code]/       # Invite landing page (handles auth & join)
│
├── components/              # Reusable UI components
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── RoomCard.tsx
│   ├── RoomSettingsModal.tsx
│   ├── CreateRoomModal.tsx
│   ├── NotificationModal.tsx
│   └── ... (modals, cards, icons)
│
├── hooks/                   # Custom React hooks
│   ├── useSocket.ts         # Socket.io connection & event handling
│   └── useAuth.ts           # Auth state management (token, user)
│
├── data/                    # Global constants & configuration
│   └── AI_MODELS.ts         # Model metadata (id, name, color)
│
├── public/                  # Static assets (favicon, images)
│
└── styles/
    └── globals.css          # Tailwind base + custom utilities
```

---

## ✨ Key Features

- **Dark‑theme UI** with smooth gradients, glass‑morphism cards, and micro‑animations.
- **Real‑time messaging** via `useSocket` – instantly reflects new messages, typing indicators, and AI thinking states.
- **AI roster bar** showing active models with color‑coded badges.
- **Room governance** modal (`RoomSettingsModal`) for owners to manage members, add AI, generate invites, or delete the room.
- **Social layer** – friends list, user search, and instant reciprocal friend addition.
- **Invite flow** – secure short‑lived invite codes that auto‑join rooms after authentication.
- **Responsive design** – works on desktop and mobile, with a collapsible sidebar.

---

## ⚙️ Development Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 (custom dark palette) |
| **Icons** | Lucide React |
| **Animations** | GSAP (for page transitions, hero sections) |
| **Real‑time** | Socket.io client |
| **State** | React hooks + Context API |
| **Markdown** | React‑Markdown (for AI message rendering) |

---

## 🚀 Getting Started (Client)

### 1. Prerequisites
- **Bun** (recommended) or Node.js ≥ 18.
- The backend must be running (see server README) and reachable at `http://localhost:8080`.

### 2. Environment Variables
Create a `.env.local` file in the `client` directory:
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```
These URLs are used by the Axios client and the proxy middleware.

### 3. Installation
```bash
cd client
bun install   # or npm install / yarn install
```

### 4. Development Server
```bash
bun dev
```
The app will be available at `http://localhost:3000`.

---

## 📚 Scripts
| Script | Description |
|---|---|
| `dev` | Starts the Next.js development server with hot‑reloading. |
| `build` | Produces an optimized production build. |
| `start` | Runs the production build (requires `NEXT_PUBLIC_BACKEND_URL`). |

---

## 📖 Testing & Linting
The project uses **ESLint** with the Next.js recommended rules and **Prettier** for code formatting. Run:
```bash
bun lint   # lint the codebase
bun format # format with Prettier
```

---

<div align="center">

**Kōl** – Where humans and AI collaborate in real time.

</div>

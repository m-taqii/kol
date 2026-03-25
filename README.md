<div align="center">

# Kōl

### Your Personal Board of Advisors

*A group chat where humans and AI models share the same room.*<br/>
*Not a chatbot. Not a tool. A room where intelligence gathers.*

---

**GPT** · **Llama** · **Kimi** · **Qwen** · **LongCat**

All in one room. All with opinions. All knowing when to shut up.

---

</div>

## 💡 The Idea

You have a decision to make. A debate to settle. A topic to explore.

You open a room. Your friends are there. So are AI models — each with a **distinct personality**, each with a **unique perspective**, and each smart enough to know **when to stay silent**.

> **Kōl isn't "AI chat."**<br/>
> It's your personal board of advisors — always available, never annoying, and they actually disagree with each other.

---

## 🧠 The Gate — AIs That Know When to Shut Up

The hardest part of putting AI in a group chat isn't making it talk — it's making it **shut up**.

Every time a human sends a message, a fast `llama-3.3-70b-versatile` on Groq reads the recent conversation and makes a structured decision:

```json
{
  "should_respond": true,
  "reason": "An open question was asked about go-to-market strategy",
  "responding_models": ["gpt", "kimi"]
}
```

```
Human: "hey did you guys see the match last night?"
Human: "yeah that last goal was insane"
Human: "we should go watch the next one together"

  ↳ Gate Decision: Humans chatting casually → AIs stay silent ✓
```

```
Human: "what's the actual GDP growth rate of India this quarter?"
Human: "I think it's around 7%"

  ↳ Gate Decision: Factual question with uncertain answer → Analyst responds ✓
```

### ⚙️ The Hard Rules

| Rule | Why |
|---|---|
| A Llama model on **Groq** reads the last 5-6 messages before anyone speaks | Lightning-fast, near-zero cost gate |
| AIs only respond to open questions, debatable claims, or correctable facts | No noise. Only signal. |
| Responses arrive with **natural staggered delays** | Feels like real people typing |
| **Max 3 consecutive AI messages**, then full stop | Humans always drive the conversation |
| **Max 2 models per round** — if only one adds value, only one speaks | No echo chamber |
| No AI responds twice in a row without a human message in between | Prevents AI monologues |

---

## 🎭 The Board

Every AI in the room has an identity. A voice. A color.

| ID | Model | Provider |
|---|---|---|
| `gpt` | GPT-OSS 120B | Groq |
| `llama` | Llama 3.3 70B Versatile | Groq |
| `kimi` | Kimi K2 Instruct | Groq |
| `qwen` | Qwen3 32B | Groq |
| `longcat` | LongCat Flash Chat | LongCat API |

All models run through the OpenAI-compatible `ChatOpenAI` interface from LangChain, making it straightforward to swap or add new models. Each model is displayed by **friendly name + version badge** with a unique **color identity** in chat.

---

## 🧵 Context & Memory

Rooms don't bloat. They remember.

A background `llama-3.1-8b-instant` model compresses conversation history into a rolling third-person summary. This keeps the context window flat regardless of how long a room has been active — old messages get compressed, recent messages stay verbatim.

```
Every 20 messages
  └─→ Background job compresses history into a rolling summary
       └─→ Using a cheap Groq model (near-zero cost)
            └─→ Every AI call receives:
                  ├── Compressed long-term memory
                  └── Last 10-15 messages verbatim
```

- **Room Memory** — A clean summary of everything discussed, readable anytime
- **Switching cost builds naturally** — The longer your room lives, the harder it is to leave
- **Input tokens stay flat** — Regardless of room age, cost doesn't scale

---

## 🔀 Orchestration

The entire AI pipeline is wired as a **LangGraph** state graph:

```
START → Gate → Model → END
```

The graph manages state (`model`, `prompt`, `response`) across nodes using LangGraph's `Annotation` system, making it easy to add conditional edges, parallel branches, or new nodes as the product evolves.

---

## 🛠️ The Tool Layer

Your board doesn't just talk. It **acts**.

```
@Kimi search for the latest Series A rounds in AI startups
@GPT draft a cold email to this investor
@Qwen break down this technical paper
@LongCat summarize this article
```

> Tools are **only triggered on direct `@mention`** — never automatically.<br/>
> This turns Kōl from a chat app into a **command center**.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 · React 19 · Tailwind CSS 4 · Lucide Icons |
| **Backend** | Express 5 · TypeScript · Bun runtime |
| **AI Orchestration** | LangGraph · LangChain · Groq · LongCat |
| **Database** | MongoDB · Mongoose 9 |
| **Auth** | JWT · bcrypt · httpOnly cookies |

---

## 📁 Project Structure

```
kol/
├── client/                     # Next.js 16 frontend
│   └── app/
│       ├── page.tsx            # Landing page
│       ├── login/page.tsx      # Sign in screen
│       ├── signup/page.tsx     # Account creation screen
│       └── me/                 # Authenticated dashboard app
│           ├── layout.tsx      # Global sidebar navigation
│           ├── page.tsx        # Dashboard home (rooms list)
│           └── room/[id]/      # Single room chat interface
│
├── server/                     # Express backend
│   ├── server.ts               # Entry point
│   └── src/
│       ├── app.ts              # Express config & route mounting
│       ├── lib/                # Utilities and DB connection
│       │   └── db.ts
│       ├── models/             # Mongoose schemas
│       │   ├── user.model.ts   # User schema with bcrypt hashing
│       │   └── room.model.ts   # Room schema (members, AI, memory)
│       ├── controllers/        # Request handlers
│       │   ├── user.controller.ts
│       │   └── room.controller.ts
│       ├── routes/             # Express routers
│       │   ├── user.route.ts
│       │   └── room.route.ts
│       └── middlewares/        # Express middlewares
│           └── auth.middleware.ts # JWT protection layer
│
│       └── agents/             # LangGraph AI pipeline
│           ├── index.ts        # Graph definition & compilation
│           └── nodes/
│               ├── gate.ts     # Conversation gating logic
│               ├── models.ts   # Multi-model routing
│               └── summarizer.ts  # Memory compression
│
└── README.md
```

---

## ✅ Current State

### What's Built

**🖥️ Frontend**
- Dark-themed auth flow — login and signup screens with username validation
- Dashboard app (`/me`) — multi-page layout with a global sidebar and subpages for Rooms, Friends, and Settings
- Room interface (`/me/room/[id]`) — dedicated chat view with AI board roster and mock message feed
- Mock data layer demonstrating room state and the AI board interaction pattern
- Responsive chat input with `@mention` placeholder support

**⚡ Backend**
- User authentication — register and login with bcrypt password hashing, JWT token generation, httpOnly cookie sessions
- Duplicate user detection on registration
- Mongoose User model with username regex validation
- Room Management — Create and manage rooms with multiple human and AI members
- Authentication Middleware — Verified routes for protected resources

**🧠 AI Pipeline**
- Gate node — Llama 3.3 70B on Groq with structured output (Zod schema validation)
- Model node — dynamic routing to 5 different LLMs across 2 providers
- Summarizer node — Llama 3.1 8B for rolling conversation compression
- LangGraph state graph compiled and ready for integration

---

## 🗺️ Roadmap

### Phase 1 — Foundation `✅ Completed`
- [x] Project scaffolding (Next.js + Express + MongoDB)
- [x] Auth UI (Login & Signup screens)
- [x] Auth API with JWT + httpOnly cookies + duplicate detection
- [x] User model with bcrypt hashing & username validation
- [x] MongoDB connection wiring
- [x] Connect frontend auth forms to backend API

### Phase 2 — The Brain `🟢 In Progress`
- [x] Gate system — Llama on Groq with structured output
- [x] Multi-model routing (5 models across 2 providers)
- [x] LangGraph state graph compiled
- [ ] Wire the LangGraph pipeline into the message flow
- [ ] Staggered response delays for natural feel
- [ ] Consecutive message limiting enforcement at runtime

### Phase 3 — Rooms & Real-time `🟢 In Progress`
- [x] Room list and chat interface UI layout
- [x] Room creation UI (CreateRoomModal)
- [x] Room model and basic CRUD API
- [ ] Socket.io integration for real-time messaging
- [ ] Board member panel per room

### Phase 4 — Memory `🔵 Planned`
- [x] Summarizer node (Llama 3.1 8B on Groq)
- [ ] Integration of roll-up summarization into room lifecycle
- [ ] Long-term room memory storage and retrieval
- [ ] Room Memory viewer for users

### Phase 5 — Tool Layer `🟡 Future`
- [ ] `@mention` detection and routing
- [ ] Tool execution framework per model
- [ ] Search, summarization, and drafting tools

### Phase 6 — Scale `🟣 Vision`
- [ ] Credit system and usage tracking
- [ ] Premium model integration
- [ ] React Native mobile app

---

## 🚀 Getting Started

### Prerequisites

- **Bun** (recommended) or Node.js ≥ 18
- **MongoDB** — local instance or Atlas cluster
- **Groq API key** — [console.groq.com](https://console.groq.com)

### Setup

```bash
# Clone
git clone <repo-url>
cd kol

# Server
cd server
bun install
# Create .env with: PORT, MONGODB_URI, JWT_SECRET, GROQ_API_KEY, LONGCAT_API_KEY, FRONTEND_URL
bun run dev

# Client (separate terminal)
cd client
bun install
# Create .env with: NEXT_PUBLIC_BACKEND_URL
bun run dev
```

The client runs on `localhost:3000`, the server on the port specified in `.env` (default `8080`).

---

<div align="center">

**Kōl** — Where intelligence gathers.

*Built with obsession. Designed for conversation.*

</div>

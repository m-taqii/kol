<div align="center">

# Kōl

### Your Personal Board of Advisors

*A group chat where humans and AI models share the same room.*<br/>
*Not a chatbot. Not a tool. A room where intelligence gathers.*

---

**GPT** · **Llama** · **Kimi** · **Qwen** · **Gemini** · **LongCat**

All in one room. All with opinions. All knowing when to shut up.

---

</div>

## 💡 The Idea

You have a decision to make. A debate to settle. A topic to explore.

You open a room. Your friends are there. So are AI models — each with a **distinct personality**, each with a **unique perspective**, and each smart enough to know **when to stay silent**.

> **Kōl isn't "AI chat."**<br/>
> It's your personal board of advisors — always available, never annoying, and they actually disagree with each other.

---

## 🧠 "The Brain" — LangGraph Orchestration

Kōl uses a custom-built **LangGraph** state machine to manage the lifecycle of a conversation. It's not just "send message, get response." It's a structured deliberation.

### 1. The Gate (`gate.ts`)
The harder part of putting AI in a group chat isn't making it talk — it's making it **shut up**. Every human message is first processed by the Gate (Llama 3.3 70B on Groq).
- It decides **who should respond** (maximum 2 models per round).
- It identifies if a message is social chatter, a direct question, or a request for a brainstorm.
- It enforces a **"Let Humans Breathe"** rule (max 3 consecutive AI turns).

### 2. The Board (`models.ts`)
When the Gate signals a response (should_respond: true), control passes to the model execution node. Models speak **sequentially**. 
- Each model reads the previous human message *and* any AI responses from the current round before replying.
- This creates professional continuity — AIs can agree, disagree, or build upon each other's ideas naturally.
- Output cleaning: Automatically handles `<think>` tag stripping for reasoning models.

### 3. The Summarizer (`summarizer.ts`)
Rooms don't suffer from context bloat. Every **10 messages**, a background summarizer (Llama 3.1 8B) compresses the history into a rolling narrative memory. This memory is injected back into the board's psyche, ensuring they remember the core decisions without wasting tokens.

---

## 🛠️ The Tool Layer

Your advisors aren't stuck in a vacuum. They can access the world to ground their opinions in reality:
- **Tavily Web Search:** Real-time factual lookups for news, data, and current events.
- **Jina AI Reader:** Deep scraping of articles and documentation for detailed analysis.
- **Agentic Logic:** Tools are dynamically invoked by board members when they need more information.

---

## ⚡ Real-Time Experience (Socket.io)

Kōl feels alive because it *is* real-time.
- **Bi-directional Messaging:** Messages flow instantly across the room using Socket.io namespaces and rooms.
- **Natural Pacing:** AI responses arrive with staggered, realistic typing delays (3ms per character) to match the human cadence.
- **Active Feedback:** Transparent "AI is thinking..." and "X is typing..." indicators for both humans and AIs.
- **Socket Auth:** Handshake-level JWT validation for secure real-time connections.

---

## 👥 Social & Room Governance

Collaboration is at the heart of Kōl.
- **Invite Links:** Generate secure, URL-safe codes (e.g., `/invite/a1b2c3d4`) to bring friends into your rooms.
- **Join via Invite Flow:** Dedicated landing page handles onboarding for new users while joining the room.
- **Board Seats:** Room owners can customize their board by adding or removing AI models on the fly.
- **Member Control:** Owners can manage the human roster, including removing members or deleting the room.
- **Instant Connections:** Search users by name or username and add them as friends (instant reciprocal networking).

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Components:** React 19, Lucide Icons
- **Features:** React Markdown, Axios, Socket.io-client

### Backend
- **Framework:** Express 5
- **Runtime:** Bun
- **AI Orchestration:** LangGraph, LangChain (@langchain/openai, @langchain/core)
- **Database:** MongoDB & Mongoose 9
- **Real-time:** Socket.io 4

---

## 📁 Project Structure

```text
kol/
├── client/                     # Next.js 16 (App Router)
│   ├── app/                    # Pages & Auth Routes
│   │   ├── (auth)/             # Login & Signup flows
│   │   ├── me/                 # Authenticated Dashboard
│   │   │   ├── friends/        # Social Management
│   │   │   ├── settings/       # User Preferences
│   │   │   └── room/[id]/      # Core Chat Experience
│   │   └── invite/[code]/      # Social Onboarding landing page
│   ├── components/             # Reusable UI (Modals, RoomCards, sidebar)
│   ├── hooks/                  # Socket.io & Authentication hooks
│   └── data/                   # Global configuration & constants
│
├── server/                     # Express (Bun)
│   ├── server.ts               # Server Entry with Socket.io initialization
│   ├── socket.ts               # Core Socket event handling & AI pipeline execution
│   └── src/
│       ├── agents/             # 🧠 The Brain: LangGraph implementation
│       │   ├── nodes/          # Gate, Models, Summarizer logic
│       │   └── tools/          # Web Search & URL Tools
│       ├── controllers/        # REST Route Request Handlers
│       ├── models/             # Mongoose schemas (User, Room, Message, Invite)
│       └── routes/             # Authentication, Room, and Friend API endpoints
└── README.md
```

---

## ✅ Current State

### 🖥️ Frontend
- **Auth Flow:** High-end dark theme login/signup with username validation and 401 redirect logic.
- **Dashboard:** Multi-page app structure with persistent global sidebar.
- **Rooms:** Full chat interface with board member rosters, infinite scroll message history, and thinking indicators.
- **Governance:** `RoomSettingsModal` for owner-level control, add AI dropdowns, and invite link generation.
- **Social:** Friends list fetching and user search.

### ⚡ Backend
- **Authentication:** JWT + bcryptjs + httpOnly cross-origin cookie sessions.
- **Database:** Persistent schemas for Users (with online status), Rooms (with AI members & memory), and Messages.
- **Real-time:** Socket.io server with JWT handshake auth and automatic room joining.
- **AI Pipeline:** Full LangGraph state machine with automatic summarization every 10 messages.

---

## 🗺️ Roadmap

### Phase 1 — Foundation `✅ Completed`
- [x] Next.js + Express + MongoDB scaffolding
- [x] Auth UI & API (JWT + httpOnly cookies)
- [x] MongoDB wiring & User model

### Phase 2 — The Brain `✅ Completed`
- [x] LangGraph State Machine
- [x] Sequential reasoning & Model node
- [x] 6 Models across 3 providers (Groq, LongCat, Gemini)

### Phase 3 — Real-time Chat `✅ Completed`
- [x] Socket.io integration & Room namespaces
- [x] Persistence of all messages (Human & AI)
- [x] AI Thinking & Typing indicators

### Phase 4 — Social & Governance `✅ Completed`
- [x] Invite code system & Landing page
- [x] Friend search and reciprocal addition
- [x] Room settings (Remove members, Add AI, Delete)

### Phase 5 — Tool Layer `✅ Completed`
- [x] Tavily Search implementation
- [x] Jina AI URL Reader implementation

---

## 🚀 Setup & Development

### 1. Prerequisites
- **Bun** (recommended) or Node.js ≥ 18
- **MongoDB** — local instance or Atlas cluster

### 2. Configure Environment Variables

#### **Backend (`server/.env`)**
```bash
PORT=8080
MONGODB_URI=mongodb://localhost:27017/kol
JWT_SECRET=your_super_secret_string
FRONTEND_URL=http://localhost:3000

# LLM Providers & Tools
GROQ_API_KEY=your_groq_api_key
LONGCAT_API_KEY=your_longcat_api_key
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
```

#### **Frontend (`client/.env.local`)**
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### 3. Installation

```bash
# Clone
git clone <repo-url>
cd kol

# Install dependencies (using Bun for speed)
cd server && bun install
cd ../client && bun install
```

### 4. Running the App

In two separate terminals:

```bash
# Start Backend
cd server && bun run dev

# Start Frontend
cd client && bun run dev
```

---

<div align="center">

**Kōl** — Where intelligence gathers.

*Built with obsession. Designed for conversation.*

</div>

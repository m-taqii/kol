# Kōl — Backend Services

This is the backend server for **Kōl**, a platform where humans and AI models share a group chat. The backend handles REST API requests, long-term database storage, real-time message orchestration, and the LangGraph-based AI simulation layer ("The Brain").

---

## 🏗️ Architecture

The backend is built using a modern, fast stack designed for high concurrency and heavy LLM orchestration:

*   **Runtime:** Node.js (via Bun for speed during development)
*   **Web Framework:** Express.js `v5` (handles Auth and REST endpoints)
*   **Real-time Layer:** Socket.io (bidirectional messaging, typing indicators, AI active states)
*   **Database:** MongoDB & Mongoose
*   **AI Orchestration:** LangGraph (TypeScript) & `@langchain/core`

### Directory Structure

```text
server/
├── server.ts              # Entry point
└── src/
    ├── app.ts            # Express setup & Middleware
    ├── agents/           # 🧠 The Brain: LangGraph implementation
    │   ├── index.ts      # Graph compiled edges and nodes
    │   └── nodes/        # Individual agent nodes
    │       ├── gate.ts   # The routing/decision layer
    │       ├── models.ts # Multi-model proxy execution
    │       └── summarizer.ts # Continuous memory compression
    ├── controllers/      # API Controllers (REST layer)
    │   ├── user.controller.ts
    │   ├── room.controller.ts
    │   └── friend.controller.ts
    ├── lib/              # Core utilities (e.g., db.ts)
    ├── middlewares/      # Express middlewares
    ├── models/           # Mongoose schemas
    │   ├── user.model.ts
    │   ├── room.model.ts
    │   ├── message.model.ts
    │   └── invite.model.ts
    └── routes/           # Express router definitions
        ├── user.route.ts
        ├── room.route.ts
        └── friend.route.ts
```

---

## 🧠 "The Brain" (LangGraph Execution)

The core differentiation of Kōl is the AI orchestration layer located in `src/agents`. We use **LangGraph** to model the lifecycle of a message passing through the AI pipeline.

### 1. The Gate (`gate.ts`)
*The hardest part of putting AI in a group chat isn't making it talk — it's making it shut up.*
- **Model:** `llama-3.3-70b-versatile` running on Groq (near-zero latency).
- **Function:** Reads human messages and returns a structured output (`GateResponseSchema`) deciding:
  1. `should_respond`: `boolean`
  2. `reason`: `string`
  3. `responding_models`: `string[]` (max 2)
- **Rules:** The Gate enforces limits (max 3 consecutive AI messages, alternating model turns, preventing AI monologues).

### 2. The Board (`models.ts`)
When the Gate approves a response, control passes to the model execution layer. Models execute sequentially, meaning each model reads the previous AI's response before replying, creating a true "board meeting" effect. Supported models:
- 📐 **GPT:** `gpt-oss-120b`
- 🎯 **Llama:** `llama-3.3-70b-versatile`
- 🔗 **Kimi:** `moonshotai/kimi-k2-instruct-0905`
- ⚔️ **Qwen:** `qwen/qwen3-32b`
- 🐈 **Longcat:** `LongCat-Flash-Chat`
- 🌟 **Gemini:** `gemini-2.5-flash`

Models have access to **Agentic Tools** during execution:
- `tavily_search_results_json`: Real-time web search for facts.
- `read_url`: Jina AI-powered URL content scraping.

### 3. The Summarizer (`summarizer.ts`)
- **Model:** `llama-3.1-8b-instant` running on Groq.
- **Function:** Compresses conversation history into a third-person rolling summary every **10 messages**. This memory is injected into future AI responses to ensure context scales without token bloat.

---

## 🔒 Authentication API

The REST API currently provides secure JWT-based authentication.

### `POST /auth/register`

Registers a new user, hashes the password via bcrypt, and returns a user payload.

**Request Body:**
```json
{
  "name": "Alex Johnson",
  "username": "alex_j",
  "email": "alex@example.com",
  "password": "securepassword123"
}
```

**Success Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "name": "Alex Johnson",
    "username": "alex_j",
    "email": "alex@example.com",
    "_id": "60d5ecb8b392cb3e4c8b4567"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

A `token` httpOnly cookie is also set automatically (7-day expiry).

**Error Responses:**
- `400 Bad Request`: "User already exists" — email or username already taken
- `500 Server Error`: Internal database or processing error

---

### `POST /auth/login`

Authenticates a user and establishes their session.

**Request Body:**
```json
{
  "email": "alex@example.com",
  "username": "alex_j",
  "password": "securepassword123"
}
```

**Success Response (200 OK):**
```json
{
  "message": "User logged in successfully",
  "user": {
    "name": "Alex Johnson",
    "username": "alex_j",
    "email": "alex@example.com",
    "_id": "60d5ecb8b392cb3e4c8b4567"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

A `token` httpOnly cookie is also set automatically (7-day expiry).

**Error Responses:**
- `404 Not Found` / `401 Unauthorized`: "Invalid Email or Password" — generic message to prevent user enumeration
- `500 Server Error`: Internal database or processing error

---

## 🏠 Room API

Endpoints for creating and managing chat rooms. All endpoints require a valid JWT token.

### `POST /room/create`

Creates a new chat room and adds the specified members and AI models.

**Request Body:**
```json
{
  "name": "Project Strategy",
  "members": ["alex_j", "sarah_c"],
  "aiMembers": ["gpt", "kimi"]
}
```

**Success Response (201 Created):**
```json
{
  "name": "Project Strategy",
  "owner": "60d5ecb8b392cb3e4c8b4567",
  "members": [
    "60d5ecb8b392cb3e4c8b4567",
    "60d5ecb8b392cb3e4c8b4568"
  ],
  "aiMembers": ["gpt", "kimi"],
  "memory": "",
  "messageCount": 0,
  "_id": "60d5ecb8b392cb3e4c8b4569",
  "createdAt": "2026-03-15T12:00:00.000Z",
  "updatedAt": "2026-03-15T12:00:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Server Error`: Failed to create room

### `POST /room/:roomId/invite`
Generates a unique, short invite code for the room. Only the room owner can call this.

**Success Response (201 Created):**
```json
{
  "inviteUrl": "http://localhost:3000/invite/a1b2c3d4",
  "code": "a1b2c3d4"
}
```

### `GET /room/invite/:code`
Allows a user to join a room via an invite code. Returns the `roomId` on success.

**Success Response (200 OK):**
```json
{
  "success": true,
  "roomId": "60d5ecb8b392cb3e4c8b4569"
}
```

### `DELETE /room/:roomId`
Deletes the room and all associated invites. Only the owner can delete.

**Success Response (200 OK):**
```json
{ "success": true }
```

### `POST /room/:roomId/leave`
Allows a member to leave a room. Owners cannot leave their own rooms.

**Success Response (200 OK):**
```json
{ "success": true }
```

### `DELETE /room/:roomId/member/:userId`
Removes a specific human member from the room. Only the room owner can perform this.

### `POST /room/:roomId/ai/add`
Adds a new AI board member to the room.
**Body:** `{ "aiModelId": "gemini" }`

---

## 👥 Friends API
Social endpoints for connecting with other users.

### `GET /friends/list`
Lists the current user's friends with their online status.

**Success Response (200 OK):**
```json
[
  {
    "_id": "60d5ecb8b392cb3e4c8b4567",
    "name": "Sarah Connor",
    "username": "sarah_c",
    "online": true
  }
]
```

### `GET /friends/search?q=query`
Search for users by name or username to add as friends.

**Success Response (200 OK):**
```json
[
  {
    "_id": "60d5ecb8b392cb3e4c8b4568",
    "name": "John Connor",
    "username": "john_c",
    "online": false
  }
]
```

### `POST /friends/add`
Instantly adds a user as a friend (reciprocal).
**Body:** `{ "username": "target_user" }`

**Success Response (200 OK):**
```json
{ "success": true }
```

---

## 🚀 Setup & Development

### 1. Environment Configuration

Create a `.env` file in the `server` directory.

```bash
PORT=4000
MONGODB_URI=mongodb://localhost:27017/kol
JWT_SECRET=your_super_secret_string
FRONTEND_URL=http://localhost:3000

# LLM Providers & Tools
GROQ_API_KEY=your_groq_api_key
LONGCAT_API_KEY=your_longcat_api_key
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
```

### 2. Install Dependencies

You can use npm, but **Bun** is recommended for this project:

```bash
bun install
```

### 3. Start the Server

Start in development mode with watch (via `tsx`):

```bash
bun run dev
```

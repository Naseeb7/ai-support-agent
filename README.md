# AI Support Agent – Backend

This repository contains the backend for a minimal AI-powered customer support chat system.

The goal was not to build a flashy demo, but to build something that:

- behaves predictably under failure  
- persists data correctly  
- resembles a real production service rather than a toy app  

The system simulates how an AI support agent would work behind a live chat widget.

---

## What This Does

- Accepts user messages via a chat endpoint  
- Resolves or creates a conversation session  
- Persists every message (user + AI)  
- Calls a real LLM (OpenAI) to generate replies  
- Handles LLM failures gracefully without crashing  
- Maintains conversation context across messages  

> No authentication is included by design (see scope decisions below).

---

## Tech Stack

- Node.js + TypeScript  
- Express  
- MongoDB + Mongoose  
- OpenAI API  

The architecture is intentionally simple and modular, optimized for clarity and extensibility rather than over-engineering.

---

## Core Design Decisions (Important)

### 1. Append-only message log

Messages are never updated or overwritten.

Every user message and every AI response (including failures) is persisted as a separate record.

This makes the system:

- auditable  
- debuggable  
- safe against partial failures  

---

### 2. Explicit message correlation

Each AI message explicitly references the user message it responds to via `replyToMessageId`.

This allows:

- precise error attribution  
- selective retries in the future  
- clean UI mapping (user bubble → AI bubble)  

This avoids relying on fragile assumptions like ordering or timestamps.

---

### 3. Failure is treated as data

LLM failures:

- do not crash the server  
- do not skip persistence  
- are stored as AI messages with `status: "error"`  

This is intentional: external APIs fail in real systems, and the backend must remain stable when they do.

---

### 4. Conversation handling is strict

- A new conversation is created **only** when no `sessionId` is provided  
- Invalid `sessionId`s do **not** silently create new conversations  

This prevents accidental data fragmentation and makes client behavior explicit.

---

### 5. Minimal but intentional logging

The backend logs only at failure boundaries (LLM failures, persistence failures), using structured logs.

This keeps noise low while still allowing:

- issue correlation  
- production debugging  
- operational visibility  

A full logging framework was intentionally avoided to keep scope aligned.

---

## API Overview

### `POST /chat/message`

#### Request

```json
{
  "message": "What are your support hours?",
  "sessionId": "optional"
}
```

#### Response (success)

```json
{
  "reply": "Our support hours are...",
  "sessionId": "abc123",
  "status": "success"
}
```

#### Response (error)

```json
{
  "reply": null,
  "sessionId": "abc123",
  "status": "error"
}
```

---

## Database Models (High Level)

### Conversation

- Represents a chat session  
- Created explicitly  
- Can be extended later to support authenticated users  

### Message

- Represents a single user or AI message  
- Append-only  
- AI messages optionally reference the user message they respond to  

---

## Environment Variables

```env
PORT=3000
MONGO_URI=your_mongo_connection_string
OPENAI_API_KEY=your_openai_api_key
LLM_MODEL=gpt-4o-mini
LLM_TIMEOUT_MS=15000
LLM_MAX_TOKENS=1000
MAX_HISTORY_MESSAGES=10
```

---

## Running Locally

```bash
npm install
npm run dev
```

Make sure MongoDB is running and environment variables are set.

---

## Scope Decisions & Trade-offs

### Why no authentication?

Authentication and user-based conversations were intentionally excluded.

This assignment focuses on:

- LLM orchestration  
- conversation handling  
- persistence correctness  
- robustness under failure  

The system is designed so that adding user-based conversations later would be straightforward by:

- adding `userId` to conversations  
- enforcing authorization in the service layer  

---

### Why no streaming / retries / caching?

These features add complexity but were not necessary to demonstrate core correctness.

The emphasis here was on:

- deterministic behavior  
- clean failure handling  
- clear architecture  

---

## If I Had More Time

- User authentication and user-scoped conversations  
- Retry logic for transient LLM failures  
- Conversation history retrieval endpoint  
- Basic rate limiting  
- Frontend streaming responses  

---

## Final Note

This project is intentionally boring in the best way.

The goal was to build something that:

- doesn’t surprise you at runtime  
- doesn’t lose data when things go wrong  
- could realistically evolve into a real product  

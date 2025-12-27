# Project Rules (Non-Negotiable)

## Architecture
- Routes must be thin and only handle HTTP concerns
- Business logic lives in services
- LLM logic lives only in LLMService
- No logic in server.ts
- No logic in app.ts

## Persistence
- Conversations are append-only
- Every user message is persisted
- Every AI response attempt is persisted (success or failure)
- Backend never creates a new conversation if a sessionId is provided and invalid

## Validation
- Routes validate request shape only
- Services validate business rules

## Boundaries
- LLMService must not access the database
- LLMService must not know business/domain data
- Domain data must not live in services
- Config values must not be hardcoded inside services

## Coding Discipline
- Do not invent files unless explicitly instructed
- Do not combine layers
- Do not add abstractions unless requested
- Use TODO comments only when instructions are unclear

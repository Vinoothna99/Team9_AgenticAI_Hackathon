# Hackathon Team Project Notes

## 1) CLI and Workflow Quick Reference

`Ctrl+G` is useful for complex prompts: write multi-line instructions in your editor, save and close, then send the full prompt. Requires `$EDITOR` to be set (example: `export EDITOR=vim`).

### Commands
- `/plan` — Enter planning mode
- `/compact` — Summarize to free context
- `/clear` — Reset conversation entirely
- `/resume` — Resume a previous session
- `/init` — Generate `CLAUDE.md`
- `/help` — Show all commands
- `Ctrl+G` — Open prompt in `$EDITOR`
- `! command` — Run bash directly
- `Cmd+P` — Open model picker

### Useful Flags and References
- `claude --permission-mode acceptEdits`
- `claude --worktree feature-auth` - Claude worktree
- `github.com/modelcontextprotocol/servers`

### Additional Workflow Notes
- "Ultrathink" = one word, maximum reasoning
- Session A = build
- Session B = fresh review
- Interview mode
- Verification-driven: be specific
- `esc` `esc` = worst-case exit
- Subagents are in `.claude` directory

## 2) Project Framing

1. Start with a pain you have personally felt.
2. Validate with 3 real users.
3. Scope to 1 core workflow.
4. Ask: Why AI?

Use what you know.

## 3) Team Roles

- Backend Engineer: Builds APIs, handles data processing, and integrates AI endpoints.
- AI/ML Engineer: Builds and tunes the AI pipeline; owns prompts, embeddings, and retrieval logic.
- DevOps: Handles deployment, CI/CD, and infrastructure; gets the product live early.
- Frontend Engineer: Implements the UI, wires API calls, and ensures a smooth user experience.
- Product Manager - Validates the GTM fit and user case
- UX/UI Engineer - disigning the user experirnece with the product

## 4) Week-by-Week Plan

### Week 1 — Define and Plan
Finalize the problem, validate with users, write a 1-page PRD, assign roles, set up GitHub Projects, and lock the tech stack.

### Week 2 — Build Foundations
Finish UI mockups, get backend scaffolding live, prototype AI pipeline, and deploy a "hello world" to production.

### Week 3 — Integration Sprint
Wire frontend to backend, connect AI endpoints, start end-to-end testing, and fix broken flows.

### Week 4 — Polish and Test
Fix bugs, tune AI responses, improve UX, run user tests, and prepare demo script.

### Week 5 — Demo Ready
Rehearse demo 3 times, prepare for judge questions, finalize slides, and ship the final build.

## 5) Core Tools

- Logging tools: LangSmith, Sentry, or simple console logs. Track AI requests, errors, and latency from day one.
- Vercel / Render: Deploy early and often; use continuous deployment from `main`.
- GitHub Projects: Use a Kanban board. Every task should be an issue with a DRI and due date. Update daily.
- Notion: PRD, technical specs, API docs, and meeting notes. Keep this as the single source of truth.

## 6) Stack (To Finalize)

- Frontend: TBD
- Backend: TBD
- AI: TBD
- Deploy: TBD

PRD = Product Requirements Document.

## 7) What to Document

- 1-page PRD — Problem, user, solution, scope, success metrics
- API spec — Endpoint names, request/response formats
- AI pipeline diagram — Data flow from input to output
- Deployment guide — Steps to deploy from scratch

## 8) Build Order

1. UI mockups first — Get screens designed and approved before coding.
2. Backend APIs next — Stub endpoints with mock data so frontend can integrate early.
3. AI pipeline in parallel — Build and test AI flow separately, then integrate into backend.
4. Integration week — Wire everything together; expect bugs; use logging and testing.

## 9) Technical and Team Traps

### Technical Traps
- API key management — Use env vars from day one. Never commit secrets.
- Rate limits and costs — Know AI API limits and cache responses during development.
- "Perfect prompt" rabbit hole — Get it working first, then iterate.
- Last-minute deploys — Deploy early; iterate in production, not in panic.

Keep secrets in `.env`.

### Team Traps
- Invisible work — If it is not on the board, no one knows it is happening.
- Hero syndrome — One person doing everything burns out fast; delegate.
- Ghost teammates — Check in daily and address absence early.
- Bikeshedding — Do not over-debate small details; ship the feature.

## 10) AI-Specific Notes

- Start simple — Use the simplest AI approach that solves the problem.
- Log everything — Track every AI request, response, latency, and error.
- Test edge cases — Include weird inputs, long documents, and nonsense queries.
- Prompt engineering matters — Use examples, constraints, and output format.
- Cache when possible — Save cost and speed up iteration.
- Know your limits — Understand rate limits, context windows, and cost per request.

Good RAG + prompt often beats a complex multi-agent setup you cannot debug.

## 11) Final Checklist

1. Assign roles and leads — PM, UI/UX, AI, Backend, Frontend, DevOps; each area has a DRI.
2. Set up GitHub Projects — Kanban board, issues, labels, due dates; keep it updated.
3. Lock tech stack and deploy early — Be strategic with new tools; test deploy pipeline early.
4. Scope ruthlessly — Must-haves only; cut anything not demo-able.
5. Document first, build second — PRDs give your team and AI tools better context.
6. Build in dependency order — UI, then APIs, then AI, then integration.
7. Communicate daily, sync weekly — Async standups + weekly calls; add logging while building.
8. Demo day = storytelling — Show user journey, explain AI approach, rehearse 3 times.

## 12) Agent Design Notes: Tools and State

### Core Idea
- Agent = Tools + State
- Tools = how you take actions
- State = how you manage memory/context

### Tool Design Notes
- Tools are the agent’s hands.
- Tool descriptions should include:
  - what the tool does
  - when to use it
  - when not to use it
- Define tool contracts in JSON.
- Return a string.
- If behavior is the same for everyone → use prompt instructions.
- If behavior varies by user/session → use a tool.
- Write tool descriptions for the LLM, not for humans.
- Tool = dynamic data.

### State Design Notes
- State = agent memory.
- Inject state dynamically.
- Inject context every turn dynamically.
- Never let tools query global state; always filter by user.
- Use windowing to keep recent turns.

### Memory Scoping Pitfall
Always scope queries to the specific user.

### Memory Approaches
1. Raw history — Full message list (SQL)
2. Compaction — LLM summarizes old turns (SQL)
3. Structured recall — Extracted facts (SQL)
4. Vector DB — "Find similar" retrieval (Vector DB)

Question to explore: How does Vector DB work?

### Example JSON Schema
```json
{
  "type": "function",
  "function": {
    "name": "complete_todo",
    "description": "Mark done.\nUSE WHEN: ...\nDO NOT USE WHEN: ...",
    "parameters": {
      "type": "object",
      "properties": {
        "todo_id": {
          "type": "string"
        }
      }
    }
  }
}
```

Backend question: Where is my data coming from?

Go deep on what you find interesting.

## 13) Open Technical Questions

- How does Docker build work?
- How does React connect to the backend?
- How do APIs handle callbacks?
- How do we build APIs?
- How do we define latency, scalability, reliability, and CAP theorem tradeoffs for this MVP?
- What scope are we targeting?
- What should the UI look like?
- Is this mobile-focused or web-app-focused?
- What does TypeScript programming look like, and what should a programmer know?
- Which frontend tools should we use?
- Which tech stack should we focus on?

## 14) Containers and Orchestration Notes

- Containers package everything the app needs to run.
- Kubernetes controls these packages:
  - what to deploy
  - how many to deploy
  - where to deploy
  - coordination
  - replacement of unhealthy instances

## 15) VaultAI Data Sources and Data Flow

VaultAI has 3 data sources:
1. The user (direct input)
2. Tavily (live web data)
3. Your own databases (persisted state)

### 15.1 The User (Direct Input)

The user provides data in two ways:

#### A) CSV Upload
The user exports a bank statement and uploads it through the UI.

Example:
```csv
Date,Description,Amount
2026-01-03,Amazon,-52.99
2026-01-05,Salary,3200.00
2026-01-07,Starbucks,-6.50
```

This is raw financial data and may include PII (names or account numbers in descriptions). The app sanitizes it before it touches the agent.

#### B) Chat Messages
Users type messages like:
- "I just had a baby"
- "I’m thinking about buying a house"

These are unstructured. The agent extracts meaning and writes structured life events to ChromaDB memory.

### 15.2 Tavily (Live Web Data)

The agent calls Tavily for real-world financial info not in the CSV, such as:
- Current IRS tax codes and credit amounts
- Today’s T-Bill interest rates
- Fed funds rate
- Recent financial regulation news

Tavily returns structured results that are injected into the LLM prompt. The LLM reasons over user data + live context together.

### 15.3 App Databases (Persisted State)

#### PostgreSQL (Relational)
- User accounts and sessions
- Metadata about uploaded CSVs (filename, upload date, row count — not raw content)
- Conversation history (chat log)

#### ChromaDB (Vector)
- Life events extracted from chat (example: "new child, July 2026")
- Financial goals (example: "wants to buy a house in 3 years")
- Retrieved by similarity search, not SQL

### 15.4 End-to-End Data Flow

1. User uploads CSV
2. `[frontend]` sends file to `[api]`
3. `[api]` forwards to `[agent]`
4. `[agent]` runs PII masker locally (raw data stops here)
5. `[agent]` calls CanvasCloud.ai with sanitized data only
6. `[agent]` calls Tavily if live market/tax data is needed
7. `[agent]` writes findings to ChromaDB (memory) + Postgres (session log)
8. `[api]` returns response to `[frontend]`
9. User sees recommendation

### 15.5 What VaultAI Does NOT Have

- No bank API integration (no Plaid, no OAuth to Chase) — users manually export and upload CSV
- No real-time transaction syncing
- No cloud storage of financial data — CSV never leaves the Docker network

This is intentional: it is a privacy tradeoff, a simpler implementation path, and a core value proposition.

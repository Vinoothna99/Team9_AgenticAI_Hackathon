# CLI / Workflow Notes

`Ctrl+G` is a game-changer for complex prompts: write multi-line instructions in your editor, save and close, and it sends the whole thing. Requires `$EDITOR` to be set (example: `export EDITOR=vim`).

Commands:
- `/plan` — Enter planning mode
- `/compact` — Summarize to free context
- `/clear` — Reset conversation entirely
- `/resume` — Pick up a previous session
- `/init` — Generate `CLAUDE.md`
- `/help` — Show all available commands
- `Ctrl+G` — Open prompt in `$EDITOR`
- `! command` — Run bash directly
- `Cmd+P` — Open model picker

Useful flags / refs:
- `claude --permission-mode acceptEdits`
- `claude --worktree feature-auth`
- `github.com/modelcontextprotocol/servers`

Other notes:
- "Ultrathink" = one word, maximum reasoning
- Session A = build
- Session B = fresh review
- Interview Mode
- Verification-driven: be specific
- `esc` `esc` = worst-case exit
- Subagents in `.claude` directory

## Project Framing

1) Start with a pain you've felt
2) Validate with 3 real users
3) Scope to 1 core workflow
4) Ask: Why AI?

Use what you know.

## Team Roles

- Backend Engineer: Builds APIs, handles data processing, and integrates AI endpoints.
- AI/ML Engineer: Builds and tunes the AI pipeline; owns prompts, embeddings, and retrieval logic.
- DevOps: Handles deployment, CI/CD, and infrastructure; gets the product live early.
- Frontend Engineer: Implements the UI, wires API calls, and ensures a smooth user experience.

## Week-by-Week Plan

Week 1 — Define & Plan
Finalize the problem, validate with users, write a 1-page PRD, assign roles, set up GitHub Projects, and lock the tech stack.

Week 2 — Build Foundations
Finish UI mockups, get backend scaffolding live, prototype AI pipeline, and deploy "hello world" to production.

Week 3 — Integration Sprint
Wire frontend to backend, connect AI endpoints, start end-to-end testing, and fix broken flows.

Week 4 — Polish & Test
Fix bugs, tune AI responses, improve UX, run user tests, and prepare demo script.

Week 5 — Demo Ready
Rehearse demo 3x, prep for judge questions, finalize slides, and ship final build.

## Core Tools

- Logging tools: LangSmith, Sentry, or simple console logs. Track AI requests, errors, and latency from day one.
- Vercel / Render: Deploy early and often; use continuous deployment from `main`.
- GitHub Projects: Kanban board for tracking; every task is an issue with a DRI and due date; update daily.
- Notion: PRD, technical specs, API docs, and meeting notes; single source of truth.

## Stack

Frontend:   
Backend:  
AI:   
Deploy: 

PRD = Product Requirements Document.

## What to Document

- 1-page PRD — Problem, user, solution, scope, success metrics
- API spec — Endpoint names, request/response formats
- AI pipeline diagram — How data flows from input to output
- Deployment guide — Steps to deploy from scratch

## Build Order

1) UI mockups first — Get screens designed and approved before coding.
2) Backend APIs next — Stub endpoints with mock data so frontend can integrate early.
3) AI pipeline in parallel — Build and test AI flow separately, then integrate into backend.
4) Integration week — Wire everything together; expect bugs; rely on logging and testing.

## Technical Traps

- API key management — Use env vars from day one. Never commit secrets.
- Rate limits and costs — Know AI API limits; cache responses during dev.
- "Perfect prompt" rabbit hole — Get it working first, then iterate.
- Last-minute deploys — Deploy early; iterate in production, not in panic.

Keep secrets in `.env`.

## Team Traps

- Invisible work — If it’s not on the board, no one knows it’s happening.
- Hero syndrome — One person doing everything burns out fast; delegate.
- Ghost teammates — Check in daily; address absence early.
- Bikeshedding — Stop debating minor details; ship the feature.

## AI-Specific Notes

- Start simple — Use the simplest AI approach that solves the problem. Good RAG + prompt beats a complex system you can’t debug.
- Log everything — Track every AI request, response, latency, and error.
- Test edge cases — Use weird inputs, long docs, and nonsense queries.
- Prompt engineering matters — Use examples, constraints, and output format.
- Cache when possible — Save money and speed up iteration.
- Know your limits — Understand rate limits, context windows, and cost per request.

## Final Checklist

1) Assign roles and leads — PM, UI/UX, AI, Backend, Frontend, DevOps; every area has a DRI.
2) Set up GitHub Projects — Kanban board, issues, labels, due dates; keep it updated.
3) Lock tech stack and deploy early — Be strategic with new tools; test deploy pipeline early.
4) Scope ruthlessly — Must-haves only; cut anything not demo-able.
5) Document first, build second — PRDs give team and AI tools better context.
6) Build in dependency order — UI, then APIs, then AI, then integration.
7) Communicate daily, sync weekly — Async standups + weekly calls; add logging as you build.
8) Demo day = storytelling — Show user journey, explain AI approach, rehearse 3x.


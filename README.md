# VaultAI — The Zero-Knowledge Wealth Copilot

> A 365-day, highly personalized financial AI agent that proactively manages your taxes, budget, and investments—without ever letting your raw bank data touch the cloud.

---

## The Problem

| Pain Point | Description |
|---|---|
| **The Trust Gap** | People want AI to manage their money, but fear uploading raw bank statements or transaction history to the cloud. |
| **Goldfish Memory** | Current AI bots forget who you are when you close the tab. Real financial planning requires 365 days of context—e.g., remembering you had a baby in February to claim a tax credit in April. |

---

## The Solution

VaultAI acts like a **Family Office in your pocket**. It is an agentic workflow that runs primarily on the user's local machine (for privacy) while using a cloud LLM only for reasoning—never for storing raw data.

**The agent does three things autonomously:**

1. **Sanitizes Data** — strips PII from statements before the AI ever sees them
2. **Builds a 365-Day Profile** — extracts life events and financial goals from casual chat and persists them to a local long-term memory vault
3. **Executes Wealth Strategies** — runs deterministic forecasting code, searches the web for live tax-code updates, and recommends exact investment actions

---

## Agent Tools

| Tool | What It Does | Implementation |
|---|---|---|
| **Privacy Shield** | Strips PII from uploaded CSV bank statements locally before any LLM call | Python regex / local script |
| **Long-Term Memory** | Autonomously updates the user's Life Profile from chat context | Local vector DB (ChromaDB) or JSON vault |
| **Real-Time Web Search** | Fetches current IRS tax codes, interest rates, and financial news | Tavily API |
| **Cash Flow Forecaster** | Predicts next month's cash flow from the sanitized CSV | Deterministic Python / Pandas function (tool call, not LLM-generated code) |

> **Mentor note:** The forecaster is implemented as a deterministic tool call—not LLM-generated code on the fly—for reliability and debuggability.

---

## Demo Script: "The Time-Travel Demo"

**January** — Upload a CSV. VaultAI sanitizes it locally (no PII leaves the machine). Agent notices heavy tech-gear spending and asks: *"Are you a freelancer? We can write this off."*

**July** — User chats: *"I just had a baby girl!"* Agent silently writes `{"life_event": "new_child", "date": "2026-07"}` to the long-term memory vault.

**Next Tax Season** — User clicks "Prepare my Taxes." VaultAI:
- Retrieves the July memory and surfaces the **$2,000 Child Tax Credit** automatically
- Runs the forecaster and finds **$5,000 in surplus**
- Calls Tavily to confirm **T-Bills at 5% yield**
- Delivers a complete, sourced tax + investment recommendation

---

## Tech Stack (Build Progression)

The stack is built in phases, adding complexity only as the core loop is validated.

### Phase 1 — Core Agent Loop (Week 1–2)
Get the basic agent talking to the LLM and calling tools. No masking yet.

| Layer | Choice | Reason |
|---|---|---|
| Language | Python 3.11+ | Pandas, scripting, AI ecosystem |
| LLM | CanvasCloud.ai API | Hackathon-provided reasoning engine |
| Agent Framework | TBD (LangGraph / raw API) | Evaluate during Phase 1 |
| Memory (temp) | JSON file | Simple, no infrastructure needed |
| Web Search | Tavily API | Purpose-built for AI agents; structured results |
| Forecaster | Python + Pandas | Deterministic function, called as a tool |

### Phase 2 — Persistent Memory (Week 2–3)
Swap temp JSON for a real local vector store once the agent flow is proven.

| Layer | Choice | Reason |
|---|---|---|
| Long-Term Memory | ChromaDB (local) | Runs fully on-device; no cloud dependency |
| Embeddings | sentence-transformers | Local model, no API call needed |

### Phase 3 — Frontend & Integration (Week 3–4)
Wire a UI to the backend so the demo is showable to judges.

| Layer | Choice | Reason |
|---|---|---|
| Backend API | FastAPI | Lightweight, async, easy to document |
| Frontend | TBD | To be decided by frontend lead |
| Containerization | Docker + Docker Compose | All services (agent, memory, API) run in isolated containers on the user's machine—raw financial data never leaves the local environment |
| Deployment | Local Docker (no cloud) | Privacy constraint; only outbound traffic is LLM API calls and Tavily search |

### Phase 4 — Privacy Shield (Week 4, do last)
Per mentor guidance: implement PII masking last, after all flows are validated on clean data.

| Layer | Choice | Reason |
|---|---|---|
| PII Masking | Python regex + UID mapping | Replace names/account numbers with stable UIDs before any LLM call |

---

## Repository Structure

```
/
├── README.md
├── CLAUDE.md               # Claude Code project instructions
├── Notes.md                # Team workflow and hackathon notes
├── .env.example            # Required environment variables (copy to .env)
├── docker-compose.yml      # Spins up all services locally
├── participant-resources/  # Read-only hackathon reference material
└── src/
    ├── agent/              # Core agent loop and tool definitions
    ├── tools/              # Privacy shield, forecaster, search, memory
    ├── memory/             # Long-term vault (ChromaDB or JSON)
    └── api/                # FastAPI backend
        └── Dockerfile
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your keys. **Never commit `.env`.**

```
CANVASCLOUD_API_KEY=
TAVILY_API_KEY=
```

---

## Build Order

1. UI mockups — screens approved before coding starts
2. Backend stubs — mock endpoints so frontend can integrate early
3. AI pipeline — build and test agent flow in isolation
4. Integration — wire everything together; rely on logs to debug

---

## Team Roles

| Role | Responsibility |
|---|---|
| Backend Engineer | APIs, data processing, AI endpoint integration |
| AI/ML Engineer | Agent pipeline, prompts, embeddings, retrieval logic |
| DevOps | Deployment, CI/CD, infrastructure |
| Frontend Engineer | UI implementation, API wiring, UX |

---

## Week-by-Week Plan

| Week | Focus |
|---|---|
| 1 | Define & Plan — PRD, roles, stack decisions, GitHub Projects |
| 2 | Foundations — backend scaffolding, agent prototype, "hello world" deploy |
| 3 | Integration Sprint — frontend + backend + AI connected, end-to-end tests |
| 4 | Polish & Test — bug fixes, AI tuning, UX, user testing |
| 5 | Demo Ready — rehearse 3x, judge prep, final build ship |

---

## Key Rules

- API keys live in `.env` only — never in code or commits
- Cache LLM responses during dev to control cost
- Log every AI request, response, latency, and error from day one
- The forecaster is a deterministic function — not LLM-generated code
- Masking is Phase 4 — validate flows on unmasked data first
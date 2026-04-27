# VaultAI — The Zero-Knowledge Wealth Copilot

> A local-first financial AI agent that proactively manages your taxes, budget, and investments — without ever letting your raw financial data touch the cloud.

---

## The Problem

| Pain Point | Description |
|---|---|
| **The Trust Gap** | People want AI to manage their money, but fear uploading raw bank statements to the cloud. |
| **Goldfish Memory** | Current AI bots forget who you are when you close the tab. Real financial planning requires 365 days of context — remembering you had a baby in February to claim a tax credit in April. |

---

## The Solution

VaultAI acts like a **Family Office in your pocket**. It runs entirely on your local machine — using a cloud LLM only for reasoning, never for storing raw data.

**The agent does three things autonomously:**

1. **Sanitizes Data** — strips PII from statements before the AI ever sees them
2. **Builds a 365-Day Profile** — extracts life events and financial goals from casual chat, persists them to a local memory vault
3. **Executes Wealth Strategies** — runs deterministic forecasting, searches the web for live tax-code updates, and recommends exact financial actions

---

## System Architecture

```
User Input (raw text / CSV)
         │
         ▼
┌─────────────────────────────┐
│  Layer 1: PII Masker        │  LOCAL — no network
│  "John Smith" → PERSON_001  │
│  "****1234"  → ACCT_001     │
└────────────┬────────────────┘
             │ masked data only
             ▼
┌─────────────────────────────┐
│  Layer 2: Memory Retrieval  │  LOCAL — no network
│  SQLite  → user profile,    │
│            life events,     │
│            financial history│
│  ChromaDB → relevant past   │
│             conversations   │
└────────────┬────────────────┘
             │ context package (masked)
             ▼
┌─────────────────────────────┐
│  Layer 3: LLM Agent         │  CLOUD — only outbound call
│  Sees: masked data + context│
│  Decides: which tool to run │
└────────────┬────────────────┘
             │ tool call
             ▼
┌─────────────────────────────┐
│  Layer 4: Tool Execution    │  LOCAL (Tavily = only exception)
│  - Cash flow forecaster     │
│  - Spending analyzer        │
│  - Tax summarizer           │
│  - Stock/rate search        │
│  - Memory writer            │
└────────────┬────────────────┘
             │ result
             ▼
┌─────────────────────────────┐
│  Layer 5: Memory Update     │  LOCAL — no network
│  - Save to ChromaDB         │
│  - Update SQLite            │
│  - De-mask response         │
└────────────┬────────────────┘
             │
             ▼
        User sees response
```

**Privacy guarantee:** The PII masker has no network access. Raw financial data is physically incapable of leaving the machine — Docker enforces this at the network layer, not just by policy.

---

## Memory Architecture

| Store | What it holds | Why |
|---|---|---|
| **SQLite** (`memory/vault.db`) | User profile, life events (with exact dates), monthly financial summaries, short-term conversation history | Precise queries — exact income figures, date-filtered life events |
| **ChromaDB** (`memory/chroma_db/`) | Embedded long-term conversation history | Semantic recall — "baby" memory surfaces when user asks about "child tax credit" |

Built with **SQLAlchemy** so swapping SQLite → PostgreSQL for multi-user is a one-line config change.

---

## Agent Tools

| Tool | What it does | Triggered when |
|---|---|---|
| `search_web` | Live stocks, tax codes, interest rates (Tavily) | User asks about live market data |
| `forecast_cashflow` | Next month prediction from CSV | User asks about future cash flow |
| `analyze_spending` | Category breakdown from CSV | User asks where money went |
| `prepare_tax_summary` | Pulls life events + income, compiles tax picture | User asks to prepare taxes |
| `save_life_event` | Writes event to SQLite + ChromaDB | User mentions a life change |
| `update_user_profile` | Updates income, job, goals in SQLite | User shares personal financial info |

---

## Demo Script: "The Time-Travel Demo"

**January** — Upload a CSV. VaultAI masks it locally (no PII leaves the machine). Agent notices heavy tech-gear spending and asks: *"Are you a freelancer? We can write this off."*

### Phase 1 — Frontend & Integration (Phase-1)
Wire a UI to the backend so the demo is showable to judges.

**Next Tax Season** — User says: *"Prepare my taxes."* VaultAI:
- Retrieves the July memory → surfaces the **$2,000 Child Tax Credit** automatically
- Runs the forecaster → finds **$5,000 in surplus**
- Calls Tavily → confirms **T-Bills at 5% yield**
- Delivers a complete, sourced tax + investment plan

---

## Tech Stack

### Phase 1 — Core Agent Loop ✅
| Layer | Choice | Reason |
|---|---|---|
| Backend API | FastAPI | Lightweight, async, easy to document |
| Frontend | TBD | To be decided by frontend lead |
| Containerization | Docker + Docker Compose | All services (agent, memory, API) run in isolated containers on the user's machine—raw financial data never leaves the local environment |
| Deployment | Local Docker (no cloud) | Privacy constraint; only outbound traffic is LLM API calls and Tavily search |

### Phase 2 — Persistent Memory (Phase 2)
Swap temp JSON for a real local vector store once the agent flow is proven.

### Phase 2 — Persistent Memory (Day 3)
| Layer | Choice | Reason |
|---|---|---|
| Long-Term Memory | ChromaDB (local) | Runs fully on-device; no cloud dependency |
| Embeddings | sentence-transformers | Local model, no API call needed |


### Phase 3 — Core Agent Loop (Phase 3)
Get the basic agent talking to the LLM and calling tools. No masking yet.

### Phase 3 — Frontend (Day 4) ✅
| Layer | Choice | Reason |
|---|---|---|
| Framework | React 19 + Vite | Component-based, fast HMR |
| Styling | Tailwind CSS v4 | Fast to build, no custom CSS needed |
| Routing | React Router v7 | 3-screen SPA: Chat, Upload CSV, Dashboard |

### Phase 4 — Privacy Shield ✅
| Layer | Choice | Reason |
|---|---|---|
| PII Masking | Python regex + UID mapping | Strips account numbers, emails, phones, SSNs before any LLM call |
| De-masking | Reverse lookup on response | UIDs swapped back before user sees the reply |

---

## Frontend Screens

**Chat (main screen)** — conversation interface with file upload
**Dashboard** — income, expenses, net cash flow, spending breakdown, life events
**CSV Upload** — drag-and-drop with local masking indicator

---

## Repository Structure

```
/
├── README.md
├── CLAUDE.md                   # Claude Code project instructions
├── Notes.md                    # Team workflow notes
├── .env.example                # Required environment variables
├── docker-compose.yml          # api (8000) + frontend (3000)
├── requirements.txt
├── frontend/                   # React 19 + Vite + Tailwind v4
│   ├── Dockerfile              # Multi-stage Node build → nginx
│   ├── nginx.conf              # SPA fallback + /api proxy
│   ├── vite.config.ts          # Tailwind plugin, @ alias, /api proxy
│   └── src/
│       ├── App.tsx             # BrowserRouter + 3 routes
│       ├── components/
│       │   └── Nav.tsx         # Top nav with active-link highlighting
│       └── pages/
│           ├── Chat.tsx        # Message bubbles, POST /api/chat
│           ├── Upload.tsx      # Drag-and-drop CSV, POST /api/upload-csv
│           └── Dashboard.tsx   # Life events card, GET /api/life-events
└── src/
    ├── agents/
    │   └── agent.py            # Tool-use loop, memory wiring, CSV session
    ├── api/
    │   ├── Dockerfile
    │   ├── main.py             # CORS, all routers, /health, /life-events
    │   ├── session.py          # Module-level CSV session state + lookup table
    │   └── routes/
    │       ├── chat.py         # POST /chat — runs agent, de-masks response
    │       └── upload.py       # POST /upload-csv — masks CSV, stores in session
    ├── tools/
    │   ├── search.py           # Tavily web search
    │   ├── forecaster.py       # Cash flow forecaster (deterministic)
    │   └── pii_masker.py       # Regex PII masking + de-masking
    └── memory/
        ├── store.py            # SQLite + ChromaDB wrapper
        └── chroma_db/          # Local vector store (auto-created)
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your keys. **Never commit `.env`.**

```
ANTHROPIC_API_KEY=
TAVILY_API_KEY=
```

---

## Running Locally

```bash
# 1. Copy environment variables
cp .env.example .env
# Fill in ANTHROPIC_API_KEY and TAVILY_API_KEY, then:

# 2. Run everything via Docker (API on :8000, frontend on :3000)
docker compose up --build -d

# 3. Open the app
open http://localhost:3000
```

### Dev mode (without Docker)

```bash
# Backend
pip install -r requirements.txt
uvicorn src.api.main:app --port 8000

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
# → http://localhost:5173 (proxies /api/* to :8000)
```

### Quick API smoke test

```bash
# Health
curl http://localhost:8000/health

# Upload a CSV (PII gets masked before storage)
curl -s -F "file=@test_data/amex_test.csv" http://localhost:8000/upload-csv

# Chat (de-masked response returned to user)
curl -s -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are my top expenses?"}' | python3 -m json.tool

# Life events saved from chat
curl http://localhost:8000/life-events
```

---

## Build Order

| Day | Focus | Status |
|---|---|---|
| Day 1 | FastAPI backend, Docker, `/chat` endpoint | ✅ Done |
| Day 2 | Agent tools: Tavily search + cash flow forecaster + tool-use loop | ✅ Done |
| Day 3 | Persistent memory: SQLite + ChromaDB, goldfish memory solved | ✅ Done |
| Day 4 | Frontend: React + Tailwind, CSV upload, PII masker end-to-end | ✅ Done |

---

## Future Scaling Roadmap

This MVP runs locally for a single user. The architecture is designed so each phase is a contained upgrade:

| Phase | What changes | When |
|---|---|---|
| **Multi-device sync** | Optional encrypted cloud backup (client-side encryption — server holds blobs it cannot read) | After MVP validated |
| **Multi-user** | Swap SQLite → PostgreSQL (one-line SQLAlchemy config change), add auth | After product-market fit |
| **Better PII masking** | Swap regex → spaCy NLP model for higher accuracy | Phase 4+ |
| **Zero-knowledge cloud** | PII masker runs in sandboxed container, only masked context reaches servers | Enterprise tier |
| **Task execution** | Agent moves from giving advice to executing tasks (tax filing, investment allocation) | Requires regulatory review |

**Privacy guarantee at scale:** The local-first architecture is the regulatory moat. We cannot comply with a data request for data we do not hold.

---

## Key Rules

- API keys live in `.env` only — never in code or commits
- The forecaster is a deterministic function — not LLM-generated code
- PII masker runs on every CSV upload before any data reaches the agent — Claude never sees raw account numbers, emails, or phone numbers
- Masked UIDs (e.g. `ACCT_001`) are swapped back to originals in the response before the user sees them
- camelCase for all Python function names (project convention)

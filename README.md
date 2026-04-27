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

**July** — User chats: *"I just had a baby girl!"* Agent silently writes `{"life_event": "new_child", "date": "2026-07"}` to the local memory vault.

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
| Language | Python 3.11+ | Pandas, scripting, AI ecosystem |
| LLM | Claude Haiku (Anthropic API) | Fast, cost-efficient reasoning |
| Web Search | Tavily API | Purpose-built for AI agents |
| Forecaster | Python + Pandas | Deterministic function, not LLM-generated code |
| API | FastAPI | Lightweight, async |
| Containerization | Docker + Docker Compose | All services run locally |

### Phase 2 — Persistent Memory (Day 3)
| Layer | Choice | Reason |
|---|---|---|
| Short-term memory | SQLite + SQLAlchemy | Precise queries, built into Python, upgradable to PostgreSQL |
| Long-term memory | ChromaDB (local) | Semantic search, runs fully on-device |
| Embeddings | sentence-transformers (`all-MiniLM-L6-v2`) | Local model, no API call needed |

### Phase 3 — Frontend (Day 4)
| Layer | Choice | Reason |
|---|---|---|
| Framework | React | Component-based, intermediate-friendly |
| Styling | Tailwind CSS | Fast to build, no custom CSS needed |
| Components | shadcn/ui | Pre-built chat, card, file-upload components |

### Phase 4 — Privacy Shield (last)
| Layer | Choice | Reason |
|---|---|---|
| PII Masking | Python regex + UID mapping | Replace names/account numbers with stable UIDs before any LLM call |

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
├── docker-compose.yml
├── requirements.txt
└── src/
    ├── agents/
    │   └── agent.py            # Tool-use loop, memory wiring
    ├── api/
    │   ├── Dockerfile
    │   ├── main.py
    │   └── routes/
    │       └── chat.py         # POST /chat endpoint
    ├── tools/
    │   ├── search.py           # Tavily web search
    │   ├── forecaster.py       # Cash flow forecaster (deterministic)
    │   └── pii_masker.py       # PII masking (Phase 4)
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
# Copy environment variables
cp .env.example .env
# Fill in your keys, then:

docker compose up --build -d

# Test the chat endpoint
curl -s -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are current T-Bill interest rates?"}' | python3 -m json.tool
```

---

## Build Order

| Day | Focus | Status |
|---|---|---|
| Day 1 | FastAPI backend, Docker, `/chat` endpoint | ✅ Done |
| Day 2 | Agent tools: Tavily search + cash flow forecaster + tool-use loop | ✅ Done |
| Day 3 | Persistent memory: SQLite + ChromaDB, solve goldfish memory | 🔄 In Progress |
| Day 4 | Frontend: React + Tailwind + shadcn/ui, CSV upload endpoint | ⬜ Pending |

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
- PII masker runs before any LLM call — Claude never sees raw financial data
- Cache LLM responses during dev to control cost
- Log every AI request, response, latency, and error from day one
- Masking is Phase 4 — validate all flows on clean data first

# VaultAI

VaultAI is a local-first financial AI agent. Upload your bank statements, ask questions about your finances, and get AI-powered insights — without your raw financial data ever leaving your machine.

---

## Architecture

```
User Input (CSV / Chat)
      ↓
[1] PII Masker       — strips SSN, email, phone, account numbers locally
      ↓
[2] Memory Retrieval — SQLite (recent history) + ChromaDB (semantic recall)
      ↓
[3] LLM Agent        — Claude Haiku reasons on sanitized data only
      ↓
[4] Tool Execution   — forecast_cashflow | search_web | save_life_event
      ↓
[5] De-masking       — original values restored before user sees response
```

The LLM never sees raw financial data. PII is masked locally before any cloud call is made, and restored from a local lookup table before the response reaches the user.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | FastAPI + Python 3.11 |
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Agent | Claude Haiku via Anthropic SDK |
| Memory | SQLite (structured) + ChromaDB (semantic) |
| Embeddings | sentence-transformers `all-MiniLM-L6-v2` (local, no API) |
| Web Search | Tavily |
| Containers | Docker + Docker Compose |

---

## Repository Structure

```
├── src/
│   ├── agents/agent.py          — tool-use agent loop (Claude Haiku)
│   ├── api/
│   │   ├── Dockerfile
│   │   ├── main.py              — FastAPI app, CORS, routes
│   │   ├── session.py           — in-memory CSV session store
│   │   └── routes/
│   │       ├── chat.py          — POST /chat
│   │       └── upload.py        — POST /upload-csv
│   ├── tools/
│   │   ├── pii_masker.py        — regex PII masking + de-masking
│   │   ├── forecaster.py        — deterministic cash flow forecast
│   │   └── search.py            — Tavily web search wrapper
│   └── memory/
│       └── store.py             — SQLite + ChromaDB read/write
├── frontend/
│   ├── Dockerfile               — Node build → nginx serve
│   ├── nginx.conf               — React Router fallback + /api proxy
│   └── src/
│       ├── pages/
│       │   ├── Landing.tsx
│       │   ├── Chat.tsx
│       │   └── Upload.tsx
│       └── components/
│           └── Nav.tsx
├── docker-compose.yml
└── requirements.txt
```

---

## How to Run

**Requirements:** Docker Desktop, Anthropic API key, Tavily API key.

```bash
cp .env.example .env
# Add ANTHROPIC_API_KEY and TAVILY_API_KEY

docker compose up --build
open http://localhost:3000
```

**Dev mode (no Docker):**
```bash
# Backend
pip install -r requirements.txt
uvicorn src.api.main:app --host 0.0.0.0 --port 8000

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
# → http://localhost:5173
```

**Quick API smoke test:**
```bash
curl http://localhost:8000/health

curl -F "file=@test_data/amex_test.csv" http://localhost:8000/upload-csv

curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are my top expenses?"}'
```

---

## Problems Faced & Solutions

**Docker build taking 30+ minutes**

`sentence-transformers` depends on PyTorch. When pip resolves it as a transitive dependency, it pulls the full CUDA build (~2GB) by default. The fix was to pre-install the CPU-only torch wheel before `pip install -r requirements.txt`:

```dockerfile
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir -r requirements.txt
```

Build time: ~30 min → ~5 min.

---

**Build context was 670MB**

Without a `.dockerignore`, Docker copied the entire `venv/` directory (~600MB) into the build context on every build — before a single build step ran. Adding `.dockerignore` to exclude `venv/`, `memory/chromadb/`, and `frontend/node_modules/` dropped the context from 670MB to ~78KB.

---

**Inconsistent date formats breaking SQLite sort order**

Life events were saved in whatever format the LLM returned — `"04/24/2026"`, `"April 2026"`, `"2026-04-27"`. SQLite stores dates as text, so string sort gave wrong chronological order. Fixed by adding `normalizeDate()` in `src/memory/store.py` using `dateutil.parser`, which normalizes all inputs to `YYYY-MM-DD` before saving.

---

**PII reaching the LLM**

The first version passed raw CSV text directly into the agent prompt. Fixed by running `maskCsv()` on the upload route before anything is stored in session. The agent only ever sees masked data with UIDs like `ACCT_001`. The lookup table is stored locally in session and used to `demask()` the response before it reaches the user.

---

## Tradeoffs

**SQLite over PostgreSQL**
SQLite is embedded — zero setup, no separate container. The tradeoff is no concurrent writes. For a single-user local app this is acceptable.

**Session-based CSV storage**
The uploaded CSV lives in a Python dict for the server session lifetime. Lost on restart. The upside is simplicity with no database schema needed for temporary data.

**CPU-only PyTorch**
Slower than GPU for embedding generation, but the Docker image is significantly lighter and builds ~6x faster. For short text embeddings on a local dev machine, CPU throughput is adequate.

**Naive cash flow projection**
The forecaster projects next month = this month's net. Simple and fully deterministic — no LLM involved in the number, eliminating hallucination risk on financial figures.

**Local embeddings over a hosted API**
`all-MiniLM-L6-v2` runs on the host machine — no embedding API calls, no data sent out for vectorization. Slightly lower embedding quality than hosted models, but consistent with the privacy-first design.

---

## Environment Variables

```
ANTHROPIC_API_KEY=
TAVILY_API_KEY=
```

Copy `.env.example` to `.env`. Never commit `.env`.

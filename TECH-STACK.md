# Contraty — Tech Stack & Architecture

## Backend (Python)

| Component | Choice | Rationale |
|---|---|---|
| Framework | **FastAPI** | Async-first, Pydantic validation, auto OpenAPI docs. Best Python web framework for API-driven apps. |
| ORM | **SQLAlchemy 2.0 + Alembic** | Mature, async support via asyncpg, migrations built-in. |
| Task queue | **Celery + Redis** | For async PDF generation, email sending, AI retries. Lightweight alternative: ARQ. |
| PDF generation | **WeasyPrint** | Pure Python, CSS-based templating. Generates Unicode Arabic text correctly. |
| AI integration | **Mistral SDK + google-genai + OpenAI SDK** | Multi-model routing for contract generation (see AI Architecture). |
| Validation | **Pydantic v2** | Built into FastAPI, handles all request/response schemas and AI output validation. |
| Auth | **Supabase Auth** | Free tier (50k MAU), handles email/password + OAuth. JWT validation in FastAPI via middleware. |
| API docs | **OpenAPI (auto-generated)** | FastAPI auto-generates Swagger + ReDoc. |

## Frontend

| Component | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | SEO-friendly (SSR for landing pages), React ecosystem, Vercel free hosting. |
| Styling | **Tailwind CSS + shadcn/ui** | Utility-first, beautiful pre-built components, RTL support for Arabic. |
| Language | **TypeScript** | Non-negotiable for frontend maintainability. |
| Forms | **React Hook Form + Zod** | Lightweight form handling with schema validation matching backend Pydantic models. |
| PDF viewer | **react-pdf** | In-browser PDF preview before download. |
| i18n | **next-intl** | Arabic + French routing (`/ar/*`, `/fr/*`). |

## Database

| Component | Choice | Rationale |
|---|---|---|
| Primary DB | **PostgreSQL 15** | Free on Supabase (500MB), excellent JSONB for contract metadata, full-text search for template search. |
| Vector store | **pgvector (PostgreSQL extension)** | Embeddings stored alongside contract templates. No separate vector DB needed. Avoids infrastructure sprawl. |
| Cache | **Redis** | Rate limiting (AI calls), session caching. Free tier on Upstash (10k commands/day). |

## Infrastructure

| Component | Choice | Rationale |
|---|---|---|
| Backend hosting | **Railway.app** | ~$5/mo starter, auto-deploy from GitHub, managed PostgreSQL option if needed. |
| Frontend hosting | **Vercel** | Free tier, optimal for Next.js, auto-deploy, analytics included. |
| Domain | **Namecheap or Porkbun** | `contraty.com`, `contraty.co`, or `contraty.app`. ~$10/year. |
| CDN / static assets | **Vercel Edge** | Handled automatically for frontend. Contract PDFs stored on Supabase Storage. |
| Monitoring | **Sentry** | Free tier, catches both Python and JS errors. |
| Email | **Resend** | Free tier (100 emails/day), transactional emails for downloads + auth. |
| Analytics | **Plausible** | Privacy-first, simple. Free self-host or $9/mo cloud. Alternative: PostHog (free tier generous). |

## Payments & Monetization

| Component | Choice | Rationale |
|---|---|---|
| Merchant of Record | **Paddle** | Handles VAT/GST globally, no Tunisian entity needed. Pays out as contractor revenue. |
| Alternative | **Lemon Squeezy** | Simpler than Paddle, slightly higher fees (5% + $0.50 vs Paddle's 5% + $0.50). Either works. |
| Ad network | **Google AdSense** | Highest fill rate for Tunisia region, pays to international bank account. |

---

## API Keys — Runtime (3 keys only)

The backend ships with exactly 3 API keys. No key sprawl.

| Key | Used for |
|---|---|
| **OpenAI** | Embeddings (`text-embedding-3-small`) + GPT-4o-mini as shared fallback for both languages |
| **Mistral** | Primary model for French contract generation (Mistral Small 4) |
| **Gemini** | Primary model for Arabic contract generation (Gemini 2.0 Flash) |

**Offline/manual-only models (no key in the app):**
- **Claude Opus/Sonnet** — Used interactively during Phase 0 for prompt engineering, template pattern analysis, validation spot-checks. Not programmatic.
- **GPT-4o** — Same purpose: quality cross-check of generated prompts and outputs.

## AI Architecture — Multi-Model Routing

### Embedding Layer (always OpenAI)

```
text-embedding-3-small
  ├── 1536 dimensions
  ├── Multilingual (Arabic + French in one index)
  ├── $0.02 / 1M tokens
  └── Chunks embedded once, stored in pgvector
```

### Runtime Model Routing

```
Contract generation request
  │
  ├── Language = FR
  │     ├── 1st: Mistral Small 4    ← native French legal, cheapest good French
  │     ├── 2nd: GPT-4o-mini        ← reliable fallback
  │     └── 3rd: GPT-4o-mini        ← retry with stricter prompt
  │
  ├── Language = AR
  │     ├── 1st: Gemini 2.0 Flash   ← best Arabic (Google's multilingual edge)
  │     ├── 2nd: GPT-4o-mini        ← best Arabic among non-Google models
  │     └── 3rd: GPT-4o-mini        ← retry with stricter prompt
  │
  └── Language = BOTH
        ├── FR pass: Mistral Small 4 → Pydantic validation
        ├── AR pass: Gemini 2.0 Flash → Pydantic validation
        └── Merge → single bilingual contract (two-column PDF)
```

### Cost per attempt (~2K tokens/contract)

| Model | Input (cached) | Output | Per attempt |
|---|---|---|---|
| Gemini 2.0 Flash | $0.075/1M | $0.30/1M | ~$0.0006 |
| Mistral Small 4 | ~$0.20/1M | ~$0.60/1M | ~$0.0012 |
| GPT-4o-mini | $0.075/1M | $0.60/1M | ~$0.0011 |

**Worst case** (3 attempts all fail, needed all retries): ~$0.003/contract. At 10,000 contracts/month: **$30.** Margin on a 10 TND single-purchase contract: still enormous.

### Validation Gate (Pydantic)

Every model output passes the same validator. If it fails:
- Missing required section → retry with more explicit prompt
- Malformed JSON → retry with stricter JSON mode
- Placeholder tokens remaining → retry with explicit fill instruction
- Max 3 retries → 502 with structured error message

---

## End-to-End Flow

```
User fills wizard (6-10 questions based on contract type)
        │
        ▼
FastAPI resolves contract type → loads template metadata
        │
        ▼
pgvector retrieves top-5 most relevant template clauses
(embedding similarity search on contract type + language)
        │
        ▼
Prompt assembled: system_prompt + retrieved_clauses + user_fields + output_schema
        │
        ▼
Model router: pick primary model by language → generate
        │
        ▼
Pydantic validates JSON structure (sections, articles, clauses, signatures)
        │
        ▼
  ┌─ Pass? → WeasyPrint renders PDF → download
  └─ Fail? → fallback model → retry (max 3 total attempts)
        │
        ▼
PDF stored on Supabase Storage → URL returned
```

## Development Setup

```bash
# Backend
cd backend
python -m venv .venv
pip install fastapi uvicorn sqlalchemy asyncpg alembic \
  celery redis weasyprint pydantic python-jose \
  mistralai google-genai openai supabase

# Frontend
cd frontend
npx create-next-app@latest . --typescript --tailwind --app
npx shadcn-ui@latest init
npm install next-intl react-pdf react-hook-form zod @supabase/supabase-js
```

## Environment Variables

```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=sb-xxxxx

# AI — runtime (3 keys)
OPENAI_API_KEY=sk-xxxxx          # embeddings + GPT-4o-mini fallback
MISTRAL_API_KEY=xxxxx            # French contracts
GEMINI_API_KEY=xxxxx             # Arabic contracts

# Payments
PADDLE_API_KEY=xxxxx
PADDLE_WEBHOOK_SECRET=xxxxx

# Email
RESEND_API_KEY=xxxxx

# Misc
REDIS_URL=redis://xxxxx
SENTRY_DSN=https://xxxxx
```

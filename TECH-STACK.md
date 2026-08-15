# Contraty — Tech Stack & Architecture

## Backend (Python)

| Component | Choice | Rationale |
|---|---|---|
| Framework | **FastAPI** | Async-first, Pydantic validation, auto OpenAPI docs. Best Python web framework for API-driven apps. |
| ORM | **SQLAlchemy 2.0 + Alembic** | Mature, async support via asyncpg, migrations built-in. |
| Task queue | **Celery + Redis** | For async PDF generation, email sending, AI retries. Lightweight alternative: ARQ. |
| PDF generation | **WeasyPrint** | Pure Python, CSS-based templating. Generates Unicode Arabic text correctly. |
| AI integration | **google-genai (Gemini)** | Gemini-only routing for contract generation, review, and embeddings (see AI Architecture). |
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

## API Keys — Runtime (1 key only)

The backend ships with exactly 1 API key. No key sprawl.

| Key | Used for |
|---|---|
| **Gemini** | Contract generation (FR + AR), review, customization, and embeddings |

## AI Architecture — Gemini-only

### Embedding Layer (Gemini)

```
text-embedding-004
  ├── 768 dimensions
  ├── Multilingual (Arabic + French in one index)
  └── Chunks embedded once, stored in pgvector
```

### Runtime Model Routing

```
Contract generation request
  │
  └── Any language (FR or AR)
        ├── 1st: Gemini 2.0 Flash   ← strong French + Arabic
        ├── 2nd: Gemini 2.0 Flash   ← retry
        └── 3rd: Gemini 2.0 Flash   ← retry with stricter prompt
```

### Cost per attempt (~2K tokens/contract)

| Model | Input (cached) | Output | Per attempt |
|---|---|---|---|
| Gemini 2.0 Flash | $0.075/1M | $0.30/1M | ~$0.0006 |

**Worst case** (3 attempts all fail): ~$0.002/contract. At 10,000 contracts/month: **$20.** Margin on a 10 TND single-purchase contract: still enormous.

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
Gemini generates the contract JSON
        │
        ▼
Pydantic validates JSON structure (sections, articles, clauses, signatures)
        │
        ▼
  ┌─ Pass? → WeasyPrint renders PDF → download
  └─ Fail? → retry Gemini (max 3 total attempts)
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
  google-genai supabase

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

# AI — runtime (1 key)
GEMINI_API_KEY=xxxxx             # generation, review, customization, embeddings

# Payments
PADDLE_API_KEY=xxxxx
PADDLE_WEBHOOK_SECRET=xxxxx

# Email
RESEND_API_KEY=xxxxx

# Misc
REDIS_URL=redis://xxxxx
SENTRY_DSN=https://xxxxx
```

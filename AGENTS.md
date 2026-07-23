# Contraty — Agent Instructions

## Project
Générateur de contrats juridiques tunisiens — bilingue arabe/français.
22 templates covering 6 domains of Tunisian law.

## Commands

```bash
# Backend
cd backend && source .venv/bin/activate
pytest -q                                    # run tests (76 tests)
ruff check app/                              # lint Python

# Frontend
cd frontend
npm run lint                                 # ESLint
npm run build                                # Next.js production build
npm run dev                                  # dev server (port 3000)
```

## Architecture
| Layer | Tech |
|---|---|
| Backend | FastAPI (Python 3.12), Supabase REST, WeasyPrint PDF |
| Frontend | Next.js 14 App Router, Tailwind CSS, shadcn/ui (RTL) |
| LLM | Mistral Large (FR), Gemini 2.0 Flash (AR), GPT-4o-mini (fallback) |

## Key files
- `backend/app/main.py` — FastAPI app, lifespan, middleware
- `backend/app/api/contracts.py` — API endpoints (templates, generate, PDF, docx, customize)
- `backend/app/services/llm.py` — multi-model LLM router
- `backend/app/services/template_service.py` — business logic (fill templates, review, customize)
- `backend/app/db/memory.py` — in-memory repository (dev/testing fallback)
- `backend/app/db/supabase_repo.py` — Supabase-backed repository (prod)
- `frontend/src/app/[lang]/generate/[type]/page.tsx` — contract generation wizard
- `frontend/src/lib/useWizard.ts` — wizard state hooks
- `frontend/src/lib/useGeneration.ts` — generation/download API calls

## Conventions
- Backend: Pydantic models in `app/models/`, services layer handles business logic, db layer abstracts storage
- Frontend: RTL-aware with `lang` param (`/fr/*`, `/ar/*`), components in `components/generate/`
- Tests: pytest with `asyncio_mode=auto`, fixtures in `tests/conftest.py`
- Template placeholders: `[FIELD_NAME]` in article text, matched to `field_metadata`

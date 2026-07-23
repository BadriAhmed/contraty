# Contraty — Improvement Backlog

Findings from a full repo audit (backend tests: 76 passing, frontend lint: clean).
Ordered by impact. Each item has a severity tag and a concrete fix.

---

## P0 — Critical

### 1. The headline AI feature is not wired into generation
The docs (`TECH-STACK.md`, `README.md`, `API.md`) describe a multi-model LLM router
with pgvector retrieval and Pydantic validation gates. The actual
`/contracts/generate` path does **zero** LLM work:

- `generate_contract()` (`backend/app/services/template_service.py:83`) is pure
  `[PLACEHOLDER]` string substitution and returns `model_used="template-engine"`,
  `tokens_used: 0`.
- `app/services/llm.py` (`LLMRouter`) is imported (`template_service.py:21`) but
  **never called** in production — only tests exercise it.
- `_build_prompt` (`template_service.py:338`) is dead code.
- `app/db/vector.py`, `embed_texts()`, `search_by_embedding()` are dead — the
  pgvector retrieval described as core never runs.
- Only `review_contract` and `customize_blank_template` actually call Gemini.

**Decision needed:** wire the router into generation, OR delete the dead code and
rewrite the docs to match reality. Right now the codebase misrepresents what it does.

### 2. HTML injection in PDF rendering
`backend/app/services/pdf.py:51` and `:58` interpolate `article.text` and titles
directly into the HTML string passed to WeasyPrint. After `_fill_template`, that
text contains raw user field values — `</div>` or `<img>` in an input breaks the
PDF layout/structure.

**Fix:** `html.escape()` on every interpolated value. (`docx.py` is safe —
python-docx escapes XML.)

### 3. No authentication anywhere
Every generate / PDF / download / customize endpoint is anonymous. The Supabase-Auth
story described in `TECH-STACK.md` does not exist in code.

**Fix:** add JWT validation middleware and protect mutating endpoints.

### 4. Rate limiting configured but never attached
`slowapi` is in `requirements.txt` and `rate_limit_requests` / `rate_limit_minutes`
exist in `app/core/config.py`, but there is no `Limiter` instance and no
`@limiter.limit` decorator anywhere. The two endpoints that hit Gemini
(`/review` via generate, `/customize`) are unbounded cost vectors.

**Fix:** instantiate `slowapi.Limiter`, attach `SlowAPIMiddleware`, and decorate
the Gemini-calling endpoints.

### 5. "One-time use only" `/templates/{slug}/customize` is not enforced
`backend/app/api/contracts.py:170` claims one-time use in the docstring but nothing
tracks usage (no counter / session flag / DB column).

**Fix:** record customization usage per template/session and reject repeats.

---

## P1 — Security & Correctness

### 6. CORS too permissive
`backend/app/main.py:44` — `allow_credentials=True` with `allow_methods=["*"]`,
`allow_headers=["*"]`, and origins split by comma with no trimming/validation.

**Fix:** explicit allowlist; trim whitespace; scope methods/headers.

### 7. Generate retry math is off-by-one vs docs
`backend/app/services/llm.py:62` tries the primary once, then loops `max_attempts`
(3) fallbacks = up to 4 total calls. Docs say "max 3 total attempts".

**Fix:** count primary as attempt 1 and cap the loop at `max_attempts - 1`, or
update the docs to match.

### 8. Fragile JSON extraction in `review_contract`
`backend/app/services/template_service.py:232-235` uses `text.find("[")` /
`text.rfind("]")`. `_extract_json` already exists in `llm.py:15` and handles fenced
code blocks.

**Fix:** reuse `_extract_json` instead of the ad-hoc slice.

### 9. Bad input returns 500 instead of 422
`backend/app/api/contracts.py:127` (`download_blank_template_endpoint`) takes
`language: str` then calls `Language(language)` inside the handler — an invalid
value raises a `ValueError` → 500.

**Fix:** type the param as `Language` so FastAPI returns 422 with a structured
error.

### 10. Silent Supabase degradation is invisible
`backend/app/main.py:25-30` falls back to in-memory on DB outage with only a
warning log. The `/health` endpoint reports `templates_loaded` but not whether the
real DB or the fallback is active — a prod degradation could go unnoticed.

**Fix:** expose repo backend + health state in `/health` (or a `/health/details`).

### 11. localStorage cleared before success
`frontend/src/app/[lang]/generate/[type]/page.js:314` runs `removeItem` *before*
`await fetch`, so a failed generation wipes the user's in-progress form.

**Fix:** clear only on confirmed success (after `res.ok`).

### 12. Dual `review` / `skip_review` fields still sent together
`frontend/.../page.js:322-323` — legacy of the React-fiber-leak bug; brittle and
redundant.

**Fix:** collapse to a single boolean.

---

## P2 — Backend Code Quality

### 13. Module-level singletons freeze config at import
`settings = get_settings()` at `llm.py:12`, `vector.py:7`, `template_service.py:26`,
`client.py:6`, combined with `@lru_cache` on settings, freezes config at import and
makes testing/reconfiguration harder.

**Fix:** access settings via a dependency (`Depends(get_settings)`) or read lazily.

### 14. Duplicated Gemini clients
`review_contract` and `customize_blank_template` each construct a fresh
`google.genai.Client` per call (`template_service.py:222`, `:299`); the lazy client
in `LLMRouter` is also unused.

**Fix:** consolidate into a single shared client.

### 15. Inline imports
`import re` inside functions (`template_service.py:142`, `:307`); `from
fastapi.responses import Response` and `from app.services... import` inside handlers
(`contracts.py`).

**Fix:** hoist to module top.

### 16. No type checking / linting on Python
No `pyproject.toml`; config scattered across `requirements.txt` + `pytest.ini`.
No `ruff` / `mypy`.

**Fix:** add `pyproject.toml` with ruff + mypy config.

---

## P3 — Frontend

### 17. JavaScript instead of TypeScript
Contradicts `TECH-STACK.md` ("Non-negotiable"). `jsconfig.json`, all `.js`/`.jsx`,
no TS deps. Biggest gap vs stated intent.

**Fix:** migrate to TypeScript.

### 18. 757-line god component
`frontend/src/app/[lang]/generate/[type]/page.js` holds state, validation, fetch,
persistence, wizard, preview, inline-edit, and suggestions.

**Fix:** decompose into hooks (`useWizard`, `useFieldValidation`,
`useContractGeneration`) and per-step components.

### 19. Dead dependencies
`zod`, `react-hook-form`, `@hookform/resolvers` — zero usage in `src/` (form is
hand-rolled `useState`).

**Fix:** either adopt them (shared schema with backend) or remove them.

### 20. Duplicated validation logic
Frontend `PATTERNS` / `validateField` (`page.js:13,56`) duplicate backend
`FieldMetadata` constraints — no single source of truth.

**Fix:** derive frontend validation from the template's `field_metadata`, or share
a Zod schema with the Pydantic models.

---

## P4 — DX / Tooling

### 21. No CI
No `.github/workflows`. Tests + lint pass locally but nothing guards PRs.

**Fix:** add a workflow running backend `pytest` + frontend `lint`/`build`.

### 22. Unpinned dependencies
`backend/requirements.txt` uses unpinned `>=`. `google-genai>=2.0` is especially
loose. Non-reproducible builds.

**Fix:** pin or use a lockfile (uv / pip-tools).

### 23. Three Dockerfiles, undocumented precedence
`/Dockerfile` (GCP Cloud Run, backend-only), `backend/Dockerfile`,
`frontend/Dockerfile`. The root one references `data/templates` while
`docker-compose.yml` uses the per-app ones.

**Fix:** document which is canonical; reconcile compose vs Cloud Run context.

### 24. No root `AGENTS.md`
Listed as project config in the environment but absent.

**Fix:** add an `AGENTS.md` capturing build/test/lint commands and conventions.

---

## What's already good (do not regress)

- Repository abstraction (`TemplateRepository` / `ContractRepository` with
  in-memory + Supabase implementations) is clean and well-tested.
- Migration SQL is version controlled (`backend/migrations/001_`, `002_`), even
  without Alembic wired up.
- `.env` / `.env.local` are correctly gitignored; none tracked.
- Test suite is substantive (76 tests covering fallback / repo / seed / pdf /
  templates), not smoke tests.

---

## Suggested execution order

1. **Decide P0 #1 direction** (wire-up vs delete dead code) — reshapes the cleanup.
2. P0 #2 (escape PDF HTML) — quick, removes an injection surface.
3. P0 #4 + #3 (slowapi on Gemini endpoints + auth) — caps cost exposure.
4. P1 batch (CORS, 422, retry math, localStorage) — correctness hardening.
5. P3 #17/#18 (TypeScript + decompose) — frontend maintainability.
6. P4 #21/#22 (CI + pinning) — protects everything above.

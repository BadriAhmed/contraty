# Progress

## Phase 0 — Data Collection & Template Building

- [x] Read all planning docs (8 files + TECH-STACK.md)
- [x] Discovered correct domain: `jurisitetunisie.com` (not `juristunisie.com`)
- [x] Mapped jurisitetunisie.com legal code structure (COC, CT, CS)
- [x] Wrote scraper (`data/scraper.py`) — recursive crawler with multi-format parser
- [x] Scraped COC: 1,034 unique articles (`data/raw/coc_clean.json`)
- [x] Scraped CT: 193 unique articles — partial, Livre I & II missing (`data/raw/ct_clean.json`)
- [x] Scraped CS: 250 unique articles (`data/raw/cs_clean.json`)
- [x] Built template builder (`data/build_templates.py`) — templates 1-8
- [x] Built template builder (`data/build_remaining.py`) — templates 9-22
- [x] 22 bilingual templates built (`data/templates/`) — 224 articles, 371 fields
- [x] Recategorized from 7 legacy categories to 6 UI domains
- [x] Updated planning docs (03-data-collection, 04-implementation-phases, 06-contract-catalog)

## Phase 0 — Prompt Engineering

- [ ] Draft 3 per-model system prompts (Mistral FR, Gemini AR, GPT-4o-mini fallback)
- [ ] GPT-4o cross-validate prompt quality
- [ ] 66-combo testing (22 contracts × 3 models)

## Phase 0 — Embeddings & Vector DB

- [ ] Generate embeddings for all 22 templates (text-embedding-3-small)
- [ ] Load embeddings into pgvector

## Phase 0 — Arabic Translation

- [ ] Gemini-assisted legal Arabic translation pass on all 22 templates

## Phase 0 — Tech Scaffold

- [x] Git repo initialized (local only — `gh` CLI not available)
- [x] FastAPI project scaffold — config, models, services (LLM router, RAG, PDF), API routes
- [x] Next.js 14 project scaffold — App Router, Tailwind, shadcn/ui, RTL support
- [x] Backend verified: 22 templates loaded, health + templates endpoints working
- [x] Frontend build passing: SSG for [lang]/ and [lang]/contracts, dynamic for generate/ wizard
- [x] Supabase DB schema (`app/db/schema.sql`) — templates, template_chunks (pgvector), contracts
- [x] Repository layer — ABC + InMemory (dev/test) + Supabase (prod) implementations
- [x] Template seed script (`app/db/seed.py`) — loads 22 JSON templates into repository
- [x] Template service layer (`app/services/template_service.py`) — business logic abstraction
- [x] API contract doc (`API.md`) — 5 endpoints with request/response JSON shapes
- [x] **75 tests passing** — health, templates CRUD, generation, PDF, LLM router, fallback, repository, seed, template service
- [ ] Supabase project (DB + Auth) — schema ready, need Supabase instance
- [ ] Railway project (backend deploy)
- [ ] Vercel project (frontend deploy)
- [ ] CI/CD (GitHub Actions)

## Phase 0 — Design

- [ ] Logo + brand colors
- [ ] Figma wireframes (landing, wizard, PDF preview, download)
- [ ] AR + FR UI mockups (RTL tested)

## Phase 0 — Admin

- [ ] Domain purchase
- [ ] Paddle account + product setup
- [ ] Google AdSense application

---

## Test Coverage Summary

```
75 passed, 0 failed, 1 warning

Test files (8):
  test_fallback.py     8 tests  — LLM fallback chain, JSON extraction, error handling
  test_generate.py     8 tests  — Contract generation endpoint (success, failure, edge cases)
  test_health.py       3 tests  — Health endpoint, startup lifecycle
  test_llm_router.py   8 tests  — Model selection, parsing, async calls
  test_pdf.py          5 tests  — PDF generation, binary output, validation
  test_repository.py   14 tests — CRUD operations, domain filtering, immutability
  test_seed.py         9 tests  — Complexity calc, field dedup, chunking, seed script
  test_template_service.py 14 tests — Business logic, LLM integration, PDF rendering
```

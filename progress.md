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
- [ ] Supabase project (DB + Auth)
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

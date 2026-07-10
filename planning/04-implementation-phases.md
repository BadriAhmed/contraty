# Implementation Phases

## Phase 0 — Pre-Launch Setup (Week 1-2)

**Goal:** Everything ready before writing a single feature.

### Data & Prompt Engineering (Offline — No Lawyer)

| Task | Status |
|---|---|
| Source contract templates from public resources (JORT, jurisitetunisie, legal guides) | ✅ **Done** — 1,477 legal articles scraped from `jurisitetunisie.com` (COC, CT, CS) |
| Strip identifying info, reformat into JSON schema | ✅ **Done** — 22 bilingual templates built with 224 articles, 371 fields |
| Template JSON structuring and chunking | ✅ **Done** — Templates in `data/templates/`, schema matches `03-data-collection-pre-work.md` |
| Embedding generation and pgvector loading | ⬜ Pending — needs OpenAI API key + pgvector setup |
| Claude drafts 3 per-model system prompts (Mistral FR, Gemini AR, GPT-4o-mini fallback) | ⬜ Pending |
| GPT-4o cross-validates prompt quality | ⬜ Pending |
| Test each prompt against each model — iterate until all 66 combos pass (22 contracts × 3 models) | ⬜ Pending |
| Commit final prompts to `backend/app/prompts/` | ⬜ Pending |
| Disclaimer text (AR + FR) finalized for PDF, footer, and pre-generation checkbox | ✅ **Done** — Included in every template's `disclaimer` field |
| Domain purchase (`contraty.com` or `.co`) | ⬜ Pending |

### Arabic Translation

| Task | Status |
|---|---|
| Gemini-assisted translation of Arabic template text | ⬜ Pending — Current Arabic is human-written stub, needs legal review by Gemini |

### Key adjustments from original plan

- **Template count:** 5 → **22** (scraper automated the bottleneck)
- **Data source:** `juristunisie.com` → **`jurisitetunisie.com`** (the correct domain)
- **Test combos:** 15 (5 × 3) → **66** (22 × 3)
- **Phase 0 duration estimate revised from 1 week → 2-3 weeks** (scraping + template building took 1 session; remaining prompt engineering + embedding is the bottleneck)
- **Arabic:** site is French-only, no AR version of legal codes exists online — Gemini translation is the only path

### Legal & Administrative

- [ ] Paddle account registration + product setup (monthly + annual SKUs)
- [ ] Google AdSense application (apply early — review takes time)
- [ ] No lawyer at this stage — all templates marked `reviewed_by: null`

### Tech Setup

- [ ] GitHub repo with `backend/` and `frontend/`
- [ ] FastAPI project scaffold + health endpoint
- [ ] Next.js project scaffold + Tailwind + shadcn/ui
- [ ] Supabase project (DB + Auth)
- [ ] Railway project (backend deploy)
- [ ] Vercel project (frontend deploy)
- [ ] CI/CD: GitHub Actions for lint + test on PR
- [ ] Environment variables set up across all platforms (3 LLM keys: OpenAI, Mistral, Gemini)

### Design

- [ ] Logo + brand colors (primary: deep blue (#1a365d) — professional, legal)
- [ ] Figma wireframes: landing page, contract wizard, PDF preview, download page
- [ ] Arabic and French UI mockups (RTL tested)

---

## Phase 1 — Basic Site + AI Generation (Week 2-4)

**Goal:** Contract wizard works end-to-end. User fills form → gets PDF with disclaimer. No users, no payments, no ads. **No lawyer yet — templates are curated public examples.**

### Backend Tasks
- [ ] Database schema: `templates`, `template_chunks`, `contracts` (anonymous generation)
- [ ] Model router module: language detection → picks primary model (see TECH-STACK.md routing table)
- [ ] Template search endpoint: `/api/templates/search` (by category + language)
- [ ] Contract generation endpoint: `POST /api/contracts/generate`
  - Accepts: contract_type, language, user_fields (JSON)
  - Runs: embedding search → prompt assembly → model routing → Pydantic validation
  - Returns: JSON contract structure
  - Fallback: if primary model fails validation, retries with next model (max 3 attempts)
- [ ] PDF generation endpoint: `POST /api/contracts/pdf`
  - Accepts: contract JSON
  - Returns: PDF binary (WeasyPrint) with disclaimer embedded on page 1
- [ ] Disclaimer injection: always prepends the legal disclaimer block to every generated contract
- [ ] Rate limiting middleware (5 requests/min for anonymous, IP-based)

### Frontend Tasks
- [ ] Landing page (`/`) — hero section, contract categories grid, permanent disclaimer in footer
- [ ] Contract wizard (`/generate/[contract_type]`)
  - Step 1: Choose contract type from category grid (6 UI domains)
  - Step 2: Disclaimer checkbox — user must tick before proceeding
  - Step 3: Fill wizard form (6-10 questions, varies by contract type) — React Hook Form + Zod
  - Step 4: Loading state with contract structure preview (streaming text)
  - Step 5: PDF preview with disclaimer visible (react-pdf)
  - Step 6: Download button
- [ ] Contract categories page (`/contracts`) — paginated grid, 6 domaines, demand badges
- [ ] i18n routing: `/ar/*` for Arabic, `/fr/*` for French
- [ ] Mobile-responsive (most Tunisian users are on mobile)

### Launch Criteria (updated)
- [ ] All **22** contract types generate coherent output in AR and FR
- [ ] Model router correctly picks primary model for each language
- [ ] Fallback chain works — if Mistral fails, GPT-4o-mini picks up
- [ ] PDF render includes bilingual text properly (Arabic RTL, French LTR)
- [ ] Disclaimer appears on: PDF page 1, website footer, pre-generation checkbox
- [ ] Site loads in <3s on 3G mobile (Lighthouse score >80)

---

## Phase 2 — Ads Integration (Week 6)

**Goal:** Free tier generates revenue from display ads.

### Tasks
- [ ] Google AdSense integration
  - Leaderboard ad (top of page, below nav)
  - In-content ad (between contract preview and download)
  - Bottom ad (footer area)
- [ ] Ad visibility logic: show ads for unauthenticated users + free-tier authenticated users
- [ ] Ad placement optimization (measure CTR by position, iterate)
- [ ] Cookie consent banner (GDPR/AdSense requirement)

### Metrics to Track
- Daily active anonymous users
- Contracts generated per day
- Ad impressions / CTR / CPM
- Bounce rate

---

## Phase 3 — User System (Week 7-8)

**Goal:** Users can sign up, log in, save contracts, track history.

### Backend Tasks
- [ ] User model + Supabase Auth integration (email/password + Google OAuth)
- [ ] User contracts: save/view/delete contract history
- [ ] User preferences: default language, notification settings
- [ ] API auth middleware: validate Supabase JWT on protected endpoints
- [ ] Free tier: enforce 2 contracts/month limit

### Frontend Tasks
- [ ] Sign up / Login pages
- [ ] User dashboard (`/dashboard`)
- [ ] Protected routes
- [ ] "Login to save" CTA on contract download page

---

## Phase 4 — Paid Membership (Week 9-10)

**Goal:** Monetize power users with subscription.

### Backend Tasks
- [ ] Paddle webhook integration (subscription.created, .cancelled, .updated)
- [ ] Premium feature gating (unlimited contracts, no ads, no watermark, contract history)
- [ ] Paddle checkout overlay
- [ ] Invoice generation and email delivery via Resend

### Frontend Tasks
- [ ] Pricing page (`/pricing`): Free vs Premium (30 TND/month) vs Annual (288 TND/year)
- [ ] Upgrade flow with Paddle checkout
- [ ] Premium badge in navbar
- [ ] Ad removal for premium users
- [ ] Watermark removal for premium PDFs

---

## Phase 5 — Optimization & Growth (Week 11+)

### SEO
- [ ] Dynamic contract template pages at `/contracts/[slug]`
- [ ] Meta descriptions, OG tags, FAQ structured data
- [ ] Blog content: Tunisian contract how-to guides

### Quality
- [ ] User feedback: thumbs up/down on generated contracts
- [ ] Flagged contracts → manual review queue
- [ ] A/B test wizard flow
- [ ] **Lawyer review milestone:** After 500+ contracts generated, invest in lawyer review — remove `reviewed_by: null`, add "Révisé par Maître X" badge

### Distribution
- [ ] Facebook/Instagram ads targeting Tunisian market
- [ ] Partner with Tunisian Facebook groups (freelance, immobilier, juridique)
- [ ] Referral program

### Monetization Expansion
- [ ] One-time purchase (5 TND/contract)
- [ ] Corporate plans (bulk contracts)
- [ ] Affiliate links to Tunisian lawyers

---

## Phase 6 — Beyond MVP (Long-Term)

- [ ] Full lawyer review of all 22+ templates
- [ ] Template marketplace: lawyers upload/sell templates (revenue share)
- [ ] E-signature integration
- [ ] Contract analysis: AI reviews existing contracts for risks
- [ ] Mobile app (React Native / Flutter)
- [ ] Expand to Algeria, Morocco (local legal review required)

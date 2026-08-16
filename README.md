# Contraty

Générateur de contrats juridiques tunisiens — bilingue arabe/français.

22 modèles de contrats couvrant 6 domaines du droit tunisien (logement, travail, argent, véhicules, entreprise, démarches), alimentés par 1 477 articles extraits du Code des Obligations et des Contrats, du Code du Travail et du Code des Sociétés Commerciales.

## Structure

```
contraty/
├── backend/       FastAPI — génération, embedding search, PDF/DOCX, analytics API
├── frontend/      Next.js 16 App Router — wizard multilingue, RTL
├── analytics/     Dashboard analytics statique (auth basique, non indexé)
├── data/          Codes juridiques scrapés + templates JSON
├── backend/tests/  Tests pytest (unités + contenu PDF/DOCX)
└── frontend/e2e/   Tests Playwright (navigation, wizard, génération)
```

## Stack

| Couche | Technologie |
|---|---|
| Backend | FastAPI (Python 3.12), Supabase (PostgreSQL + pgvector) |
| Frontend | Next.js 16, Tailwind CSS, RTL |
| LLM | Gemini Flash (FR + AR — *review* uniquement ; le remplissage est déterministe) |
| PDF / DOCX | WeasyPrint / python-docx (polices Noto Arabic embarquées) |
| Analytics | Backend Supabase (`analytics_events`) + dashboard statique (`analytics/`) |
| Déploiement | GCP Cloud Run (backend, frontend, analytics) — europe-west1 |

## Démarrage rapide

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # remplir les clés API
uvicorn app.main:app --reload   # docs Swagger actives en développement uniquement

# Frontend
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Tests

```bash
# Backend (110 tests : API, validation, PDF/DOCX, contenu des contrats, rate-limit)
cd backend && source .venv/bin/activate
pytest -q
ruff check app/

# Frontend — tests unitaires + lint
cd frontend
npm test          # Vitest (45 tests)
npm run lint      # ESLint

# Frontend — E2E Playwright (démarre backend :8001 + frontend :3001 automatiquement)
cd frontend
npm run test:e2e                                     # suite déterministe (106 tests)
E2E_GENERATE=1 npm run test:e2e -- generate          # matrice live 22 contrats × 2 langues (PDF+DOCX)

# Contenu des PDF (audit manuel, sans Gemini)
cd backend && .venv/bin/python scripts/validate_pdf_content.py
```

## Déploiement (GCP Cloud Run)

Le backend est construit depuis la **racine** du dépôt (`Dockerfile` racine, qui embarque `data/templates`, `data/reference`, `data/vehicles` et les polices `fonts-noto-core` pour l'arabe).

```bash
# Backend (1 instance chaude, timeout 900s pour la review Gemini)
gcloud run deploy contraty-backend --source . --region=europe-west1 \
  --allow-unauthenticated \
  --min-instances=1 --max-instances=1 --cpu=1 --memory=512Mi --timeout=900 \
  --set-env-vars "SUPABASE_URL=...,SUPABASE_SERVICE_KEY=...,GEMINI_API_KEY=...,APP_ENV=production,CORS_ORIGINS=..."

# Frontend
gcloud run deploy contraty-frontend --source ./frontend --region=europe-west1 \
  --allow-unauthenticated --max-instances=1 \
  --set-env-vars "NEXT_PUBLIC_API_URL=https://contraty-backend-....a.run.app/api/v1"

# Dashboard analytics (auth basique, non indexé)
gcloud run deploy contraty-analytics --source ./analytics --region=europe-west1 --allow-unauthenticated
```

### Variables d'environnement (backend)

| Variable | Rôle |
|---|---|
| `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` | Supabase (templates + analytics) |
| `GEMINI_API_KEY` | Review + translittération (le remplissage n'en dépend pas) |
| `APP_ENV` | `production` |
| `CORS_ORIGINS` | Origines autorisées (liste virgule) : `https://contraty.tn`, `https://www.contraty.tn`, + les URL `.run.app` du frontend et du dashboard analytics |

> **Rate limiting** : 30 req/min **par IP client** (clé sur `X-Forwarded-For`). Le compte par proxy (IP du load balancer) a été corrigé — sinon tous les utilisateurs partageaient le même quota derrière Cloud Run.

## Phase actuelle

Produit en production sur `https://contraty.tn`. Génération PDF/DOCX validée sur les 22 modèles × 2 langues.

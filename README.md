# Contraty

Générateur de contrats juridiques tunisiens — bilingue arabe/français.

22 modèles de contrats couvrant 6 domaines du droit tunisien (logement, travail, argent, véhicules, entreprise, démarches), alimentés par 1 477 articles extraits du Code des Obligations et des Contrats, du Code du Travail et du Code des Sociétés Commerciales.

## Structure

```
contraty/
├── backend/       FastAPI — génération IA, embedding search, PDF, analytics API
├── frontend/      Next.js 14 App Router — wizard multilingue, SSG
├── analytics/     Dashboard analytics autonome (nginx + page statique, auth basique)
├── data/          Codes juridiques scrapés + templates JSON
└── backend/migrations/  Schémas SQL Supabase (001 → 003)
```

## Stack

| Couche | Technologie |
|---|---|
| Backend | FastAPI (Python 3.12), Supabase (PostgreSQL + pgvector) |
| Frontend | Next.js 16, Tailwind CSS, RTL |
| LLM | Gemini Flash (FR + AR) |
| PDF | WeasyPrint |
| Analytics | Backend Supabase (`analytics_events`) + dashboard nginx (`analytics/`) |
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

## Déploiement (GCP Cloud Run)

```bash
# Backend (maintient 1 instance chaude — min-instances=1)
gcloud run deploy contraty-backend --source . --region=europe-west1 --min-instances=1

# Frontend
gcloud run deploy contraty-frontend --source ./frontend --region=europe-west1

# Dashboard analytics (auth basique, non indexé)
gcloud run deploy contraty-analytics --source ./analytics --region=europe-west1 --allow-unauthenticated
```

## Phase actuelle

Phase 0 — Data collection & template building **terminée**. Prompt engineering en cours.

# Contraty

Générateur de contrats juridiques tunisiens — bilingue arabe/français.

22 modèles de contrats couvrant 6 domaines du droit tunisien (logement, travail, argent, véhicules, entreprise, démarches), alimentés par 1 477 articles extraits du Code des Obligations et des Contrats, du Code du Travail et du Code des Sociétés Commerciales.

## Structure

```
contraty/
├── backend/       FastAPI — génération IA, embedding search, PDF
├── frontend/      Next.js 14 App Router — wizard multilingue, SSG
├── data/          Codes juridiques scrapés + templates JSON
└── planning/      Docs de conception et de produit
```

## Stack

| Couche | Technologie |
|---|---|
| Backend | FastAPI (Python 3.12), Supabase (PostgreSQL + pgvector) |
| Frontend | Next.js 14, Tailwind CSS, shadcn/ui (RTL) |
| LLM | Mistral Large (FR), Gemini 2.5 Pro (AR), GPT-4o-mini (fallback) |
| PDF | WeasyPrint |
| Paiement | Paddle |
| Déploiement | Railway (backend), Vercel (frontend) |

## Démarrage rapide

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # remplir les clés API
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Phase actuelle

Phase 0 — Data collection & template building **terminée**. Prompt engineering en cours.

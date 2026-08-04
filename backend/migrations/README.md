# Migrations

Run each file in order (001 → 002 → 003) against your Supabase PostgreSQL database.

## Supabase SQL Editor

1. Go to your Supabase project → SQL Editor → New query
2. Paste the contents of each migration file (in order)
3. Click Run

Or via CLI:

```bash
psql "$DATABASE_URL" -f backend/migrations/001_initial_schema.sql
psql "$DATABASE_URL" -f backend/migrations/002_fix_metadata.sql
psql "$DATABASE_URL" -f backend/migrations/003_analytics_events.sql
```

## What each migration creates

| File | Purpose |
|---|---|
| `001_initial_schema.sql` | `templates`, `template_chunks` (pgvector), `contracts` tables + updated_at trigger |
| `002_fix_metadata.sql` | Metadata fixes for existing template rows |
| `003_analytics_events.sql` | `analytics_events` table for product analytics (template_view, contract_generate, contract_download, ...) |

## After running 001

Seed the templates from JSON files:

```bash
cd backend && source .venv/bin/activate
SUPABASE_URL="https://xxx.supabase.co" \
SUPABASE_SERVICE_KEY="eyJ..." \
python -m app.db.seed
```

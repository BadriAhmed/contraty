# Migrations

Run `001_initial_schema.sql` against your Supabase PostgreSQL database.

## Supabase SQL Editor

1. Go to your Supabase project → SQL Editor → New query
2. Paste the contents of `001_initial_schema.sql`
3. Click Run

Or via CLI:

```bash
psql "$DATABASE_URL" -f backend/migrations/001_initial_schema.sql
```

## What it creates

| Table | Purpose |
|---|---|
| `templates` | 22 contract templates (titles, descriptions, sections, field metadata) |
| `template_chunks` | One row per article, ready for pgvector embedding search |
| `contracts` | Every generated contract (audit trail, re-download) |

## After running

Seed the templates from JSON files:

```bash
cd backend && source .venv/bin/activate
SUPABASE_URL="https://xxx.supabase.co" \
SUPABASE_SERVICE_KEY="eyJ..." \
python -m app.db.seed
```

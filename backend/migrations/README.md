# Migrations

Run these in order against your Supabase PostgreSQL database.

## Quick start (Supabase SQL Editor)

1. Go to your Supabase project → SQL Editor
2. Copy and paste each file in order: 001 → 002 → 003 → 004 → 005
3. Or run them all at once:

```bash
cat migrations/*.sql | psql "$DATABASE_URL"
```

## Files

| # | File | What it creates |
|---|---|---|
| 001 | `001_enable_pgvector.sql` | pgvector extension (for embedding search) |
| 002 | `002_create_templates.sql` | templates table (22 contracts, sections, field metadata) |
| 003 | `003_create_template_chunks.sql` | template_chunks (one row per article, vector embeddings) |
| 004 | `004_create_contracts.sql` | contracts (generated contracts, audit trail) |
| 005 | `005_updated_at_trigger.sql` | auto-update `updated_at` on templates |

## After running migrations

Seed the templates from the JSON files:

```bash
cd backend
source .venv/bin/activate
SUPABASE_URL="https://xxx.supabase.co" \
SUPABASE_SERVICE_KEY="eyJ..." \
python -m app.db.seed
```

Or from Python:

```python
import asyncio
from app.db.supabase_repo import SupabaseTemplateRepository
from app.db.seed import seed_templates

asyncio.run(seed_templates(SupabaseTemplateRepository()))
```

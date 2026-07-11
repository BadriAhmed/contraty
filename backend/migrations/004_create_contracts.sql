-- Migration 004: Generated contracts table
-- Persists every contract a user generates (anonymous or authenticated)
-- Enables re-download, history, and analytics

CREATE TABLE IF NOT EXISTS contracts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID,
    template_slug   TEXT NOT NULL,
    language        TEXT NOT NULL CHECK (language IN ('ar', 'fr')),
    user_fields     JSONB NOT NULL DEFAULT '{}',
    generated_json  JSONB NOT NULL DEFAULT '{}',
    model_used      TEXT NOT NULL DEFAULT '',
    fallback_used   BOOLEAN NOT NULL DEFAULT FALSE,
    tokens_used     INTEGER NOT NULL DEFAULT 0,
    generation_ms   INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contracts_user ON contracts (user_id);
CREATE INDEX idx_contracts_template ON contracts (template_slug);
CREATE INDEX idx_contracts_created ON contracts (created_at DESC);

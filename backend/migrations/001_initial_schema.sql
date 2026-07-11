-- Migration 001: Initial schema
-- Run against Supabase PostgreSQL

-- ============================================================
-- Extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- Templates
-- ============================================================
CREATE TABLE IF NOT EXISTS templates (
    id               TEXT PRIMARY KEY,
    slug             TEXT UNIQUE NOT NULL,
    title_ar         TEXT NOT NULL DEFAULT '',
    title_fr         TEXT NOT NULL DEFAULT '',
    description_ar   TEXT NOT NULL DEFAULT '',
    description_fr   TEXT NOT NULL DEFAULT '',
    domain           TEXT NOT NULL CHECK (domain IN ('logement', 'travail', 'argent', 'vehicules', 'entreprise', 'demarches')),
    legal_basis      TEXT NOT NULL DEFAULT '',
    version          TEXT NOT NULL DEFAULT '1.0',
    reviewed_by      TEXT,
    review_date      TIMESTAMPTZ,
    source           TEXT NOT NULL DEFAULT 'public_examples',
    disclaimer       TEXT NOT NULL DEFAULT '',
    sections         JSONB NOT NULL DEFAULT '[]',
    field_metadata   JSONB NOT NULL DEFAULT '{}',
    complexity       TEXT NOT NULL DEFAULT 'medium' CHECK (complexity IN ('low', 'medium', 'high')),
    field_count      INTEGER NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_templates_slug ON templates (slug);
CREATE INDEX idx_templates_domain ON templates (domain);

-- ============================================================
-- Template chunks (RAG / embedding search)
-- ============================================================
CREATE TABLE IF NOT EXISTS template_chunks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_slug   TEXT NOT NULL REFERENCES templates(slug) ON DELETE CASCADE,
    chunk_index     INTEGER NOT NULL,
    section_id      TEXT NOT NULL DEFAULT '',
    article_id      TEXT NOT NULL DEFAULT '',
    text_fr         TEXT NOT NULL DEFAULT '',
    text_ar         TEXT NOT NULL DEFAULT '',
    embedding       vector(1536),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (template_slug, chunk_index)
);

CREATE INDEX idx_chunks_template ON template_chunks (template_slug);
CREATE INDEX idx_chunks_embedding ON template_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);

-- ============================================================
-- Generated contracts
-- ============================================================
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

-- ============================================================
-- Triggers
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

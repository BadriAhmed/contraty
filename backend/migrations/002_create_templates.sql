-- Migration 002: Templates table
-- Stores the 22 contract templates (metadata, sections, field validation rules)

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

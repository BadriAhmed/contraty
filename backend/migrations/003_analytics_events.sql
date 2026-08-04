-- Migration 003: Analytics events
-- Run against Supabase PostgreSQL
-- Stores product analytics events fired from the frontend (template_view,
-- template_click, domain_filter, wizard_start, contract_generate,
-- contract_download, blank_download, blank_customize)

CREATE TABLE IF NOT EXISTS analytics_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name      TEXT NOT NULL,
    slug            TEXT NOT NULL DEFAULT '',
    lang            TEXT NOT NULL DEFAULT '',
    domain          TEXT NOT NULL DEFAULT '',
    format          TEXT NOT NULL DEFAULT '',
    field_count     INTEGER,
    props           JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_created ON analytics_events (created_at DESC);
CREATE INDEX idx_analytics_name ON analytics_events (event_name);
CREATE INDEX idx_analytics_slug ON analytics_events (slug);
CREATE INDEX idx_analytics_lang ON analytics_events (lang);

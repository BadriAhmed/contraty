-- Migration 003: Template chunks for RAG / embedding search
-- Each article in a template becomes one chunk with a 1536-dim vector embedding
-- Used by pgvector similarity search to find relevant clauses

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

-- IVF-Flat index for fast approximate nearest-neighbor search
-- lists = 10 is appropriate for ~200-300 chunks (22 templates × ~10 articles each)
CREATE INDEX idx_chunks_embedding ON template_chunks
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 10);

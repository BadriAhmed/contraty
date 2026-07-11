-- Migration 001: Enable pgvector extension for embedding search
-- Required for: template_chunks table (004_create_template_chunks.sql)

CREATE EXTENSION IF NOT EXISTS vector;

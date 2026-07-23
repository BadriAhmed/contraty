-- Migration 002: Fix stale field_metadata
-- 1. Mark MOTIF_DEMISSION as optional in lettre-demission
-- 2. Update all date field patterns to accept ISO format (YYYY-MM-DD)

-- ============================================================
-- 1. Lettre-demission: MOTIF_DEMISSION optional
-- ============================================================
UPDATE templates
SET field_metadata = jsonb_set(
    jsonb_set(
        field_metadata,
        '{MOTIF_DEMISSION,required}', 'false'
    ),
    '{MOTIF_DEMISSION,min_length}', '0'
)
WHERE slug = 'lettre-demission'
  AND field_metadata ? 'MOTIF_DEMISSION';

-- ============================================================
-- 2. All templates: update date field patterns
--    Old: ^\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{2,4}$
--    New: ^(\d{4}-\d{2}-\d{2}|\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{2,4})$
-- ============================================================
DO $$
DECLARE
    rec RECORD;
    old_pattern text := '^\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{2,4}$';
    new_pattern text := '^(\d{4}-\d{2}-\d{2}|\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{2,4})$';
BEGIN
    FOR rec IN
        SELECT id, slug, field_metadata
        FROM templates
        WHERE field_metadata IS NOT NULL
    LOOP
        FOR fkey, val IN SELECT * FROM jsonb_each(rec.field_metadata)
        LOOP
            IF val->>'type' = 'date' AND val->>'pattern' = old_pattern THEN
                UPDATE templates
                SET field_metadata = jsonb_set(
                    field_metadata,
                    ARRAY[fkey, 'pattern'],
                    to_jsonb(new_pattern)
                )
                WHERE id = rec.id;
            END IF;
        END LOOP;
    END LOOP;
END $$;

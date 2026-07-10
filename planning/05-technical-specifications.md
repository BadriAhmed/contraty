# Technical Specifications

## Database Schema

```sql
-- templates: the curated template corpus
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ar VARCHAR(255) NOT NULL,
    title_fr VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,  -- immobilier, travail, societes, civil, commercial
    language VARCHAR(10) NOT NULL,  -- ar, fr, both
    legal_basis TEXT,
    version VARCHAR(20) DEFAULT '1.0',
    reviewed_by VARCHAR(255),
    review_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- template_chunks: individual articles with embeddings
CREATE TABLE template_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
    section_title_ar VARCHAR(255),
    section_title_fr VARCHAR(255),
    article_id VARCHAR(50),
    text_ar TEXT,
    text_fr TEXT,
    fields JSONB DEFAULT '[]',  -- array of field names like ["NOM_PRENEUR", "MONTANT_LOYER"]
    chunk_index INTEGER NOT NULL,  -- ordering within template
    embedding VECTOR(1536),  -- pgvector
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_template_chunks_template ON template_chunks(template_id);
CREATE INDEX idx_template_chunks_embedding ON template_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- contracts: generated contracts (for authenticated users after Phase 3)
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES templates(id),
    contract_type VARCHAR(50) NOT NULL,
    language VARCHAR(10) NOT NULL,
    title_ar VARCHAR(255),
    title_fr VARCHAR(255),
    user_fields JSONB NOT NULL,  -- the fields the user filled in
    generated_content JSONB NOT NULL,  -- the full AI-generated contract JSON
    pdf_url TEXT,  -- Supabase Storage URL
    status VARCHAR(20) DEFAULT 'completed',  -- completed, flagged_for_review, draft
    feedback VARCHAR(10),  -- thumbs_up, thumbs_down, null
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- subscriptions: paid user plans (Phase 4)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    paddle_subscription_id VARCHAR(255) UNIQUE,
    paddle_customer_id VARCHAR(255),
    plan VARCHAR(20) NOT NULL,  -- free, premium_monthly, premium_annual
    status VARCHAR(20) NOT NULL,  -- active, past_due, cancelled, paused
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_paddle ON subscriptions(paddle_subscription_id);

-- anonymous_usage: rate limiting tracking (Phase 1)
CREATE TABLE anonymous_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_hash VARCHAR(64) NOT NULL,
    contracts_generated INTEGER DEFAULT 0,
    last_generated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_anonymous_usage_ip ON anonymous_usage(ip_hash);
```

## API Endpoints

### Public (no auth required)

| Method | Path | Description |
|---|---|---|
| GET | `/api/templates` | List all active templates (paginated, filterable by category/language) |
| GET | `/api/templates/:slug` | Get single template details (for SEO page) |
| POST | `/api/contracts/generate` | Generate a contract (anonymous, rate-limited) |
| POST | `/api/contracts/pdf` | Generate PDF from contract JSON |
| GET | `/api/health` | Health check |

### Authenticated (Phase 3+)

| Method | Path | Description |
|---|---|---|
| GET | `/api/me/contracts` | List user's saved contracts |
| GET | `/api/me/contracts/:id` | Get single saved contract |
| DELETE | `/api/me/contracts/:id` | Delete saved contract |
| GET | `/api/me/subscription` | Get current subscription status |
| POST | `/api/me/contracts/:id/feedback` | Submit thumbs up/down on a contract |

### Webhooks (Phase 4)

| Method | Path | Description |
|---|---|---|
| POST | `/api/webhooks/paddle` | Paddle subscription events |

## Contract Generation Flow (Detailed)

```
POST /api/contracts/generate
{
  "contract_type": "bail-habitation",
  "language": "fr",
  "fields": {
    "NOM_BAILLEUR": "Mohamed Ben Salah",
    "CIN_BAILLEUR": "12345678",
    "ADRESSE_BAILLEUR": "18 Rue Habib Bourguiba, Tunis",
    "NOM_PRENEUR": "Fatma Trabelsi",
    "CIN_PRENEUR": "87654321",
    "ADRESSE_BIEN": "45 Avenue de la Liberté, Ariana",
    "MONTANT_LOYER": "800",
    "DUREE": "3 ans",
    "DATE_DEBUT": "2026-08-01"
  }
}

Response:
{
  "contract_id": "uuid",
  "status": "completed",
  "title_fr": "Contrat de Bail d'Habitation",
  "language": "fr",
  "sections": [
    {
      "title": "Parties",
      "articles": [
        {
          "number": 1,
          "text": "M. Mohamed Ben Salah, de nationalité tunisienne, titulaire de la CIN n° 12345678, demeurant à 18 Rue Habib Bourguiba, Tunis, ci-après dénommé 'le Bailleur', d'une part..."
        }
      ]
    },
    ...
  ],
  "pdf_url": null,  // null until PDF generation called
  "warnings": []  // any AI validation warnings
}
```

## PDF Generation

WeasyPrint renders HTML → PDF. The HTML template uses:

- `dir="rtl"` for Arabic, `dir="ltr"` for French
- CSS `@page` for margins, headers, footers
- Amiri font for Arabic text, Inter for French
- Page numbers in footer
- Watermark: "Généré par Contraty" (free tier), removed for premium
- Letterhead: Contraty logo top-left

## Error Handling

| Scenario | HTTP Code | Response |
|---|---|---|
| Rate limit exceeded | 429 | `{"error": "rate_limit", "retry_after": 60}` |
| AI generation failed | 502 | `{"error": "ai_error", "message": "Generation failed, please retry"}` |
| Validation failed (AI output malformed) | 422 | `{"error": "validation_failed", "details": [...]}` |
| Template not found | 404 | `{"error": "not_found"}` |
| Free tier limit reached | 403 | `{"error": "quota_exceeded", "upgrade_url": "/pricing"}` |

## Security Considerations

- **AI output:** GPT-generated text can theoretically include injection attacks. Always sanitize before putting into WeasyPrint HTML.
- **Rate limiting:** Per-IP for anonymous, per-user for authenticated. Prevents AI cost abuse.
- **Paddle webhook signature verification:** Must verify HMAC on every webhook to prevent fake subscription events.
- **PGP/CSP:** Content Security Policy headers to prevent XSS. Strictest: `script-src 'self'` only (no inline scripts, no third-party except AdSense).
- **Input sanitization:** User fields go through HTML/JSON escaping before entering prompt — prevents prompt injection attacks.
- **PDF metadata:** Generated PDFs stripped of author/creator metadata that could expose server paths.

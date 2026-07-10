# AI Contract Generation System

## How It Works

The AI does not generate contracts from scratch — it uses **RAG (Retrieval-Augmented Generation)** grounded in a curated database of Tunisian legal templates.

### Architecture

```
Template DB (PostgreSQL + pgvector)
    │  Each template: title, language (ar/fr), clauses (chunked), embedding vector
    │
    ▼
User fills wizard
    │  Contract type, parties, dates, amounts, special clauses
    │
    ▼
pgvector similarity search
    │  Retrieves top-3 most relevant template clauses for this contract type
    │
    ▼
LLM prompt assembly
    │  system_prompt + retrieved_clauses + user_fields + formatting_rules
    │
    ▼
GPT-4o-mini generation
    │  Returns structured JSON (sections → articles → clauses)
    │
    ▼
Pydantic validation
    │  Ensures structure: contract_metadata, parties, articles[], signatures_block
    │
    ▼
WeasyPrint rendering
    │  HTML/CSS template → PDF (handles Arabic RTL + French LTR mixed layout)
    │
    ▼
User download
```

### Why RAG Instead of Fine-Tuning?

| Approach | Pros | Cons |
|---|---|---|
| **Fine-tuning** | Always follows Tunisian legal style | Needs 500+ examples, expensive, must retrain on law changes |
| **RAG (chosen)** | Works with 15-20 templates, easy to update when laws change, cheaper inference | Slightly higher token cost per generation |

For an MVP with 15-20 template documents, RAG is the correct choice. If the product scales to thousands of templates, fine-tuning becomes viable later.

### Prompt Engineering Strategy

The system prompt must enforce:
1. **Jurisdiction lock**: "You are drafting under Tunisian law (Code des Obligations et des Contrats, Code du Travail, Code du Statut Personnel). Do not use French or Moroccan legal references."
2. **Bilingual output**: "Generate in the user's chosen language (Arabic or French). Legal terms must use official Tunisian legal terminology."
3. **Structured output**: "Return JSON with sections → articles → clause_text. Every article must be a complete, actionable clause."
4. **Disclaimers**: "Add a footer in small text: 'Ce document est généré automatiquement. Pour des cas complexes, consultez un avocat.' (French) or the Arabic equivalent."
5. **Field filling**: "Replace [PARTIE_A], [MONTANT], [DATE] with user-provided values. Leave no placeholders."

### Validation Layer

Every AI output passes through Pydantic validation:
- Required sections present (parties, obligations, duration, signatures)
- Dates are valid and in the future for ongoing contracts
- Monetary amounts are positive and properly formatted
- No remaining placeholder tokens (`[TOKEN]`)
- Language consistency (don't mix Arabic articles in a French contract)

If validation fails → retry with GPT-4o-mini (max 2 retries) → if still fails → flag for manual review.

### Cost Estimation

| Item | Cost |
|---|---|
| GPT-4o-mini: ~1,500 tokens/contract (prompt + output) | $0.00045 / contract |
| Embedding generation: 1,536 dims per chunk | $0.00002 / chunk |
| Total AI cost per contract | ~$0.0005 |

At 1,000 free contracts/month: $0.50. At 10,000: $5.00. AI cost is negligible.

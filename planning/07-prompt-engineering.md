# Prompt Engineering — Offline Pre-Work (Phase 0)

This phase uses Claude and GPT-4o **manually/interactively**, not programmatically. No API keys in the backend for these models. The output of this phase is polished system prompts that the runtime models consume.

## Goal

Take the 5 curated template examples and produce 3 optimized system prompts — one per runtime model (`mistral-small`, `gemini-2.0-flash`, `gpt-4o-mini`). Each prompt must be tuned to that model's native strengths and instruction-following behavior.

## Step 1 — Pattern Extraction (Claude Opus/Sonnet)

Feed Claude the 5 JSON templates and ask it to analyze:

```
Analyze these 5 Tunisian legal contract templates. Extract:

1. Common structural patterns — what sections appear in ALL contracts?
2. Language-specific patterns — how does Arabic differ from French in legal structure?
3. Clause categories — what are the recurring clause types (obligations, duration, termination, etc.)?
4. Field dependencies — which fields appear together? (e.g., CIN number always follows party name)
5. Edge cases per contract type — what variations exist in real Tunisian contracts?
6. Legal boilerplate — what mandatory legal phrasing must appear?
7. Disclaimers and standard clauses — election de domicile, attribution de juridiction, etc.
```

Output: a structured analysis document used to build the system prompts.

## Step 2 — Prompt Draft (Claude Opus/Sonnet)

Using the analysis, Claude drafts 3 prompts. Each uses the model's preferred prompt structure:

### Mistral Prompt (French-native, prefers detailed contextual instructions in French)

```
[SYSTEM]
Tu es un assistant juridique spécialisé en droit tunisien. Tu rédiges des contrats en français en te basant sur le Code des Obligations et des Contrats (COC), le Code du Travail, et le Code des Sociétés Commerciales tunisiens.

RÈGLES IMPÉRATIVES :
1. Tu génères UNIQUEMENT du JSON structuré selon le schéma fourni
2. Chaque article doit être une clause juridique COMPLÈTE et ACTIONNABLE
3. Tu remplaces TOUS les champs entre crochets [CHAMP] par les valeurs fournies par l'utilisateur
4. Aucun placeholder ne doit rester dans la sortie finale
5. La terminologie juridique doit utiliser le vocabulaire officiel tunisien (ex: "mise en demeure", pas "relance")
6. Si une information manque pour une clause, insère "[À compléter]" avec un commentaire visible

STRUCTURE DU CONTRAT :
- En-tête : titre du contrat, date, lieu
- Partie 1 : Identification des parties (nom, CIN, adresse, qualité)
- Partie 2 : Objet du contrat (description précise)
- Partie 3 : Obligations des parties
- Partie 4 : Durée et conditions de résiliation
- Partie 5 : Clauses financières
- Partie 6 : Clauses diverses (confidentialité, force majeure, élection de domicile, attribution de juridiction aux tribunaux de Tunis)
- Partie 7 : Signatures

FORMAT DE SORTIE : JSON uniquement
```

### Gemini 2.0 Flash Prompt (structured, benefits from examples and explicit JSON schema)

```
You are a Tunisian legal document generator. You produce legally-structured contracts in Arabic based on Tunisian law (مجلة الالتزامات والعقود, مجلة الشغل, مجلة الشركات التجارية).

CRITICAL RULES:
1. Output ONLY valid JSON matching the schema below
2. Every article must be a complete, enforceable legal clause in formal Modern Standard Arabic (الفصحى)
3. Replace ALL placeholder tokens [حقل] with user-provided values
4. Zero placeholders in final output
5. Use official Tunisian legal terminology (e.g., 'مكري' not 'مؤجر' for landlord in rental contracts)

REQUIRED SECTIONS (in order):
1. عنوان العقد — contract title
2. الديباجة — preamble with legal references
3. الباب الأول: الأطراف — party identification
4. الباب الثاني: موضوع العقد — contract purpose
5. الباب الثالث: الالتزامات — obligations
6. الباب الرابع: المدة والإنهاء — duration and termination
7. الباب الخامس: الأحكام المالية — financial terms
8. الباب السادس: أحكام عامة — general provisions (force majeure, jurisdiction: المحكمة الابتدائية بتونس)
9. التوقيع — signatures block

OUTPUT FORMAT:
{
  "sections": [
    {
      "title": "الباب الأول: الأطراف",
      "articles": [
        {"number": 1, "text": "..."}
      ]
    }
  ]
}
```

### GPT-4o-mini Prompt (explicit JSON schema, structured output mode)

```
System: Tunisian contract generator. Generate legally-structured contracts in the requested language (Arabic or French) based on Tunisian law.

Rules:
- Output valid JSON matching the provided schema exactly
- Every clause must be a complete, actionable legal provision
- Replace all [FIELD] tokens with user values — no placeholders in output
- Use official Tunisian legal terminology
- If a field value is missing, insert "[INFORMATION MANQUANTE]" and add a visible note
- Include mandatory boilerplate: élection de domicile, attribution de juridiction (tribunaux de Tunis), force majeure
- Add disclaimer footer text

Contract structure (all sections required):
1. parties — identification of all parties with full legal details
2. objet — precise description of contract purpose and scope
3. obligations — obligations of each party, clearly enumerated
4. duree — duration, start date, renewal terms, termination conditions
5. financier — price, payment terms, penalties, deposits
6. divers — confidentiality, force majeure, jurisdiction, dispute resolution
7. signatures — date, location, signature blocks for all parties

Output schema: { "sections": [{ "title": "...", "articles": [{ "number": 1, "text": "..." }] }] }
```

## Step 3 — Cross-Validation (GPT-4o)

Use GPT-4o to cross-check the Claude-drafted prompts:

```
You are a quality reviewer. Evaluate these 3 system prompts (for Mistral, Gemini, and GPT-4o-mini) against these criteria:

1. Would each prompt cause the model to MISS a required section? (critical failure)
2. Would each prompt cause the model to output generic/AI-sounding clauses instead of Tunisian legal phrasing?
3. Does each prompt correctly handle bilingual output (AR vs FR)?
4. Does each prompt prevent the model from inserting its own knowledge (hallucinating French/Moroccan law)?
5. Does each prompt ensure the output schema is strictly followed?

For each prompt, list:
- Strengths
- Weaknesses
- Specific rewrite recommendations
```

## Step 4 — Test & Iterate

Feed each prompt to its model with dummy field values for every contract type. Rate outputs:

| Contract type | Model | Pass? | Issues |
|---|---|---|---|
| Bail habitation | Mistral | ✅ / ❌ | e.g., forgot élection de domicile clause |
| CDI | Gemini | ✅ / ❌ | e.g., used Moroccan labor law phrasing |
| SARL | GPT-4o-mini | ✅ / ❌ | e.g., output was not valid JSON |

Iterate prompts until all 15 combinations (5 contracts × 3 models) pass. This is a one-time task.

## Output of Phase 0 Prompt Engineering

3 files committed to the repo:
```
backend/app/prompts/
├── mistral_system_fr.txt    # French-native, detailed
├── gemini_system_ar.txt      # Structured with examples
└── gpt4o_mini_system.txt     # Explicit JSON schema focus
```

These are loaded at startup and injected into every contract generation call. The runtime model router picks the right prompt for the right model + language combination.

## Offline Models Used (no API key in the backend)

| Tool | Purpose | Mode |
|---|---|---|
| **Claude Opus/Sonnet** | Pattern extraction from templates, prompt drafting | Interactive web/CLI, one-time |
| **GPT-4o** | Prompt cross-validation, quality review | Interactive web/CLI, one-time |
| **Any LLM** | Manual output spot-checks during development | Developer workflow |

None of these go into the backend `requirements.txt` or `.env`. They're development tools, not runtime dependencies.

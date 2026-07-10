# API Contract — Contraty Backend

Base URL: `http://localhost:8000/api/v1`

All endpoints return JSON unless noted otherwise. Language codes: `"ar"` | `"fr"`.

---

## 1. GET /health

No auth. Used for liveness checks and template count.

```
GET /health
```

**Response `200`**
```json
{
  "status": "ok",
  "templates_loaded": 22
}
```

---

## 2. GET /contracts/templates

List all templates. Optional filters by domain and language.

```
GET /contracts/templates?domain=logement&language=fr
```

| Param | Type | Required | Values |
|---|---|---|---|
| `domain` | string | No | `logement`, `travail`, `argent`, `vehicules`, `entreprise`, `demarches` |
| `language` | string | No | `ar`, `fr` |

**Response `200` — `TemplateSummary[]`**
```json
[
  {
    "slug": "bail-habitation",
    "title_ar": "عقد كراء مسكن",
    "title_fr": "Contrat de Bail d'Habitation",
    "domain": "logement",
    "complexity": "medium",
    "field_count": 19
  },
  {
    "slug": "contrat-cdi",
    "title_ar": "عقد عمل غير محدد المدة",
    "title_fr": "Contrat de Travail à Durée Indéterminée",
    "domain": "travail",
    "complexity": "medium",
    "field_count": 22
  }
]
```

**Response `200` — empty list (no templates match)**
```json
[]
```

---

## 3. GET /contracts/templates/{slug}

Get a single template with its full section/article structure and field placeholders. This is what the FE wizard reads to build the form steps.

```
GET /contracts/templates/bail-habitation
```

**Response `200` — `TemplateDetail`**
```json
{
  "slug": "bail-habitation",
  "title_ar": "عقد كراء مسكن",
  "title_fr": "Contrat de Bail d'Habitation",
  "domain": "logement",
  "complexity": "medium",
  "field_count": 19,
  "legal_basis": "Code des Obligations et des Contrats, articles 727 à 827",
  "sections": [
    {
      "id": "sec-parties",
      "title_ar": "الأطراف",
      "title_fr": "Parties",
      "articles": [
        {
          "id": "art-bailleur",
          "text_ar": "السيد/ة [NOM_BAILLEUR]، تونسي/ة الجنسية، بطاقة تعريف وطنية عدد [CIN_BAILLEUR]، قاطن/ة بـ [ADRESSE_BAILLEUR]، يشار إليه/ا فيما يلي بـ « المكري ».",
          "text_fr": "M./Mme [NOM_BAILLEUR], de nationalité tunisienne, titulaire de la CIN n° [CIN_BAILLEUR], demeurant à [ADRESSE_BAILLEUR], ci-après dénommé(e) « le Bailleur ».",
          "fields": ["NOM_BAILLEUR", "CIN_BAILLEUR", "ADRESSE_BAILLEUR"]
        },
        {
          "id": "art-preneur",
          "text_ar": "السيد/ة [NOM_PRENEUR]، تونسي/ة الجنسية...",
          "text_fr": "M./Mme [NOM_PRENEUR], de nationalité tunisienne...",
          "fields": ["NOM_PRENEUR", "CIN_PRENEUR", "ADRESSE_PRENEUR"]
        }
      ]
    },
    {
      "id": "sec-objet",
      "title_ar": "موضوع العقد",
      "title_fr": "Objet du contrat",
      "articles": [
        {
          "id": "art-objet",
          "text_ar": "يمنح المكري للمكتري الذي يقبل، العقار المعد للسكن الكائن بـ [ADRESSE_BIEN]...",
          "text_fr": "Le Bailleur donne à bail au Preneur, qui accepte, le bien immobilier...",
          "fields": ["ADRESSE_BIEN", "DESCRIPTION_BIEN"]
        }
      ]
    }
  ]
}
```

**Response `404` — slug not found**
```json
{
  "detail": "Template not found"
}
```

### Fields array

The `fields` array on each article tells the FE which placeholders to render as inputs. The FE wizard de-duplicates across all articles (some fields like `NOM_BAILLEUR` appear once), shows one form field per unique placeholder, and substitutes all occurrences in the text.

The `field_count` on the summary is the deduplicated count — this is how many form inputs the wizard will show, not how many occurrences exist in the text.

---

## 4. POST /contracts/generate

Submit a filled form → get back a completed contract JSON. This calls the LLM with the template + user fields.

```
POST /contracts/generate
Content-Type: application/json
```

**Request body**
```json
{
  "contract_slug": "bail-habitation",
  "language": "fr",
  "user_fields": {
    "NOM_BAILLEUR": "Ali Ben Salah",
    "CIN_BAILLEUR": "12345678",
    "ADRESSE_BAILLEUR": "Rue Habib Bourguiba, Tunis",
    "NOM_PRENEUR": "Fatma Trabelsi",
    "CIN_PRENEUR": "87654321",
    "ADRESSE_PRENEUR": "Avenue de la Liberté, Ariana",
    "ADRESSE_BIEN": "Rue de Marseille, Tunis",
    "DESCRIPTION_BIEN": "Appartement F2, 2ème étage",
    "DUREE_BAIL": "3 ans",
    "DATE_DEBUT": "1er septembre 2026",
    "LOYER_MENSUEL": "800",
    "DEVISE": "TND",
    "PREAVIS_MOIS": "3"
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `contract_slug` | string | Yes | e.g. `"bail-habitation"`, `"contrat-cdi"` |
| `language` | string | Yes | `"ar"` or `"fr"` — which language to generate |
| `user_fields` | object | No | Map of placeholder → value. Keys match the field names from `GET /templates/{slug}` |

**Response `200` — success**
```json
{
  "success": true,
  "contract": {
    "id": "bail-habitation-v1",
    "slug": "bail-habitation",
    "title_ar": "عقد كراء مسكن",
    "title_fr": "Contrat de Bail d'Habitation",
    "language": ["fr", "ar"],
    "domain": "logement",
    "legal_basis": "Code des Obligations et des Contrats, articles 727 à 827",
    "version": "1.0",
    "reviewed_by": null,
    "review_date": null,
    "source": "public_examples",
    "disclaimer": "Modèle indicatif — non révisé par un avocat. Voir avertissement légal. / نموذج إرشادي — لم يراجعه محامٍ. راجع إخلاء المسؤولية القانونية.",
    "sections": [
      {
        "id": "sec-parties",
        "title_ar": "الأطراف",
        "title_fr": "Parties",
        "articles": [
          {
            "id": "art-bailleur",
            "text_ar": "السيد Ali Ben Salah، تونسي الجنسية...",
            "text_fr": "M. Ali Ben Salah, de nationalité tunisienne...",
            "fields": []
          }
        ]
      }
    ]
  },
  "model_used": "mistral",
  "language": "fr",
  "error": null,
  "fallback_attempted": false,
  "generation_time_ms": 2340,
  "tokens_used": 1250
}
```

**Response `200` — fallback triggered**
```json
{
  "success": true,
  "contract": { "..." },
  "model_used": "openai",
  "language": "ar",
  "error": null,
  "fallback_attempted": true,
  "generation_time_ms": 4500,
  "tokens_used": 980
}
```

**Response `200` — all models failed**
```json
{
  "success": false,
  "contract": null,
  "model_used": "",
  "language": "fr",
  "error": "All models failed after 3 fallback attempts",
  "fallback_attempted": true,
  "generation_time_ms": 12000,
  "tokens_used": 0
}
```

**Response `404` — unknown slug**
```json
{
  "detail": "Template 'invalid-slug' not found"
}
```

### Notes for FE

- **Placeholder substitution**: The returned `contract.sections[].articles[].text_ar` and `text_fr` have `[PLACEHOLDER]` tokens replaced with user-provided values. No brackets remain.
- **`fields` array**: Will be `[]` in the generated response (placeholders already substituted). The template endpoint is your source of truth for field definitions.
- **`model_used`**: `"mistral"` | `"gemini"` | `"openai"`. Show this in a debug footer or generation info tooltip.
- **`fallback_attempted: true`**: If primary model failed and a secondary model succeeded. The generated contract is still valid, but the FE might want to show a subtle warning ("généré avec un modèle de secours").
- **Generation time**: For French contracts (Mistral), expect 1.5–3 seconds. For Arabic (Gemini), expect 3–5 seconds.

---

## 5. POST /contracts/generate/pdf

Takes the generated contract JSON and renders a PDF. Returns binary.

```
POST /contracts/generate/pdf
Content-Type: application/json
```

**Request body**
```json
{
  "contract_slug": "bail-habitation",
  "language": "fr",
  "contract_json": {
    "id": "bail-habitation-v1",
    "slug": "bail-habitation",
    "title_ar": "عقد كراء مسكن",
    "title_fr": "Contrat de Bail d'Habitation",
    "language": ["fr", "ar"],
    "domain": "logement",
    "legal_basis": "Code des Obligations et des Contrats, articles 727 à 827",
    "version": "1.0",
    "reviewed_by": null,
    "review_date": null,
    "source": "public_examples",
    "disclaimer": "Modèle indicatif — non révisé par un avocat...",
    "sections": [
      {
        "id": "sec-parties",
        "title_ar": "الأطراف",
        "title_fr": "Parties",
        "articles": [
          {
            "id": "art-bailleur",
            "text_ar": "السيد Ali Ben Salah...",
            "text_fr": "M. Ali Ben Salah...",
            "fields": []
          }
        ]
      }
    ]
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `contract_slug` | string | Yes | Used for the PDF filename |
| `language` | string | Yes | `"ar"` or `"fr"` — determines text direction (RTL/LTR) and which `text_*` field to render |
| `contract_json` | object | Yes | The full contract object as returned by `POST /contracts/generate` |

**Response `200` — binary PDF**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="bail-habitation-fr.pdf"

<binary data>
```

**Response `400` — invalid contract JSON**
```json
{
  "detail": "Invalid contract JSON: 1 validation error for Contract\nsections\n  Field required"
}
```

### Notes for FE

- **Send the exact `contract` object** from the generate response as `contract_json`. Do not modify or restructure it.
- **PDF includes**: disclaimer block at the top (red-bordered), contract title, all sections with titles, and article text.
- **RTL**: When `language: "ar"`, the PDF renders right-to-left with appropriate Arabic font fallback.
- **PDF structure**: `Page 1` = disclaimer + title + parties section. Subsequent sections each get their own heading with article text below.
- **Fonts**: Uses system fonts (Arial for FR, Noto Naskh Arabic / Arial for AR). WeasyPrint handles the font fallback chain.
- **Download UX**: The FE should POST the generate response's `contract` object, receive the blob, create an object URL, and trigger a download via a hidden `<a>` element.

---

## Errors (all endpoints)

| Status | Body | When |
|---|---|---|
| `404` | `{"detail": "Template 'x' not found"}` | Unknown `contract_slug` |
| `400` | `{"detail": "Invalid contract JSON: ..."}` | Malformed `contract_json` in PDF request |
| `422` | FastAPI validation error (array of field errors) | Missing required fields or wrong types |
| `500` | `{"detail": "Internal server error"}` | Unhandled exceptions |

No auth headers needed in Phase 1. Rate limiting (5 req/min per IP) will be added but not yet implemented.

---

## Domain enum

Used in `GET /contracts/templates?domain=` and returned in every template's `domain` field.

| Value | AR label | FR label |
|---|---|---|
| `logement` | سكن | Logement |
| `travail` | عمل | Travail |
| `argent` | مال وقرض | Argent & Prêt |
| `vehicules` | عربات | Véhicules |
| `entreprise` | مؤسسة | Entreprise |
| `demarches` | إجراءات | Démarches |

---

## Complexity enum

Returned in `TemplateSummary.complexity`. Indicates how many fields and sections a contract has.

| Value | Fields | Sections | Examples |
|---|---|---|---|
| `low` | ≤ 12 | ≤ 5 | Quittance loyer, Attestation hébergement |
| `medium` | 13–20 | 6–8 | Bail habitation, CDI, CDD |
| `high` | ≥ 21 | ≥ 9 | Compromis vente immobilier, Statuts SARL |

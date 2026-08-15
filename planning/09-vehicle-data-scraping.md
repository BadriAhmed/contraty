# 09 — Vehicle Data Scraping (Cars & Moto)

**Status: 📝 Proposal — no code changes yet**

Goal: solve three vehicle-contract UX gaps with scraped data instead of hand-maintained lists.

## Context

Current templates (`vente-voiture`, `vente-moto`) use free-text fields:

| Field | vente-voiture | vente-moto |
|---|---|---|
| MARQUE | text | text |
| MODELE | text | text |
| CYLINDREE | — (absent) | text |
| NUM_CHASSIS / NUM_CADRE | text | text |

Problems: typos, mismatched brand/model, invalid cylinder values, and legal inconsistencies in the final contract.

---

## Items

### 6. Brand/Model dropdown with custom option (P0 — required)

**Where:** `vente-voiture` and `vente-moto` wizard steps (FormStep).

- MARQUE → `select` (dropdown) with all brands present on the Tunisian market.
- MODELE → `select` filtered by the chosen brand (cascading), sourced from the catalog.
- "Custom brand/model" escape hatch: an **"Autre / أخرى"** option reveals a free-text input (allowed in both FR & AR).
- Labels stay bilingual (options_fr / options_ar).

**UX note:** the current `select` field type (FormStep.tsx) renders a plain `<select>`. Cascading brand→model + "Autre" needs a small combo component (datalist or select + reveal input). Keep it dependency-free.

### 7. Photo of the "numéro de cadre" for moto (P1 — nice to have)

**Where:** `vente-moto` wizard.

- Photo capture/upload step for the frame number (VIN) location on the moto — helps users read/verify the 17-char code (often stamped on the steering head / neck).
- Data stays **in-session only** (matches the "aucune donnée stockée" promise): no upload to backend, no persistence.
- Optional field — never required.
- Open question for review: is the photo only for the user's reference, or should it be embedded in the DOCX/PDF? (python-docx and WeasyPrint can embed images, but that changes the document template.)

**Reference pictures (indication only):**
- Where the VIN/frame number sits on a motorcycle (steering head, frame neck):
  - https://commons.wikimedia.org/wiki/Special:Search?search=motorcycle+VIN+frame+number+steering+head
- Typical stamped VIN plate close-up:
  - https://commons.wikimedia.org/wiki/Special:Search?search=motorcycle+VIN+plate+stamped
- If we need custom illustration/UI mockups (e.g., "photo taken from wizard on phone"), we can generate them with Gemini.

### 8. CYLINDREE auto-validated from model, optional otherwise (P0 — required for moto)

**Where:** `vente-moto` (CYLINDREE field).

Rule (single source of truth = scraped catalog):

- **Brand+Model known in catalog** → `CYLINDREE` is auto-filled / pre-validated against the catalog value (user can confirm, or it's read-only).
- **Brand+Model unknown (custom entry)** → `CYLINDREE` becomes **optional** (current `required: true` relaxed) and free text.

Same logic applies to cars where useful (power/cylinders data exists per model).

---

## Data Scraping Plan

### Data to collect

| Entity | Fields | Used by |
|---|---|---|
| Cars | brand, model, generation/years, fuel type, cylinder cc (or fiscal power), body type | #6, #8 |
| Moto | brand, model, cylinder cc, type (road/scooter/off-road), years | #6, #8 |

### Candidate sources (to validate in a spike)

1. **Tunisian classifieds** (tayara.tn, annonces.tn) — reflect what's actually sold on the local market (incl. Chinese/Indian brands common in TN: Yadea, Vmoto, TVS, Bajaj, Benelli, plus Honda/Yamaha/Suzuki/Kymco for motos; Peugeot, Renault, VW, Seat, Skoda, Kia, Hyundai, MG, Changan for cars). Classifieds give model names + often cylinder cc per listing. Good for brand/model lists; noisy for specs.
2. **Wikipedia / Wikidata** — reliable per-model specs (cylindrée, power, years). Best for the `cylinders_cc` mapping used by #8.
3. **Manufacturer TN sites / importer catalogs** — small, curated, most accurate for "available in Tunisia" but require per-brand crawling.

**Spike deliverable (before committing to one source):** crawl one classifieds category + one Wikipedia model category, compare coverage for the 10 most common TN brands, decide the primary source.

### Pipeline (mirrors existing data/ pipeline)

```
classifieds + wikipedia
  ──[data/scrape_vehicles.py]──>  data/raw/vehicles/*.json
  ──[data/build_vehicle_catalog.py]──>  data/vehicles/{cars,motos}.json
  ──seed──>  template field_metadata (options, auto-fill map)
```

Catalog schema (draft):

```json
{
  "cars": [
    {
      "brand_fr": "Peugeot",
      "brand_ar": "بيجو",
      "models": [
        { "model_fr": "208", "model_ar": "208", "cylinders_cc": 1199, "fuel": "essence", "years": [2012, 2025] }
      ]
    }
  ],
  "motos": [
    {
      "brand_fr": "Honda",
      "models": [ { "model_fr": "CBF 125", "cylinders_cc": 125 } ]
    }
  ]
}
```

### Storage & integration

- JSON files under `data/vehicles/` (like `data/templates/`).
- `field_metadata` extension: `options_fr`/`options_ar` already exist for `select`; add an `allow_custom` flag + (optionally) `depends_on` (MODEL depends on MARQUE) — backend `FieldMetadata` model + `TemplateDetail` pass-through.
- `CYLINDREE` rule (#8) evaluated in the wizard client-side from the catalog payload (or served via a small `/vehicles` endpoint).

### Server / infra

- We have the oxa.host VPS (`dusty-puma-8aba.svr.computeservers.oxa.host`, Ubuntu 24.04) available for long-running crawls (polite rate limiting, retries).
- Credentials go in `.env` locally / server env — **never committed to git**.

---

## Open questions for you (check before I build)

1. **#7 scope:** photo = user reference only, or embedded in the downloaded DOCX/PDF?
2. **#8 read-only vs editable:** when the model is known, is CYLINDREE locked (auto-filled) or editable with a "suggestion"?
3. **Sources:** OK to start with classifieds (tayara/annonces) + Wikipedia specs, or do you have a preferred importer catalog to prioritize?
4. **Scope of #6:** also apply dropdown to ANNEE_MEC / CARBURANT / PUISSANCE_FISCALE (car) while we're at it, or strictly brand/model?

# Data Collection & Pre-Work

**Status: ✅ Template corpus built (22 templates). Legal codes scraped (1,477 articles).**

## What We Did

Instead of manually sourcing 5 templates, we automated the entire pipeline:

1. **Scraped Tunisian legal codes** from `jurisitetunisie.com` (note: domain is `jurisitetunisie.com`, not `juristunisie.com` as initially planned)
2. **1,477 unique legal articles extracted** across 3 codes (COC 1,034 + CT 193 + CS 250)
3. **22 bilingual contract templates built** with 224 articles and 371 field placeholders
4. **Automated scraper** (`data/scraper.py`) recursively discovers and parses all article pages
5. **Template builder** (`data/build_templates.py`, `data/build_remaining.py`) composes contracts from scraped articles

## Scraped Sources

| Source | URL | What we got |
|---|---|---|
| Code des Obligations et des Contrats | `jurisitetunisie.com/tunisie/codes/coc/` | 1,034 articles (Art. 3–1529) |
| Code du Travail | `jurisitetunisie.com/tunisie/codes/ct/` | 193 articles (partial — core Livre I articles 6–52 missing) |
| Code des Sociétés Commerciales | `jurisitetunisie.com/tunisie/codes/cs/` | 250 articles |
| JORT archives | `jurisitetunisie.com/se/index.php?board=46.0` | Indexed but not scraped as PDFs (not needed for templates) |
| Forum legal discussions | `jurisitetunisie.com/se/` | SIVP and Karama usage patterns confirmed via search |

**Critical finding:** `jurisitetunisie.com` has full legal codes in French only. No Arabic versions. The forum has 20K+ messages but **registration is suspended** — the site is read-only archival. This means Arabic translations must come from Gemini in Phase 0c (prompt engineering).

## Scraped Data Pipeline

```
jurisitetunisie.com  ──[scraper.py]──>  data/raw/*.json  ──[build_templates.py]──>  data/templates/*.json
      439 pages crawled                  coc_clean.json                               22 contract templates
      Multi-format parser                  ct_clean.json                              371 field placeholders
      Deduplication engine                 cs_clean.json                              6 UI domains
```

## Template Corpus — Phase 1 (22 documents, built)

### Domain: 🏠 Logement / سكن (Housing) — 4 templates

| # | Document | FR | AR | COC articles | Fields |
|---|---|---|---|---|---|
| 1 | bail-habitation | Contrat de Bail d'Habitation | عقد كراء مسكن | 727–827 | 19 |
| 2 | compromis-vente-immobilier | Compromis de Vente Immobilier | وعد بالبيع العقاري | 564–717 | 23 |
| 3 | etat-des-lieux | État des Lieux (Entrée/Sortie) | محضر معاينة | 727–827 | 38 |
| 4 | quittance-loyer | Quittance de Loyer | وصل كراء | 727–827 | 10 |

### Domain: 💼 Travail / عمل (Work) — 6 templates

| # | Document | FR | AR | Legal basis | Fields |
|---|---|---|---|---|---|
| 5 | contrat-cdi | Contrat de Travail CDI | عقد عمل غير محدد المدة | CT + COC 828–953 | 22 |
| 6 | contrat-cdd | Contrat de Travail CDD | عقد عمل محدد المدة | CT + COC 828–953 | 19 |
| 7 | contrat-sivp | Contrat SIVP | عقد صيغ | Loi 93-11, Déc. 2009-349 | 19 |
| 8 | contrat-karama | Contrat Karama | عقد عمل مدعم | Programme emploi aidé | 19 |
| 9 | lettre-demission | Lettre de Démission | رسالة استقالة | Code du Travail | 14 |
| 10 | rupture-conventionnelle | Rupture Conventionnelle CDI | اتفاقية إنهاء علاقة الشغل | Code du Travail | 14 |

### Domain: 💰 Argent & Prêt / مال وقرض (Money) — 2 templates

| # | Document | FR | AR | COC articles | Fields |
|---|---|---|---|---|---|
| 11 | reconnaissance-dette | Reconnaissance de Dette | اعتراف بدين | 1054–1103 | 16 |
| 12 | pret-particuliers | Prêt entre Particuliers | عقد قرض بين الخواص | 1054–1103 | 17 |

### Domain: 🚗 Véhicules / عربات (Vehicles) — 2 templates

| # | Document | FR | AR | COC articles | Fields |
|---|---|---|---|---|---|
| 13 | vente-voiture | Vente de Véhicule Automobile | عقد بيع سيارة | 564–717 | 18 |
| 14 | vente-moto | Vente de Motocyclette | عقد بيع دراجة نارية | 564–717 | 18 |

### Domain: 🏢 Entreprise / مؤسسة (Business) — 3 templates

| # | Document | FR | AR | Legal basis | Fields |
|---|---|---|---|---|---|
| 15 | statuts-sarl | Statuts de SARL | القانون الأساسي لشركة ذات مسؤولية محدودة | CS 90–159 + COC 1226–1451 | 12 |
| 16 | prestation-services | Prestation de Services | عقد تقديم خدمات | COC 828–887 | 15 |
| 17 | nda-confidentialite | NDA / Confidentialité | اتفاقية سرية | COC Livre I | 13 |

### Domain: 📋 Démarches / إجراءات (Admin) — 5 templates

| # | Document | FR | AR | Legal basis | Fields |
|---|---|---|---|---|---|
| 18 | procuration-speciale | Procuration Spéciale | وكالة خاصة | COC 1104–1194 | 10 |
| 19 | attestation-honneur | Attestation sur l'Honneur | شهادة على الشرف | COC | 12 |
| 20 | attestation-hebergement | Attestation d'Hébergement | شهادة إيواء | Usage admin | 11 |
| 21 | autorisation-parentale-voyage | Autorisation Parentale de Voyage | إذن سفر للقاصر | CSP | 16 |
| 22 | mise-en-demeure | Mise en Demeure | إنذار قانوني | COC 226–360 | 16 |

**Total: 22 templates, 224 articles, 371 field placeholders, 6 UI domains.**

## Template JSON Schema (unchanged from original)

```json
{
  "id": "bail-habitation-v1",
  "title_ar": "عقد كراء مسكن",
  "title_fr": "Contrat de bail d'habitation",
  "slug": "bail-habitation",
  "language": "both",
  "category": "logement",
  "legal_basis": "Code des Obligations et des Contrats, articles 791-830",
  "version": "1.0",
  "reviewed_by": null,
  "review_date": null,
  "source": "public_examples",
  "disclaimer": "Modèle indicatif — non révisé par un avocat. Voir avertissement légal.",
  "sections": [...]
}
```

Each template file is at `data/templates/{slug}.json`.

## Known Gaps

| Gap | Impact | Mitigation |
|---|---|---|
| Code du Travail Livre I (art. 6–52) not available on the site | CDI/CDD missing core formation articles | Supplemented with COC louage de services (828–953) + Convention Collective Cadre |
| Arabic text is human-written stub, not lawyer-reviewed | May contain translation inaccuracies | Gemini-assisted translation planned in Phase 0c |
| SIVP & Karama decree numbers partially verified | Exact legal references may be incomplete | Forum discussions confirm the contract structure; exact decrees need lawyer confirmation |
| `jurisitetunisie.com` registration suspended | Cannot ask questions on the forum | Data is archival — sufficient for template building |

## What's Still To Do (Phase 0c — Prompt Engineering)

- [ ] Generate embeddings for all 22 templates (text-embedding-3-small, 1536d)
- [ ] Load embeddings into pgvector
- [ ] Claude drafts 3 per-model system prompts
- [ ] GPT-4o cross-validates prompts
- [ ] Test against all 3 models (66 combinations: 22 contracts × 3 models)
- [ ] Commit final prompts to `backend/app/prompts/`
- [ ] Use Gemini to translate Arabic stubs to idiomatic legal Arabic

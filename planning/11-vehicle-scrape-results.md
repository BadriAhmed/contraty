# Vehicle Data Scraping — Results (Tunisia market)

**Date:** 2026-08-12 · **Server:** dusty-puma-8aba (oxa.host VPS, Ubuntu 24.04)

## What was done

Executed the spike from `planning/09-vehicle-data-scraping.md` on the VPS:

1. **Source testing** — classifieds (tayara.tn, annonces.tn) are **JS SPAs**: server-side they return shells (tayara redirects to `/search/`, annonces returns a 2 KB shell, no ad titles in HTML). Not scrapable without a headless browser. **automobile.tn** (Tunisian new-car catalog) works server-side and became the primary source.
2. **automobile.tn crawl** — 58 brands → 345 models currently sold NEW in Tunisia, with structured data (`@type: Car` JSON-LD): model name, trim, body type, fuel, price in TND, year, transmission, doors, seats.
3. **Two-pass extraction** — pass 1: 205 models with full JSON-LD specs; pass 2: +140 models where the spec page lacks JSON-LD, filled via `<title>` price parsing ("Prix X neuve - À partir de Y DT").
4. **Wikidata attempt (worldwide catalog)** — abandoned as out of scope per your direction (Tunisia only). Left on server as broken/partial files (`wikidata_*.json`), not used.

## Results

| Metric | Value |
|---|---|
| Brands | 58 (incl. local-market Chinese brands: BYD, Changan, Chery, Deepal, DFK, Dongfeng, Geely, GAC, Jetour, JMC, Omoda-Jaecoo, Voyah, WallysCar…) |
| Models | 345 |
| With full specs (fuel/body/year) | 205 |
| Price available | 345 (all) |
| Fuel mix | Essence 120 · Diesel 51 · Électrique 34 · (unknown 140) |

Sample: audi → A3 Berline, A3 Sportback, A5, A6 Sportback e-tron, Q2, Q3… · toyota → Hilux, Land Cruiser 300, Prado, bZ4X, Coaster…

### Catalog entry example
```json
{
  "brand": "peugeot",
  "models": [
    {
      "model": "Peugeot 208",
      "trim": "Peugeot 208 1.2 L Style",
      "body_type": "Citadine",
      "fuel": "Essence",
      "price_tnd": 76900,
      "year": "2025",
      "transmission": "Avant",
      "doors": "5",
      "seats": "5"
    }
  ]
}
```

## Files

| File | Location | Content |
|---|---|---|
| Raw catalog (JSON-LD + title fill) | `raw/automobile_tn_catalog.json` | 345 models, source flag `"source":"title"` on pass-2 entries |
| Final normalized catalog | `catalog/tn_cars.json` | brands sorted, models sorted, ready to seed |
| Crawl log | `automobile_tn.log` | per-brand progress + fetch errors |
| Scraper scripts | on VPS `/root/vehicle-scrape/` | `automobile_tn.py`, `pass2_fill.py`, `wikidata_scrape*.py` (unused) |

Local copies: `/tmp/kilo/vehicle-scrape/` (nothing committed to the repo yet).

## Notes & caveats

- **No cylindrée (cc)**: automobile.tn doesn't expose engine displacement in its HTML/JSON-LD. Item #8 (CYLINDREE auto-fill) needs a **second source** — options: (a) fix the Wikidata SPARQL query (a bug was identified: missing `SELECT` keyword; correct property is `P8628` cylindrée + `P1100` cylinders) filtered to the 58 TN brands; (b) per-model manual table for top models only. Recommend (a) as a follow-up.
- **Motos**: automobile.tn has no moto section. Options: tayara moto via headless browser (Playwright on the VPS), or Wikidata filtered to TN-relevant moto brands (Honda, Yamaha, Suzuki, Kymco, Bajaj, TVS, Benelli, Vmoto, Yadea…). Pending your call.
- **Prices are "from" (new, base trim)** — good for reference, not contractual.
- Politeness: 0.4–0.6 s delays between requests, retries with backoff, no errors logged on pass 1.
- Rate-limiting happened when fetching brand pages too fast initially (Cloudflare challenge pages) — fixed with delays + small-page retry.

## Next steps (awaiting your review)

1. Approve `tn_cars.json` → seed into `data/vehicles/` + `field_metadata` (`select` + `allow_custom` for brand/model).
2. Decide CYLINDREE source (Wikidata pass on 58 brands vs manual top-model table).
3. Decide moto catalog path (headless browser vs Wikidata filtered).

# Legal Minimums — Verification Report

**Date:** 2026-08-12 · **Method:** verified from Tunisian sources via the oxa VPS (Tunisian exit IP) + local scraped legal corpus. Sources tested: legislation.tn (down, HTTP 503 site-wide), jurisitetunisie.com (codes partially JS-rendered now), finances.gov.tn, webdo.tn, babnet.net, espacemanager.com, e-justice.tn (unreachable), bct.gov.tn (403).

## Results

| # | Hint (field) | Value | Status | Source |
|---|---|---|---|---|
| 1 | SALAIRE — SMIG | ≈ 528 DT/mois (48h/sem., 2025) | ✅ **Verified** | webdo.tn (official announcement): +7 % → 491,504 DT (juil. 2024, 48h), +7,5 % (janv. 2025) → 528,367 DT ; webdo 12-08-2026: no raise since |
| 2 | CAPITAL — SARL | min. 1 000 DT | ✅ **Verified** | jurisitetunisie.com — Code des Sociétés **art. 92** : « Le capital de la société à responsabilité limitée ne peut être inférieur à mille dinars » (hint corrected from art. 87 → 92) |
| 3 | JOURS_CONGES | 1,5 j/mois — 18 jours ouvrables/an | ✅ **Verified** | jurisitetunisie.com — CT art. 113-114 (in local corpus `data/raw/ct_clean.json`): base 1,5 j/mois, art. 114 cap « dix-huit jours ouvrables » |
| 4 | PREAVIS_MOIS | 1 mois (<5 ans), 2 mois (5-10), 3 mois (>10) — art. 15 CT | ⚠️ **Not primary-verified** | CT body on jurisitetunisie is now JS-rendered (old scrape lacks this article); legislation.tn down. Rule is the standard one, corroborated by press/legal practice — **user to confirm** |
| 5 | MONTANT_BOURSE (SIVP) | 80 % du SMIG (décret n° 2009-349) | ⚠️ **Not primary-verified** | décret 2009-349 not found on reachable sources (legislation.tn down, flocal archive 404) — **user to confirm** |
| 6 | TAUX_INTERET | taux d'intérêt légal en vigueur (art. 1101 COC) | ✅ **Safe by design** | no figure hardcoded (rate set annually by arrêté, JORT); art. 1101 COC present in local corpus |

## Actions taken

- `statuts-sarl.CAPITAL` hint: corrected citation **art. 87 → art. 92 CSC** (re-seeded).
- SALAIRE / JOURS_CONGES hints: kept (verified).
- PREAVIS_MOIS / MONTANT_BOURSE: kept pending user confirmation — values flagged below.
- TAUX_INTERET: kept as « en vigueur » (no number — safe against annual rate changes).

## Needs your confirmation (legal reviewer)

1. Préavis CDI = 1 mois (<5 ans) / 2 mois (5-10 ans) / 3 mois (>10 ans) — art. 15 CT ?
2. SIVP indemnity = 80 % du SMIG (décret n° 2009-349) ?
3. If you have the JORT references for either, I'll update the hints + citations.

# Contract Type Catalog

**Status: 22 templates built, 6 UI domains. 46 total types planned for full catalog (24 remaining).**

All 22 templates exist as JSON files in `data/templates/`. Each has: bilingual text (FR + AR), field placeholders, COC/CT/CS legal basis, and `source: public_examples` marker.

---

## 🏠 Logement / سكن (Housing) — 4 built

| # | Slug | Document | AR | Complexity | COC articles | Fields |
|---|---|---|---|---|---|---|
| 1 | `bail-habitation` | Contrat de bail d'habitation | عقد كراء مسكن | Medium | 727–827 | 19 |
| 2 | `compromis-vente-immobilier` | Compromis de vente immobilier | وعد بالبيع العقاري | High | 564–717 | 23 |
| 3 | `etat-des-lieux` | État des lieux (entrée/sortie) | محضر معاينة (دخول/خروج) | Low | 727–827 | 38 |
| 4 | `quittance-loyer` | Quittance de loyer | وصل كراء | Low | 727–827 | 10 |

| Planned (not yet built) | Demand | Notes |
|---|---|---|
| Contrat de bail commercial | ★★★★ | Code de commerce, pas de porte, droit au bail |
| Contrat de vente définitive | ★★★ | Code des Droits Réels |
| Contrat de gérance libre | ★★ | Fonds de commerce |
| Mandat de vente / location | ★★ | Immobilier agency |

---

## 💼 Travail / عمل (Work) — 6 built

| # | Slug | Document | AR | Complexity | Legal basis | Fields |
|---|---|---|---|---|---|---|
| 5 | `contrat-cdi` | Contrat de travail CDI | عقد عمل غير محدد المدة | Medium | CT + COC 828–953 | 22 |
| 6 | `contrat-cdd` | Contrat de travail CDD | عقد عمل محدد المدة | Medium | CT + COC 828–953 | 19 |
| 7 | `contrat-sivp` | Contrat SIVP | عقد صيغ | Low | Loi 93-11, Déc. 2009-349 | 19 |
| 8 | `contrat-karama` | Contrat Karama (emploi aidé) | عقد عمل مدعم — كرامة | Low | Programme emploi aidé | 19 |
| 9 | `lettre-demission` | Lettre de démission | رسالة استقالة | Low | Code du Travail | 14 |
| 10 | `rupture-conventionnelle` | Rupture conventionnelle CDI | اتفاقية إنهاء علاقة الشغل | Medium | Code du Travail | 14 |

| Planned (not yet built) | Demand | Notes |
|---|---|---|
| Contrat de stage / apprentissage | ★★★★ | TAFP, convention établissement |
| Contrat temps partiel | ★★ | Répartition horaire |
| Contrat de télétravail | ★★ | Équipement, droit à la déconnexion |
| Règlement intérieur d'entreprise | ★★ | High complexity |

---

## 💰 Argent & Prêt / مال وقرض (Money) — 2 built

| # | Slug | Document | AR | Complexity | COC articles | Fields |
|---|---|---|---|---|---|---|
| 11 | `reconnaissance-dette` | Reconnaissance de dette | اعتراف بدين | Low | 1054–1103 | 16 |
| 12 | `pret-particuliers` | Contrat de prêt entre particuliers | عقد قرض بين الخواص | Medium | 1054–1103 | 17 |

| Planned (not yet built) | Demand | Notes |
|---|---|---|
| Caution solidaire | ★★★ | COC 1478–1531 |
| Contrat de nantissement | ★★ | Gage mobilier/immobilier |

---

## 🚗 Véhicules / عربات (Vehicles) — 2 built

| # | Slug | Document | AR | Complexity | COC articles | Fields |
|---|---|---|---|---|---|---|
| 13 | `vente-voiture` | Vente de véhicule automobile | عقد بيع سيارة | Low | 564–717 | 18 |
| 14 | `vente-moto` | Vente de motocyclette | عقد بيع دراجة نارية | Low | 564–717 | 18 |

| Planned (not yet built) | Demand | Notes |
|---|---|---|
| Contrat de location de véhicule | ★★★ | COC louage — durée, kilométrage, caution |

---

## 🏢 Entreprise / مؤسسة (Business) — 3 built

| # | Slug | Document | AR | Complexity | Legal basis | Fields |
|---|---|---|---|---|---|---|
| 15 | `statuts-sarl` | Statuts de SARL | القانون الأساسي لشركة ذات مسؤولية محدودة | High | CS 90–159 + COC 1226–1451 | 12 |
| 16 | `prestation-services` | Contrat de prestation de services | عقد تقديم خدمات | Medium | COC 828–887 | 15 |
| 17 | `nda-confidentialite` | NDA / Accord de confidentialité | اتفاقية سرية | Medium | COC Livre I | 13 |

| Planned (not yet built) | Demand | Notes |
|---|---|---|
| PV d'assemblée générale | ★★★★ | SARL governance |
| Pacte d'associés | ★★★ | Droit de sortie, préemption |
| Cession de parts sociales | ★★★ | Garantie de passif |
| Conditions générales de vente (CGV) | ★★★ | E-commerce |
| Contrat de franchise | ★★ | High complexity |
| Contrat de partenariat commercial | ★★ | |

---

## 📋 Démarches / إجراءات (Admin) — 5 built

| # | Slug | Document | AR | Complexity | Legal basis | Fields |
|---|---|---|---|---|---|---|
| 18 | `procuration-speciale` | Procuration spéciale | وكالة خاصة | Low | COC 1104–1194 | 10 |
| 19 | `attestation-honneur` | Attestation sur l'honneur | شهادة على الشرف | Low | COC | 12 |
| 20 | `attestation-hebergement` | Attestation d'hébergement | شهادة إيواء | Low | Usage admin | 11 |
| 21 | `autorisation-parentale-voyage` | Autorisation parentale de voyage | إذن سفر للقاصر | Low | CSP | 16 |
| 22 | `mise-en-demeure` | Mise en demeure | إنذار قانوني | Low | COC 226–360 | 16 |

| Planned (not yet built) | Demand | Notes |
|---|---|---|
| Procuration générale | ★★★★ | COC mandat général |
| Attestation de salaire | ★★★ | Employeur → salarié |
| Accord transactionnel | ★★ | Litige, renonciation à poursuivre |
| Contrat de mariage (séparation de biens) | ★★ | CSP — lawyer-required, not Phase 1 |

---

## Summary

| Domaine | Built | Planned | Total target |
|---|---|---|---|
| 🏠 Logement | 4 | 4 | 8 |
| 💼 Travail | 6 | 4 | 10 |
| 💰 Argent | 2 | 2 | 4 |
| 🚗 Véhicules | 2 | 1 | 3 |
| 🏢 Entreprise | 3 | 6 | 9 |
| 📋 Démarches | 5 | 4 | 9 |
| **Total** | **22** | **21** | **43** |

> **Note:** Removed 3 from original catalog that require a lawyer at minimum: contrat de mariage (CSP — catastrophic if wrong), testament (succession law), donation/hiba. These go to Phase 6 with lawyer review.

## Demand Legend

| Rating | Meaning | Examples in catalog |
|---|---|---|
| ★★★★★ | Everyone needs this, highest search volume | Bail, CDI, Reconnaissance de dette, Vente voiture, SARL |
| ★★★★ | Very common, high volume | CDD, SIVP, Compromis vente, Prêt, Procuration, Prestation |
| ★★★ | Common among specific audience | NDA, Démission, Mise en demeure, Rupt. conventionnelle, Vente moto, État des lieux, Attestation honneur, Karama |
| ★★ | Niche | Attestation hébergement, Voyage enfant |
| ★ | Template is trivial | Quittance loyer |

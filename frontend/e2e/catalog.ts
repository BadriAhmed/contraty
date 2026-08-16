/**
 * The complete contract catalog. `templates.spec.ts` cross-checks this list
 * against what the backend actually serves so any add/remove/rename of a
 * template fails the suite loudly instead of silently skipping coverage.
 */
export const TEMPLATE_SLUGS = [
  "attestation-hebergement",
  "attestation-honneur",
  "autorisation-parentale-voyage",
  "bail-habitation",
  "compromis-vente-immobilier",
  "contrat-cdd",
  "contrat-cdi",
  "contrat-karama",
  "contrat-sivp",
  "etat-des-lieux",
  "lettre-demission",
  "mise-en-demeure",
  "nda-confidentialite",
  "prestation-services",
  "pret-particuliers",
  "procuration-speciale",
  "quittance-loyer",
  "reconnaissance-dette",
  "rupture-conventionnelle",
  "statuts-sarl",
  "vente-moto",
  "vente-voiture",
] as const;

export const LANGS = ["fr", "ar"] as const;

import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://contraty.tn";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/contracts/bail-habitation",
    "/contracts/contrat-cdi",
    "/contracts/contrat-cdd",
    "/contracts/lettre-demission",
    "/contracts/compromis-vente-immobilier",
    "/contracts/pret-particuliers",
    "/contracts/quittance-loyer",
    "/contracts/prestation-services",
    "/contracts/rupture-conventionnelle",
    "/contracts/etat-des-lieux",
    "/contracts/nda-confidentialite",
    "/contracts/statuts-sarl",
    "/contracts/vente-voiture",
    "/contracts/vente-moto",
    "/contracts/autorisation-parentale-voyage",
    "/contracts/attestation-hebergement",
    "/contracts/attestation-honneur",
    "/contracts/bail-commercial",
    "/contracts/contrat-karama",
    "/contracts/contrat-sivp",
    "/contracts/reconnaissance-dette",
    "/contracts/mise-en-demeure",
    "/contracts/procuration-speciale",
  ];

  const sitemap: MetadataRoute.Sitemap = [];
  for (const lang of ["fr", "ar"]) {
    for (const route of routes) {
      sitemap.push({
        url: `${SITE_URL}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1 : 0.8,
      });
    }
  }

  return sitemap;
}

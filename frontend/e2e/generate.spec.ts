import { test, expect } from "@playwright/test";
import { TEMPLATE_SLUGS, LANGS } from "./catalog";
import { fillWizardToNotes } from "./helpers";

/**
 * Live LLM flow — hits Gemini (costs quota) + WeasyPrint on every template in
 * both languages. Skipped by default; run explicitly with:
 *
 *   E2E_GENERATE=1 npm run test:e2e -- generate
 */
test.describe("contract generation (live)", () => {
  test.skip(!process.env.E2E_GENERATE, "set E2E_GENERATE=1 to run the live LLM flow");

  // One at a time — Gemini + WeasyPrint are expensive and rate-limited.
  test.describe.configure({ mode: "serial" });

  for (const lang of LANGS) {
    const isAr = lang === "ar";
    for (const slug of TEMPLATE_SLUGS) {
      test(`${slug} (${lang}): generates and downloads PDF + DOCX`, async ({ page, request }) => {
        test.setTimeout(240_000);
        await fillWizardToNotes(page, request, slug, lang);

        await page
          .getByRole("button", { name: isAr ? "إنشاء العقد" : "Générer le contrat", exact: true })
          .click();

        await expect(
          page.getByText(isAr ? "تم إنشاء العقد بنجاح!" : "Contrat généré avec succès !"),
        ).toBeVisible({ timeout: 180_000 });

        const pdfPromise = page.waitForEvent("download");
        await page.getByRole("button", { name: "PDF", exact: true }).click();
        const pdf = await pdfPromise;
        expect(pdf.suggestedFilename()).toMatch(/\.pdf$/);

        const docxPromise = page.waitForEvent("download");
        await page.getByRole("button", { name: "Word", exact: true }).click();
        const docx = await docxPromise;
        expect(docx.suggestedFilename()).toMatch(/\.docx$/);
      });
    }
  }
});

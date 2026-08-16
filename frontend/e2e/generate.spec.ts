import { test, expect } from "@playwright/test";
import { fillWizardToNotes } from "./helpers";

/**
 * Live LLM flow — hits Gemini (costs quota) and WeasyPrint, so it is skipped
 * by default. Run explicitly with:
 *
 *   E2E_GENERATE=1 npm run test:e2e -- generate
 */
const SLUG = "pret-particuliers";
const LANG = "fr";

test.describe("contract generation", () => {
  test.skip(!process.env.E2E_GENERATE, "set E2E_GENERATE=1 to run the live LLM flow");

  test("generates a contract and downloads the PDF", async ({ page, request }) => {
    test.setTimeout(180_000);
    await fillWizardToNotes(page, request, SLUG, LANG);

    await page.getByRole("button", { name: "Générer le contrat", exact: true }).click();

    await expect(
      page.getByText("Contrat généré avec succès !"),
    ).toBeVisible({ timeout: 150_000 });

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "PDF", exact: true }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });
});
